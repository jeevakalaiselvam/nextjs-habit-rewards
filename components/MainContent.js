import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_PLATINUM,
  COLOR_SILVER,
  COLOR_SILVER2,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
  COLOR_UNLOCKED_TEXT,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { useState } from "react";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TbEdit, TbPlayCard } from "react-icons/tb";
import { HiPlay } from "react-icons/hi2";
import {
  calculatePSLevelAndProgress,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
} from "../helpers/trophyHelper";
import GoldIcon from "./GoldIcon";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import { FaEdge } from "react-icons/fa";
import EditGameForm from "./EditGameForm";
import PlatinumIconS from "./PlatinumIconS";
import { LoadingOutlined } from "@ant-design/icons";
import { Collapse, Spin } from "antd";
import GameCdImage from "./GameCdImage";
import { formatDate } from "../helpers/dateHelper";
import Panel from "antd/es/splitter/Panel";
import axios from "axios";

const MAX_DESC = 80;
const MEDIUM_DESC = 60;

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  selectedMode,
  setSelectedMode,
}) {
  const [selectedRarity, setSelectedRarity] = useState("ULTRA RARE");
  const [selectedGame, setSelectedGame] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState("LIBRARY");
  const [active, setActive] = useState("PROFILE");
  const [gameData, setGameData] = useState({});
  const [activeAccKey, setAccActiveKey] = useState(null);

  let unearnedBG = 0;
  let platinumABG = 0;
  let goldABG = 0;
  let silverABG = 0;
  let bronzeABG = 0;
  let platinumBG = 0;
  let goldBG = 0;
  let silverBG = 0;
  let bronzeBG = 0;
  let totalBG = 0;

  selectedGame?.achievements?.forEach((ach) => {
    totalBG++;
    if (ach?.achieved == 0) {
      unearnedBG++;
      if (ach?.color == "Platinum") {
        platinumABG++;
      }
      if (ach?.color == "Gold") {
        goldABG++;
      }
      if (ach?.color == "Silver") {
        silverABG++;
      }
      if (ach?.color == "Bronze") {
        bronzeABG++;
      }
    } else {
      if (ach?.color == "Platinum") {
        platinumBG++;
      }
      if (ach?.color == "Gold") {
        goldBG++;
      }
      if (ach?.color == "Silver") {
        silverBG++;
      }
      if (ach?.color == "Bronze") {
        bronzeBG++;
      }
    }
  });

  let completedBG = selectedGame?.achievements?.filter(
    (item) => item?.achieved == 1
  )?.length;
  let completionBG = completedBG == 0 ? 0 : (completedBG / totalBG) * 100;

  let { color, rank } = calculateRankForCompletion(completionBG ?? 0);
  let lastAch = selectedGame?.achievements?.sort(
    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
  )?.[selectedGame?.achievements?.length - 1];

  let allDLCKeys = [
    {
      dlcKey: "DLC1",
      name: selectedGame?.dlc1Name,
      image: selectedGame?.dlc1Image,
    },
    {
      dlcKey: "DLC2",
      name: selectedGame?.dlc2Name,
      image: selectedGame?.dlc2Image,
    },
    {
      dlcKey: "DLC3",
      name: selectedGame?.dlc3Name,
      image: selectedGame?.dlc3Image,
    },
    {
      dlcKey: "DLC4",
      name: selectedGame?.dlc4Name,
      image: selectedGame?.dlc4Image,
    },
    {
      dlcKey: "DLC5",
      name: selectedGame?.dlc5Name,
      image: selectedGame?.dlc5Image,
    },
  ];

  allDLCKeys = allDLCKeys?.filter((dlc) => {
    let allDlcKeys = selectedGame?.dlcAchievements?.map((item) => item?.dlc);
    if (allDlcKeys?.includes(dlc?.dlcKey)) {
      return true;
    }
  });

  let sortedGames = games.sort((a, b) =>
    a?.name.localeCompare(b?.name, undefined, { sensitivity: "base" })
  );

  const { ultrarare, veryrare, rare, uncommon, common } =
    getAchsBasedOnRarity(games);

  let selectedRarityAchs = [];

  if (selectedRarity == "ULTRA RARE") {
    selectedRarityAchs = ultrarare;
  }

  if (selectedRarity == "VERY RARE") {
    selectedRarityAchs = veryrare;
  }

  if (selectedRarity == "RARE") {
    selectedRarityAchs = rare;
  }

  if (selectedRarity == "UNCOMMON") {
    selectedRarityAchs = uncommon;
  }

  if (selectedRarity == "COMMON") {
    selectedRarityAchs = common;
  }

  let allUnlockedAchs = [];

  games?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 1) {
        allUnlockedAchs.push(ach);
      }
    });
  });

  allUnlockedAchs = allUnlockedAchs?.sort(
    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
  );

  const togglePlatinum = (gameId) => {
    try {
      axios.post("/api/onboard", { gameId: gameId }).then((response) => {
        refreshData();
      });
    } catch (e) {}
  };

  return (
    <Container>
      {showEditModal && (
        <EditGameForm
          gameData={gameData}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          refreshData={refreshData}
          setGamesLoading={setGamesLoading}
        />
      )}
      {!gamesLoading && (
        <SRLeft>
          {selectedMode == "GAMES" && (
            <Games>
              <Games2LineR>
                {sortedGames?.map((game, index) => {
                  let allCompletion = 0;
                  let total = 0;
                  let unearned = 0;
                  let platinumA = 0;
                  let goldA = 0;
                  let silverA = 0;
                  let bronzeA = 0;
                  let platinum = 0;
                  let gold = 0;
                  let silver = 0;
                  let bronze = 0;

                  game?.achievements?.forEach((ach) => {
                    total++;
                    if (ach?.achieved == 0) {
                      unearned++;
                      if (ach?.color == "Platinum") {
                        platinumA++;
                      }
                      if (ach?.color == "Gold") {
                        goldA++;
                      }
                      if (ach?.color == "Silver") {
                        silverA++;
                      }
                      if (ach?.color == "Bronze") {
                        bronzeA++;
                      }
                    } else {
                      if (ach?.color == "Platinum") {
                        platinum++;
                      }
                      if (ach?.color == "Gold") {
                        gold++;
                      }
                      if (ach?.color == "Silver") {
                        silver++;
                      }
                      if (ach?.color == "Bronze") {
                        bronze++;
                      }
                    }
                  });

                  let targetToGet = 0;
                  let targetObtained = 0;

                  let FACTOR = 50;

                  if (game?.price > 0 && game?.price <= 1000) {
                    FACTOR = 25;
                  } else if (game?.price > 1000 && game?.price <= 2000) {
                    FACTOR = 50;
                  } else if (game?.price > 2000 && game?.price <= 3000) {
                    FACTOR = 75;
                  } else if (game?.price > 3000) {
                    FACTOR = 100;
                  }

                  targetToGet =
                    game?.price > 0 ? Math.ceil(game?.price / FACTOR) : 1;

                  targetObtained = game?.completed;

                  targetObtained =
                    targetObtained > targetToGet ? targetToGet : targetObtained;

                  let completed = game?.achievements?.filter(
                    (item) => item?.achieved == 1
                  )?.length;
                  let completion = game?.completion;

                  completion = completion >= 100 ? 100 : completion;
                  allCompletion = allCompletion + completion;
                  if (total == completed) {
                    completed = completed + 1;
                  }

                  let { color, rank } = calculateRankForCompletion(completion);
                  let lastAch = game?.achievements?.sort(
                    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
                  )?.[game?.achievements?.length - 1];

                  let isPlatinumDone =
                    game?.achievements?.filter(
                      (ach) => ach?.color == "Platinum" && ach?.achieved == 1
                    )?.length > 0;

                  return (
                    <GameContainer
                      onClick={() => {
                        setSelectedGame(game);
                        setSelectedMode("GAME");
                      }}
                      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                    >
                      <GameRightCard>
                        <GRTop>
                          <GameData>
                            <GameTitle
                              onClick={() => {
                                setSelectedGame(game);
                                setSelectedMode("GAME");
                              }}
                            >
                              {game?.name}
                            </GameTitle>
                            <GameCompletion>
                              {completed} of {total} Trophies
                            </GameCompletion>
                          </GameData>
                        </GRTop>
                        <GRBottom>
                          <GameInfo>
                            <Trophies>
                              <TTop>
                                <TSingle>
                                  <GoldIconS />
                                  <span
                                    style={{
                                      transform: "translate(-.5rem,-.25rem)",
                                      color: COLOR_GOLD,
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {gold}
                                  </span>
                                </TSingle>
                                <TSingle>
                                  <SilverIconS />
                                  <span
                                    style={{
                                      transform: "translate(-.5rem,-.25rem)",
                                      color: COLOR_SILVER2,
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {silver}
                                  </span>
                                </TSingle>
                                <TSingle>
                                  <BronzeIconS />
                                  <span
                                    style={{
                                      transform: "translate(-.5rem,-.25rem)",
                                      color: COLOR_BRONZE,
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {bronze}
                                  </span>
                                </TSingle>
                              </TTop>
                              <TBottom>
                                <Outer>
                                  <Inner
                                    percentage={Number(
                                      game?.completion
                                    )?.toFixed(1)}
                                  ></Inner>
                                  <Text>
                                    {Number(game?.completion)?.toFixed(1)} %
                                  </Text>
                                </Outer>
                              </TBottom>
                            </Trophies>
                            <Seperator></Seperator>
                            <Platinum isPlatinum={isPlatinumDone}>
                              <span
                                style={{
                                  opacity: isPlatinumDone ? 1 : 0.25,
                                }}
                              >
                                <PlatinumIcon />
                              </span>
                              <span
                                style={{
                                  fontSize: ".75rem",
                                  margin: ".25rem",
                                  transform: "translateX(.25rem)",
                                  opacity: isPlatinumDone ? 1 : 0.25,
                                  color: generateDarkTextColorForLightBg(
                                    "#b9c7e5",
                                    20
                                  ),
                                }}
                              >
                                {lastAch?.percentage} %
                              </span>
                            </Platinum>
                            <Seperator></Seperator>
                            <Rank>
                              <span
                                style={{ fontSize: "1.5rem", color: color }}
                              >
                                {rank}
                              </span>
                              <span style={{ fontSize: ".7rem", color: color }}>
                                RANK
                              </span>
                            </Rank>
                          </GameInfo>
                        </GRBottom>
                      </GameRightCard>
                      <GameImage
                        url={HEADER_IMAGE(game?.id)}
                        center
                      ></GameImage>
                    </GameContainer>
                  );
                })}
              </Games2LineR>
            </Games>
          )}
          {selectedMode == "GAME" && (
            <Games>
              <Game2Line>
                {selectedGame?.achievements?.map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    "Hidden achievement:"
                  )?.[1];

                  return (
                    <AchCard
                      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                      achieved={ach?.achieved}
                    >
                      {ach?.achieved == 1 && (
                        <Unlocked>
                          {formatDate(new Date(ach?.unlocktime * 1000))}
                        </Unlocked>
                      )}
                      {ach?.color != "Platinum" && (
                        <AchIconOuter achieved={ach?.achieved}>
                          <AchIcon
                            icon={
                              ach?.achieved == 1 ? ach?.icon : ach?.icongray
                            }
                            onClick={() => {
                              if (window !== "undefined") {
                                const searchQuery = `${
                                  ach?.displayName
                                } achievement ${encodeURIComponent(
                                  ach?.gameName
                                )} `;
                                window.open(
                                  `https://www.google.com/search?q=${searchQuery}`
                                );
                                // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
                              }
                            }}
                          ></AchIcon>
                        </AchIconOuter>
                      )}
                      {ach?.color == "Platinum" && (
                        <AchIconOuterPlatinum
                          achieved={ach?.achieved}
                          onClick={() => {
                            togglePlatinum(selectedGame?.id);
                          }}
                        >
                          <PlatinumIcon />
                        </AchIconOuterPlatinum>
                      )}
                      <AchData>
                        <AchTitle>{ach?.displayName}</AchTitle>
                        <AchDesc
                          higher={ach?.description?.length > MAX_DESC}
                          medium={ach?.description?.length > MEDIUM_DESC}
                        >
                          {desc2 ? desc2 : desc3 ? desc3 : desc1}
                        </AchDesc>
                      </AchData>
                      <Seperator padding={".25rem"} />
                      <AchTrophy>
                        <span
                          style={{
                            fontSize: ".5rem",
                            transform: "translate(0.25rem, 0rem)",
                          }}
                        >
                          {ach?.color == "Platinum" && <PlatinumIconS />}
                          {ach?.color == "Gold" && <GoldIconS />}
                          {ach?.color == "Silver" && <SilverIconS />}
                          {ach?.color == "Bronze" && <BronzeIconS />}{" "}
                        </span>
                        <AchRarity>
                          <span style={{ fontSize: ".5rem" }}>
                            {Number(ach?.percentage)?.toFixed(1)}%
                          </span>
                          <span style={{ fontSize: ".35rem" }}>
                            {ach?.label?.toUpperCase()}
                          </span>
                        </AchRarity>
                      </AchTrophy>
                    </AchCard>
                  );
                })}
              </Game2Line>
            </Games>
          )}
        </SRLeft>
      )}
    </Container>
  );
}

const GameLeftCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-0.125rem);
  width: 100px;
  height: 100px;
`;

const GameRightCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  flex-direction: column;
`;

const GRTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
`;

const GRBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #ffffff;
  justify-content: flex-start;
  height: 20px;
  width: 100%;
  font-size: 14px;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  height: 40px;
  color: #898989;
  width: 100%;
  opacity: 0.75;
  font-size: 12px;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  margin-left: 0.25rem;
  transform: ${(props) =>
    props?.achieved ? "translateY(0.5rem)" : "translateY(0rem)"};
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  margin-left: 0.25rem;
  transform: ${(props) =>
    props?.achieved ? "translateY(0.5rem)" : "translateY(0rem)"};
  background-color: #262d35;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 70px;
  justify-content: flex-start;
  flex-direction: column;
  color: #898989;
  opacity: 0.75;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
  justify-content: flex-start;
  flex-direction: column;
  transform: scale(1.25);
`;

const Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  padding: 0.25rem;
  font-size: 0.65rem;
  bottom: 0;
  color: #61bf19;
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  width: 100%;
  background-color: #080c11;
  padding-bottom: ${(props) => (props.achieved ? "1rem" : "0rem")};
  position: relative;
  margin-top: 0.25rem;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 86vh;
  min-height: 86vh;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 1rem;
  background-color: #111923;
`;

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #b9c7e5;
  min-width: 50px;
`;

const Started = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 0.7rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3), -1px -1px 1px rgba(0, 0, 0, 0.3),
    1px -1px 1px rgba(0, 0, 0, 0.3), -1px 1px 1px rgba(0, 0, 0, 0.3);
  color: #f9f9f9;
  text-align: center;
  font-weight: 600;
  line-height: 15px;
