import {
  generateDarkTextColorForLightBg,
  THEME_ACCENT_COLOR,
  THEME_BG_COLOR,
} from "../components/helpers/colorHelper";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, message, notification, Progress, Space, Spin } from "antd";
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
const HEIGHT_ACHIEVEMENT = 80;
const HEIGHT_ACHIEVEMENT_TITLE = 40;
const HEIGHT_ACHIEVEMENT_DESC = 40;

export default function Atom({
  activeTab,
  setActiveTab,
  setTitleMain,
  forceRefreshGame,
  setForceRefreshGame,
  setTotalCount,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const steamtracker = useSelector((state) => state.steamtracker);
  const [messageApi, contextHolder] = message.useMessage();

  const [values, setValues] = useState({
    selectedLeftTab: 0,
    selectedMiddleTab: 0,
    gamesSheetData: [],
    gamesSheetDataLoading: false,
    selectedGame: "",
    completedAchs: [],
    achsCompletedLoading: false,
    hoveredAch: "",
    toShowAch: {},
    toShow: false,
    gameView: 0,
  });

  const openNotification = () => {
    notification.open({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

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

  useEffect(() => {
    let allCompletedTitles = values?.completedAchs?.map((ach) => ach?.title);
    let realCompleted = values?.gamesSheetData?.filter((ach) => {
      return allCompletedTitles?.includes(
        `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
      );
    });
    setTotalCount(realCompleted?.length);
  }, [values?.gamesSheetData, values?.completedAchs]);

  const refreshGamesAndAchs = () => {
    refreshGames();
    refreshCompletedGames();
    setForceRefreshGame(false);
  };

  const markAchComplete = (ach) => {
    setValues((old) => ({ ...old, toShow: true, toShowAch: ach }));
    let achId = `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`;
    axios.post("/api/completed", { title: achId }).then((response) => {
      refreshCompletedGames();
    });
  };

  const removeAchComplete = (ach) => {
    let achId = `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`;
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

  useEffect(() => {
    refreshGamesAndAchs();
  }, []);

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

  sortedAchs = sortedAchs?.reverse();

  let sortedIndexMapper = {};
  sortedAchs?.forEach((ach, index) => {
    sortedIndexMapper[`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`] =
      sortedAchs?.length - index;
  });

  const playSound = (link) => {
    const audio = new Audio(link);
    audio.play();
  };

  useEffect(() => {
    if (values?.toShow) {
      playSound("/effect.mp3");
    } else {
    }
    let timer = setTimeout(() => {
      setValues((old) => ({ ...old, toShow: false, toShowAch: {} }));
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [values?.toShow]);

  let orderAchs = selectedGameAchs?.filter(
    (ach) =>
      !allCompletedTitles?.includes(
        `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
      )
  );

  let achToShowForGame = [];

  if (activeTab == 1) {
    achToShowForGame = orderAchs;
  } else if (activeTab == 2) {
    achToShowForGame = sortedAchs?.filter(
      (ach) => ach?.["GAME NAME"] == values?.selectedGame
    );
  }

  return (
    <Container>
      {contextHolder}
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
                        setActiveTab(2);
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
                            marginRight: ".5rem",
                            fontSize: ".9rem",
                            transform: "translate(3px,1px)",
                          }}
                        >
                          <FaTrophy />
                        </span>{" "}
                        <span style={{ marginRight: ".5rem" }}>
                          {completedAchs?.length}/{allAchs?.length}
                        </span>
                      </Trophies>
                      <ProgressInner>
                        <Progress percent={completion?.toFixed(0)} />
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
              {achToShowForGame?.map((ach) => {
                let isCompleted = values?.completedAchs
                  ?.map((ach) => ach?.title)
                  ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`);

                return (
                  <AchSingleContainer>
                    {isCompleted && (
                      <Complete
                        onClick={() => {
                          removeAchComplete(ach);
                        }}
                      >
                        {
                          sortedIndexMapper?.[
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          ]
                        }
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
                    {!isCompleted && (
                      <InCompleted
                        onClick={() => {
                          markAchComplete(ach);
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
              {achToShowForGame?.map((ach) => {
                let isCompleted = values?.completedAchs
                  ?.map((ach) => ach?.title)
                  ?.includes(`${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`);

                return (
                  <AchSingleContainer>
                    {isCompleted && (
                      <Complete
                        onClick={() => {
                          removeAchComplete(ach);
                        }}
                      >
                        {
                          sortedIndexMapper?.[
                            `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                          ]
                        }
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
                    {!isCompleted && (
                      <InCompleted
                        onClick={() => {
                          markAchComplete(ach);
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
              {sortedAchs?.map((ach, index) => {
                return (
                  <AchSingleContainer1>
                    <CompleteLocked
                      onClick={() => {
                        removeAchComplete(
                          `${ach?.["GAME NAME"]}-${ach?.["ACH NAME"]}`
                        );
                      }}
                    >
                      {sortedAchs?.length - index}{" "}
                      <span
                        style={{
                          marginRight: ".15rem",
                          fontSize: ".8rem",
                          transform: "translate(3px,1px)",
                        }}
                      >
                        <FaTrophy />
                      </span>
                    </CompleteLocked>
                    <Name>{ach?.["GAME NAME"]?.slice(0, 10) + "..."}</Name>
                    <AchievementForGameSingle
                      image={ach?.["ACH IMAGE"]}
                    ></AchievementForGameSingle>
                    <AchDataContainer>
                      <AchTitle2>{ach?.["ACH NAME"]}</AchTitle2>
                      <AchDetails2>{ach?.["ACH DESC"]}</AchDetails2>
                    </AchDataContainer>
                  </AchSingleContainer1>
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
      {values?.toShow && (
        <ToShowWrapper>
          <AchSingleContainer3>
            <CompleteLockedToShow
              onClick={() => {
                removeAchComplete(
                  `${values?.toShowAch?.["GAME NAME"]}-${values?.toShowAch?.["ACH NAME"]}`
                );
              }}
            >
              DONE
              <span
                style={{
                  marginRight: ".15rem",
                  fontSize: ".8rem",
                  transform: "translate(3px,1px)",
                }}
              >
                <FaTrophy />
              </span>
            </CompleteLockedToShow>
            <AchievementForGameSingle
              image={values?.toShowAch?.["ACH IMAGE"]}
            ></AchievementForGameSingle>
            <AchDataContainer>
              <AchTitle2>{values?.toShowAch?.["ACH NAME"]}</AchTitle2>
              <AchDetails2>{values?.toShowAch?.["ACH DESC"]}</AchDetails2>
            </AchDataContainer>
          </AchSingleContainer3>
        </ToShowWrapper>
      )}
    </Container>
  );
}

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 50%;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 1rem;
`;

const Options2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0rem 1rem 2rem 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const ToShowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: -1rem;
  left: 0;
  animation: slideUp 0.25s linear forwards;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Trophies = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 60px;
  margin-right: 1rem;
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
  transform: translate(30%, -55%) rotate(-90deg);
  background-color: #5474fd;
  color: ${generateDarkTextColorForLightBg("#5474FD")};
  right: 0rem;
  top: 51%;
  padding: 0;
  height: 30px;

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
  transform: translate(30%, -55%) rotate(-90deg);
  right: 0rem;
  top: 51%;
  padding: 0;
  font-weight: bolder;
  height: 30px;

  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
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
  left: -2.5rem;
  top: 50%;
  height: 20px;
  padding: 0;
  font-weight: bolder;

  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
`;

const CompleteLockedToShow = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: #3bd987;
  color: ${generateDarkTextColorForLightBg("#3bd987")};
  font-size: 1rem;
  position: absolute;
  transform: translate(30%, -55%) rotate(-90deg);
  right: 0rem;
  top: 51%;
  padding: 0;
  font-weight: bolder;

  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
  height: 30px;
`;

const Name = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: #57575783;
  font-size: 0.75rem;
  position: absolute;
  transform: translateY(-50%) rotate(-90deg);
  right: -2.5rem;
  top: 51%;
  padding: 0;
  height: 20px;
  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
`;

const AchSingleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #171b2a;
  margin: 0rem 0.25rem 0.5rem 0.25rem;
  width: 100%;
  position: relative;
`;

const AchSingleContainer1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #171b2a;
  margin: 0rem 0.25rem 0.5rem 0.25rem;
  padding-left: 1rem;
  width: 100%;
  position: relative;
`;

const AchSingleContainer3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1d2033;
  margin: 0rem 0.25rem 0.5rem 0.25rem;
  width: 100%;
  position: relative;
`;

const Refresh = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111923;
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
  flex: 1;
  height: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
  width: 100%;
  padding: 0rem 0.5rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.9rem;
  min-height: ${(props) => `${HEIGHT_ACHIEVEMENT_TITLE}px`};
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.25rem;
`;

const AchDetails = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.8rem;
  flex: 1;
  opacity: 0.5;
  width: 100%;
  min-height: ${(props) => `${HEIGHT_ACHIEVEMENT_DESC}px`};
  padding: 0.5rem 2rem 0rem 0.25rem;
`;

const AchTitle2 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.9rem;
  width: 100%;
  flex: 1;
  min-height: ${(props) => `${HEIGHT_ACHIEVEMENT_TITLE}px`};
  padding: 0.5rem 2rem 0.5rem 0.25rem;
`;

const AchDetails2 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.8rem;
  flex: 1;
  opacity: 0.5;
  width: 100%;
  min-height: ${(props) => `${HEIGHT_ACHIEVEMENT_DESC}px`};
  padding: 0.5rem 2rem 0rem 0.25rem;
`;

const AchievementForGameSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
  height: ${(props) => `${HEIGHT_ACHIEVEMENT}px`};
  background: ${(props) => `url("${props.image}")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;

const GameSelectedData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex-direction: column;
  min-height: 80vh;
  max-height: 80vh;
  overflow: scroll;
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
  height: 80px;
  justify-content: center;
  background: ${(props) => `url("${props?.image}")`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
  min-height: 77vh;
  max-height: 77vh;
  overflow: scroll;
`;

const TopFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const FilterRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
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
  position: relative;
`;
