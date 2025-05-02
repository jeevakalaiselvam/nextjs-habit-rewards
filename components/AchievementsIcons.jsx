import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGames } from "../store/gameSlice";
import styled from "styled-components";
import Select from "react-select";
import { HEADER_IMAGE } from "./helpers/urlHelper";
import { Progress } from "antd";
import { FaTrophy } from "react-icons/fa";
import {
  GAME_UNLOCK_TYPE_ALL,
  getaUnlockedAchievementsByType,
} from "./helpers/gameHelper";

export default function AchievementsIcons({ recent, singleGame }) {
  const dispatch = useDispatch();
  const { habittracker } = useSelector((state) => state);
  const { games, selectedGameId } = habittracker;
  const game = games?.find((game) => game?.id == selectedGameId);
  const [selectedAch, setSelectedAch] = useState({});

  let achSorted = [];

  if (!recent) {
    achSorted = [...game?.achievements];
    achSorted = achSorted?.sort(
      (ach1, ach2) => ach2?.percentage - ach1?.percentage
    );
  } else {
    achSorted = getaUnlockedAchievementsByType(games, GAME_UNLOCK_TYPE_ALL);
  }

  let actoSHow =
    Object.keys(selectedAch)?.length > 0 ? selectedAch : achSorted?.[0];

  return (
    <Container>
      <MainContainer singleGame={singleGame}>
        <MainInner>
          {achSorted?.map((ach, index) => {
            return (
              <AchievementContainer>
                <Icon
                  icon={ach?.icon}
                  onClick={() => {
                    setSelectedAch(ach);
                    if (false && window !== "undefined") {
                      const searchQuery = `${
                        ach?.displayName
                      } ach ${encodeURIComponent(ach?.gameName)} `;
                      window.open(
                        `https://www.google.com/search?q=${searchQuery}`
                      );
                      // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
                    }
                  }}
                ></Icon>
              </AchievementContainer>
            );
          })}
        </MainInner>
      </MainContainer>
      <SingleAchContainer>
        <AchievementContainer2>
          <Icon1
            icon={actoSHow?.icon}
            onClick={() => {
              if (true && window !== "undefined") {
                const searchQuery = `${
                  actoSHow?.displayName
                } ach ${encodeURIComponent(actoSHow?.gameName)} `;
                window.open(`https://www.google.com/search?q=${searchQuery}`);
                // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
              }
            }}
          ></Icon1>
          <Data>
            <Inner
              width={actoSHow?.percentage}
              color={actoSHow?.achieved == 1 ? "#145935" : "#17435c"}
            ></Inner>
            <Title>{actoSHow?.displayName}</Title>
            <Description>{actoSHow?.description}</Description>
            {
              <Percentage
                color={
                  actoSHow?.achieved == 1
                    ? "#3BD987"
                    : actoSHow?.percentage < 1
                    ? "#ffe23b"
                    : "#66c0f4"
                }
              >
                {actoSHow?.percentage}%
              </Percentage>
            }
          </Data>
        </AchievementContainer2>
      </SingleAchContainer>
    </Container>
  );
}

const SingleAchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  padding: 0rem;
  height: 70px;
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
  width: 65.8px;
  height: 65.8px;
  z-index: 2;
  background: ${(props) => `url(${props.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const Icon1 = styled.div`
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

const AchievementContainer2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080c11;
  margin-bottom: 0.5rem;
  position: relative;
  margin: 0.25rem;
  width: 100%;
`;

const AchievementContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080c11;
  margin-bottom: 0.5rem;
  position: relative;
  margin: 0.25rem;
`;

const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
  max-height: ${(props) => (props.singleGame ? "77vh" : "80vh")};
  flex: 1;
  padding: 0rem 0.25rem;
  overflow: scroll;
`;

const MainInner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
  max-height: ${(props) => (props.singleGame ? "77vh" : "80vh")};
  flex: 1;
  padding: 0rem 0.25rem;
  overflow: scroll;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 100%;
  min-height: 80vh;
  max-height: 80vh;
  padding: 0rem 0.25rem;
`;
