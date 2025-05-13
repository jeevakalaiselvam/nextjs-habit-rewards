import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGames } from "../store/gameSlice";
import styled from "styled-components";
import Select from "react-select";
import { HEADER_IMAGE } from "./helpers/urlHelper";
import { Progress, Spin } from "antd";
import { FaTrophy } from "react-icons/fa";
import {
  GAME_UNLOCK_TYPE_ALL,
  getaUnlockedAchievementsByType,
} from "./helpers/gameHelper";
import { generateDarkTextColorForLightBg } from "./helpers/colorHelper";
import { LoadingOutlined } from "@ant-design/icons";

const HEIGHT_ACHIEVEMENT = 70;
const HEIGHT_ACHIEVEMENT_TITLE = 40;
const HEIGHT_ACHIEVEMENT_DESC = 40;

export default function AchievementsIcons({ recent, singleGame }) {
  const dispatch = useDispatch();
  const { habittracker } = useSelector((state) => state);
  const { games, selectedGameId, loading } = habittracker;
  const game = games?.find((game) => game?.id == selectedGameId);
  const [selectedAch, setSelectedAch] = useState({});

  let achSorted = [];

  if (!recent) {
    achSorted = [...(game?.achievements ?? [])];
    achSorted = achSorted?.sort(
      (ach1, ach2) => ach2?.percentage - ach1?.percentage
    );
  } else {
    achSorted = getaUnlockedAchievementsByType(games, GAME_UNLOCK_TYPE_ALL);
  }

  let actoSHow =
    Object.keys(selectedAch)?.length > 0 ? selectedAch : achSorted?.[0];

  if (loading) {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  } else {
    return (
      <Container>
        <MainContainer singleGame={singleGame}>
          <MainInner>
            {achSorted?.length == 0 && (
              <div style={{ width: "100%", textAlign: "center" }}>
                No Unlocks
              </div>
            )}
            {achSorted?.length > 0 &&
              achSorted?.map((ach, index) => {
                return (
                  <AchievementContainer>
                    <Trigger achieved={ach?.achieved}>{index + 1}</Trigger>
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
        {achSorted?.length > 0 && (
          <SingleAchContainer>
            <AchievementContainer2>
              <Icon1
                icon={actoSHow?.icon}
                onClick={() => {
                  if (true && window !== "undefined") {
                    const searchQuery = `${
                      actoSHow?.displayName
                    } ach ${encodeURIComponent(actoSHow?.gameName)} `;
                    window.open(
                      `https://www.google.com/search?q=${searchQuery}`
                    );
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
                {!actoSHow?.achieved == 1 && (
                  <InCompleted onClick={() => {}}>ACTIVE</InCompleted>
                )}

                {actoSHow?.achieved == 1 && (
                  <Complete onClick={() => {}}>
                    DONE
                    <span
                      style={{
                        fontSize: ".8rem",
                        transform: "translate(3px,1px)",
                      }}
                    >
                      <FaTrophy />
                    </span>
                  </Complete>
                )}
              </Data>
            </AchievementContainer2>
          </SingleAchContainer>
        )}
      </Container>
    );
  }
}

const InCompleted = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #575757;
  color: #b4b4b4;
  cursor: pointer;
  position: absolute;
  background-color: #5474fd;
  color: ${generateDarkTextColorForLightBg("#5474FD")};
  transform-origin: center;
  right: 0;
  top: 50%;
  transform: translate(25%, -50%) rotate(-90deg);
  padding: 0;
  height: 30px;
  font-weight: bolder;
  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
`;

const Complete = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: #3bd987;
  color: ${generateDarkTextColorForLightBg("#3bd987")};
  position: absolute;
  transform-origin: center;
  right: 0;
  top: 50%;
  transform: translate(25%, -50%) rotate(-90deg);
  padding: 0;
  font-weight: bolder;
  height: 30px;

  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
`;

const SingleAchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  padding: 0rem;
  height: 70px;
`;

const Trigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  font-size: 0.9rem;
  background-color: ${(props) => (props.achieved ? "#3BD987" : "#17435c")};
  color: ${(props) =>
    props.achieved ? generateDarkTextColorForLightBg("#3BD987", 50) : "#aaa"};
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
  z-index: 2;
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
  background-color: #171b2a;
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
  padding-bottom: 1rem;
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
