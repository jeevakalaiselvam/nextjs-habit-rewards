import {
  generateDarkTextColorForLightBg,
  THEME_ACCENT_COLOR,
  THEME_BG_COLOR,
} from "../components/helpers/colorHelper";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, message, Progress, Space, Spin } from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { TbRefresh, TbRefreshDot } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const MAPPING_ORDER = {
  0: "GAME IMAGE",
  1: "GAME NAME",
  2: "ACH NAME",
  3: "ACH DESC",
  4: "ACH IMAGE",
};

export default function Atom({
  activeTab,
  setActiveTab,
  setTitleMain,
  forceRefreshGame,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const steamtracker = useSelector((state) => state.steamtracker);

  const [values, setValues] = useState({
    selectedLeftTab: 0,
    selectedMiddleTab: 0,
    gamesSheetData: [],
    gamesSheetDataLoading: false,
    selectedGame: "",
    completedAchs: [],
    achsCompletedLoading: false,
    hoveredAch: "",
  });

  const refreshGames = () => {
    setValues((old) => ({ ...old, gamesSheetDataLoading: true }));
    axios.get("/api/sheet").then((response) => {
      let gamesInner = response?.data?.rows?.slice(1) ?? [];
      let gamesMorphed = gamesInner?.map((singleGame) => {
        let mainGame = {};
        Object.keys(MAPPING_ORDER).forEach((index) => {
          mainGame[MAPPING_ORDER[index]] = singleGame?.[index];
        });
        return mainGame;
      });
      console.log({ gamesMorphed });
      setValues((old) => ({
        ...old,
        gamesSheetData: gamesMorphed ?? [],
        gamesSheetDataLoading: false,
      }));
    });
  };

  const refreshCompletedGames = () => {
    setValues((old) => ({ ...old, achsCompletedLoading: true }));
    axios.get("/api/completed").then((response) => {
      setValues((old) => ({
        ...old,
        completedAchs: response?.data?.achievements ?? [],
        achsCompletedLoading: false,
      }));
    });
  };

  const refreshGamesAndAchs = () => {
    refreshGames();
    refreshCompletedGames();
  };

  const markAchComplete = (achId) => {
    axios.post("/api/completed", { title: achId }).then((response) => {
      refreshCompletedGames();
    });
  };

  const removeAchComplete = (achId) => {
    axios
      .delete("/api/completed", { data: { title: achId } })
      .then((response) => {
        refreshCompletedGames();
      });
  };

  useEffect(() => {
    if (forceRefreshGame) {
      refreshGamesAndAchs();
    }
  }, [forceRefreshGame]);

  const selectedGameDefault =
    values?.selectedGame ?? values?.gamesSheetData?.[0]?.["GAME NAME"];

  const gamesMapped = {};

  values?.gamesSheetData?.forEach((ach) => {
    if (!gamesMapped[ach?.["GAME NAME"]]) {
      gamesMapped[ach?.["GAME NAME"]] = [];
      gamesMapped[ach?.["GAME NAME"]].push(ach);
    } else {
      gamesMapped[ach?.["GAME NAME"]].push(ach);
    }
  });

  let selectedGameAchs = gamesMapped?.[selectedGameDefault];
  let allCompletedTitles = values?.completedAchs?.map((ach) => ach?.title);
  let sortedAchs = [];
  let allAchsCompleted = values?.gamesSheetData?.forEach((ach) => {
    if (
      allCompletedTitles?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`)
    ) {
      sortedAchs.push({
        ...ach,
        ...(values?.completedAchs?.find(
          (achInner) =>
            achInner?.title == `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
        ) ?? {}),
      });
    }
  });

  sortedAchs = sortedAchs?.sort(
    (ach1, ach2) => ach2?.createdAt - ach1?.createdAt
  );

  console.log({ sortedAchs });

  return (
    <Container>
      {activeTab == 0 && (
        <MainLeftContainer>
          {!values?.gamesSheetDataLoading && (
            <GamesContainer>
              {Object.keys(gamesMapped).map((key) => {
                let game = gamesMapped[key]?.[0];
                let allAchs = gamesMapped[key];
                let completedAchs = gamesMapped[key]?.filter((ach) =>
                  values?.completedAchs
                    ?.map((ach) => ach?.title)
                    ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`)
                );
                let completion = 0;

                if (completedAchs?.length > 0) {
                  completion = (completedAchs?.length / allAchs?.length) * 100;
                }
                return (
                  <GameItemContainer>
                    <GameTitle>{game?.["GAME NAME"]}</GameTitle>
                    <GameItem
                      image={game?.["GAME IMAGE"]}
                      onClick={() => {
                        setActiveTab(1);
                        setTitleMain("Achievements");
                        setValues((old) => ({
                          ...old,
                          selectedGame: game?.["GAME NAME"],
                          selectedMiddleTab: 0,
                        }));
                      }}
                    ></GameItem>
                    <ProgressInfo>
                      <Trophies>
                        <span
                          style={{
                            marginRight: ".25rem",
                            fontSize: ".9rem",
                            transform: "translateY(2px)",
                          }}
                        >
                          <FaTrophy />
                        </span>{" "}
                        {completedAchs?.length}/{allAchs?.length}
                      </Trophies>
                      <ProgressInner>
                        <Progress percent={completion} />
                      </ProgressInner>
                    </ProgressInfo>
                  </GameItemContainer>
                );
              })}
            </GamesContainer>
          )}
          {values?.gamesSheetDataLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                    marginTop: "2rem",
                  }}
                  spin
                />
              }
            />
          )}
        </MainLeftContainer>
      )}
      {activeTab == 1 && (
        <MainLeftContainer>
          {!values?.gamesSheetDataLoading && (
            <GameSelectedData>
              {selectedGameAchs?.map((ach) => {
                let isCompleted = values?.completedAchs
                  ?.map((ach) => ach?.title)
                  ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`);
                let isHovered =
                  values?.hoveredAch ==
                  `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`;

                return (
                  <AchSingleContainer>
                    {isCompleted && (
                      <Complete
                        onClick={() => {
                          removeAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                      >
                        DONE
                      </Complete>
                    )}
                    {!isCompleted && (
                      <InCompleted
                        onClick={() => {
                          markAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                        onMouseEnter={() => {
                          setValues((old) => ({
                            ...old,
                            hoveredAch: `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`,
                          }));
                        }}
                        onMouseLeave={() => {
                          setValues((old) => ({ ...old, hoveredAch: `` }));
                        }}
                      >
                        ACTIVE
                      </InCompleted>
                    )}
                    <AchievementForGameSingle
                      image={ach?.["ACH IMAGE"]}
                    ></AchievementForGameSingle>
                    <AchDataContainer>
                      <AchTitle>{ach?.["ACH NAME"]}</AchTitle>
                      <AchDetails>{ach?.["ACH DESC"]}</AchDetails>
                    </AchDataContainer>
                  </AchSingleContainer>
                );
              })}
            </GameSelectedData>
          )}
          {values?.gamesSheetDataLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                    marginTop: "2rem",
                  }}
                  spin
                />
              }
            />
          )}
        </MainLeftContainer>
      )}
      {activeTab == 2 && (
        <MainLeftContainer>
          {!values?.gamesSheetDataLoading && (
            <GameSelectedData>
              {sortedAchs?.map((ach) => {
                let isCompleted = values?.completedAchs
                  ?.map((ach) => ach?.title)
                  ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`);
                let isHovered =
                  values?.hoveredAch ==
                  `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`;

                return (
                  <AchSingleContainer>
                    {isCompleted && (
                      <Complete
                        onClick={() => {
                          removeAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                      >
                        DONE
                      </Complete>
                    )}
                    {!isCompleted && (
                      <InCompleted
                        onClick={() => {
                          markAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                        onMouseEnter={() => {
                          setValues((old) => ({
                            ...old,
                            hoveredAch: `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`,
                          }));
                        }}
                        onMouseLeave={() => {
                          setValues((old) => ({ ...old, hoveredAch: `` }));
                        }}
                      >
                        ACTIVE
                      </InCompleted>
                    )}
                    <AchievementForGameSingle
                      image={ach?.["ACH IMAGE"]}
                    ></AchievementForGameSingle>
                    <AchDataContainer>
                      <AchTitle>{ach?.["ACH NAME"]}</AchTitle>
                      <AchDetails>{ach?.["ACH DESC"]}</AchDetails>
                    </AchDataContainer>
                  </AchSingleContainer>
                );
              })}
            </GameSelectedData>
          )}
          {values?.gamesSheetDataLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                    marginTop: "2rem",
                  }}
                  spin
                />
              }
            />
          )}
        </MainLeftContainer>
      )}
      {activeTab == 3 && (
        <MainLeftContainer>
          {!values?.gamesSheetDataLoading && (
            <GameSelectedData>
              {sortedAchs?.map((ach) => {
                let isCompleted = values?.completedAchs
                  ?.map((ach) => ach?.title)
                  ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`);
                let isHovered =
                  values?.hoveredAch ==
                  `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`;

                return (
                  <AchSingleContainer>
                    {isCompleted && (
                      <Complete
                        onClick={() => {
                          removeAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                      >
                        DONE
                      </Complete>
                    )}
                    {!isCompleted && (
                      <InCompleted
                        onClick={() => {
                          markAchComplete(
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          );
                        }}
                        onMouseEnter={() => {
                          setValues((old) => ({
                            ...old,
                            hoveredAch: `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`,
                          }));
                        }}
                        onMouseLeave={() => {
                          setValues((old) => ({ ...old, hoveredAch: `` }));
                        }}
                      >
                        ACTIVE
                      </InCompleted>
                    )}
                    <AchievementForGameSingle
                      image={ach?.["ACH IMAGE"]}
                    ></AchievementForGameSingle>
                    <AchDataContainer>
                      <AchTitle>{ach?.["ACH NAME"]}</AchTitle>
                      <AchDetails>{ach?.["ACH DESC"]}</AchDetails>
                    </AchDataContainer>
                  </AchSingleContainer>
                );
              })}
            </GameSelectedData>
          )}
          {values?.gamesSheetDataLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                    marginTop: "2rem",
                  }}
                  spin
                />
              }
            />
          )}
        </MainLeftContainer>
      )}
    </Container>
  );
}

