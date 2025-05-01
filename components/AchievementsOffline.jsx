import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGames } from "../store/gameSlice";
import styled from "styled-components";
import Select from "react-select";
import { HEADER_IMAGE } from "./helpers/urlHelper";
import { Progress, Spin } from "antd";
import { FaTrophy } from "react-icons/fa";
import { GAME_UNLOCK_TYPE_ALL } from "./helpers/constantHelper";
import { getaUnlockedAchievementsByType } from "./helpers/gameHelper";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

export default function AchievementsOffline({ excelGames }) {
  const dispatch = useDispatch();
  const { habittracker } = useSelector((state) => state);
  const { steamGames, selectedGameId } = habittracker;
  const [game, setGame] = useState({});
  const [hiddenData, setHiddenData] = useState({});
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(false);
  const [hiddenLoading, setLoadingHidden] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);

  let achSorted = [];

  achSorted = [...(game?.achievements ?? [])];
  achSorted = achSorted?.sort(
    (ach1, ach2) => ach2?.percentage - ach1?.percentage
  );

  const getHidden = async () => {
    try {
      setHiddenData(true);
      const hiddenResponse = await axios.get(`/api/hidden/${selectedGameId}`);
      const hiddenData = hiddenResponse.data.hiddenMapper;
      setHiddenData(hiddenData);
      setHiddenData(false);
    } catch (e) {
      console.error(e);
      setHiddenData(false);
    }
  };

  useEffect(() => {
    getHidden();
  }, [selectedGameId]);

  const removeCompleted = async (achId) => {
    try {
      const res = await fetch("/api/achievement", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: selectedGameId, achievementId: achId }),
      });

      const data = await res.json();
      getCompletedAchievements(selectedGameId);
    } catch (err) {
      console.error("Error deleting achievement:", err);
    }
  };

  const markAchCompleted = async (achId) => {
    try {
      const res = await fetch("/api/achievement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: selectedGameId, achievementId: achId }),
      });

      const data = await res.json();
      getCompletedAchievements(selectedGameId);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getCompletedAchievements = async (gameId) => {
    try {
      setCompletedLoading(true);
      const res = await fetch(`/api/achievement?gameId=${gameId}`);
      const data = await res.json();
      setCompleted(data);
      setCompletedLoading(false);
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
      setCompletedLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGameId) getCompletedAchievements(selectedGameId);
  }, [selectedGameId]);

  const getSteamData = (gameId) => {
    setLoading(true);
    axios
      .get(`/api/steam/${gameId}`)
      .then((res) => {
        setGame(res?.data?.data ?? {});
        setLoading(false);
      })
      .then((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSteamData(selectedGameId);
  }, [selectedGameId]);

  let gameMain = excelGames?.find((game) => game?.gameId == selectedGameId);
  console.log(excelGames, selectedGameId, gameMain);

  if (loading || hiddenLoading || completedLoading) {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  } else
    return (
      <Container>
        {achSorted?.length == 0 && !loading && (
          <NoAchievements>No Achievements</NoAchievements>
        )}
        {achSorted?.map((ach) => {
          let hiddenDesc =
            hiddenData?.[ach?.displayName?.toLowerCase().trim()] ??
            ach?.description ??
            "HIDDEN";

          let achieved = completed?.achievements?.includes(ach?.name);

          return (
            <AchievementContainer onClick={() => {}}>
              <Icon
                icon={ach?.icon}
                onClick={(e) => {
                  if (true && window !== "undefined") {
                    const searchQuery = `${
                      ach?.displayName
                    } Achievement ${encodeURIComponent(gameMain?.NAME)} `;
                    window.open(
                      `https://www.google.com/search?q=${searchQuery}`
                    );
                    // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
                  }
                }}
              ></Icon>
              <Data
                onClick={() => {
                  if (achieved) removeCompleted(ach?.name);
                  else markAchCompleted(ach?.name);
                }}
              >
                <Inner
                  width={ach?.percentage}
                  color={achieved ? "#145935" : "#17435c"}
                ></Inner>
                <Title>{ach?.displayName}</Title>
                <Description>{hiddenDesc}</Description>
                <Percentage color={achieved ? "#3BD987" : "#66c0f4"}>
                  {ach?.percentage}%
                </Percentage>
              </Data>
            </AchievementContainer>
          );
        })}
      </Container>
    );
}

const NoAchievements = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Percentage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color};
  padding: 0.25rem;
  font-size: 0.85rem;
  position: absolute;
  z-index: 2;
  right: 0;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  min-height: 70px;
  z-index: 1;
  background-color: ${(props) => props.color};
  width: ${(props) => `${props.width}%`};
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  z-index: 2;
  background: ${(props) => `url(${props.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const Data = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-height: 70px;
  position: relative;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 0.95rem;
  z-index: 2;
  flex: 1;
`;

const Description = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0rem 3rem 0 0.5rem;
  flex: 1;
  font-size: 0.9rem;
  z-index: 2;
  opacity: 0.5;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: #080c11;
  margin-bottom: 0.5rem;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 80vh;
  max-height: 80vh;
  padding: 0rem 0.25rem;
  overflow: scroll;
`;