`;

const Outer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 14px;
  background-color: #1b2838;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 14px;
  background-color: #1a9fff;
  width: ${(props) => `${props.percentage}%`};
`;

const TSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const TBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
`;

const Trophies = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
  min-width: 150px;
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 50px;
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: "";
  height: 40px;
  background: #000000;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) =>
    props.padding ? `0rem ${props.padding}` : `0rem .5rem`};
  top: calc(50% - 20px);
`;

const Ps5 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border-radius: 2px;
  padding: 2px;
  cursor: pointer;
  width: 40px;
  box-shadow: 0 0 0 1px #939393 inset;
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #057fcc;
  width: 100%;
  height: 30px;
`;

const GameCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.75rem;
  width: 100%;
  padding: 0.25rem 0.5rem 1rem 0;
  color: #666666;
`;

const GameData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 0rem 1rem 0rem 1rem;
`;

const GameInfoInner = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem;
`;

const GameImage = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  margin-right: 0.25rem;
  align-items: center;
  justify-content: center;
  background: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  background-position: center;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #16202d;
  color: #333;
  padding: 4px 0px 0px 0px;
  width: 100%;
  margin: 0.25rem 0.25rem 0rem 0.5rem;
  cursor: pointer;
`;

const Games2LineR = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: calc(87.25vh);
  max-height: calc(87.25vh);
`;

const Games = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  min-height: calc(87.25vh);
  max-height: calc(87.25vh);
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background-color: #1b2838;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  border-radius: 4px;
  transform: translateY(-2rem);
  background-color: #f5f5f7;
`;