const Trophies = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 55px;
`;

const ProgressInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const GameItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const InCompleted = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #575757;
  color: #b4b4b4;
  cursor: pointer;
  position: absolute;
  transform: translateY(-50%) rotate(-90deg);
  right: -1.9rem;
  top: 51%;
  padding: 0;
  height: 40px;
  width: 65px;
`;

const Complete = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: #3bd987;
  color: ${generateDarkTextColorForLightBg("#3bd987")};
  position: absolute;
  transform: translateY(-50%) rotate(-90deg);
  right: -1.9rem;
  top: 51%;
  padding: 0;
  font-weight: bolder;
  height: 40px;
  width: 65px;
`;

const CompleteLocked = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: #3bd987;
  color: ${generateDarkTextColorForLightBg("#3bd987")};
  font-size: 1rem;
  position: absolute;
  transform: translateY(-50%) rotate(-90deg);
  left: -1.9rem;
  top: 51%;
  padding: 0;
  font-weight: bolder;
  width: 70px;
`;

const AchSingleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #292929;
  margin: 0rem 0.25rem 1rem 0.25rem;
  position: relative;
`;

const Refresh = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #292929;
  margin-right: 0.25rem;
  font-size: 1rem;
  padding: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: ${THEME_ACCENT_COLOR};
  }
`;

const AchDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 50px;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 225px;
  font-size: 0.95rem;
  height: 20px;
  padding: 0rem 1rem 0rem 0rem;
`;

const AchDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.85rem;
  flex: 1;
  opacity: 0.5;
  width: 225px;
  padding: 0rem 1rem 0rem 0rem;
`;

const AchievementForGameSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 70px;
  background: ${(props) => `url("${props.image}")`};
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
`;

const GameSelectedData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.25rem 0rem;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0rem 0.25rem;
`;

const GameItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  justify-content: center;
  background: ${(props) => `url("${props?.image}")`};
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  cursor: pointer;
  border: ${`1px solid #000000`};
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 75vh;
  max-height: 75vh;
  overflow: scroll;
`;

const MainLeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  padding: 0rem 0.5rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
