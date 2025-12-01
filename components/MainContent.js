import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLUE,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREEN2,
  COLOR_GREY,
  COLOR_SILVER,
  COLOR_SILVER2,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { TbEdit, TbPlayCard } from "react-icons/tb";
import { HiPlay } from "react-icons/hi2";
import {
  calculateLevelForAchs,
  calculatePSLevelAndProgress,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
} from "../helpers/trophyHelper";
import GoldIcon from "./GoldIcon";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import { FaEdge, FaPlay } from "react-icons/fa";
import EditGameForm from "./EditGameForm";
import PlatinumIconS from "./PlatinumIconS";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Spin } from "antd";
import GameCdImage from "./GameCdImage";
import {
  formatDate,
  formatDate1,
  formatDate2,
  formatDate3,
  timeAgoInGame,
} from "../helpers/dateHelper";
import StatInformation from "./StatInformation";
import LevelIcon from "./LevelIcon";
import LevelUpIcon from "./LevelUpIcon";
import LevelProgressChart from "./LevelProgressChart";
import MultiProgressChart from "./MultiProgressChart";
import BarProgressChart from "./BarProgressChart";

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  platinumDataLoading,
  tabActive,
  setTabActive,
  refeshing,
  setRefreshing,
}) {
  const [gameHovered, setGameHovered] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("COMMON");
  const [selectedMode, setSelectedMode] = useState("TROPHY_LOG");
  const [selectedGame, setSelectedGame] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState("GAMES");
  const [active, setActive] = useState("GAMES");
  const [gameData, setGameData] = useState({});
  const [gameSearch, setGameSearch] = useState("");
  const [activeAch, setActiveAch] = useState(0);

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

  let targetToGet = 0;
  let targetObtained = 0;

  targetToGet = 1;

  targetObtained = selectedGame?.completed;

  totalBG = selectedGame?.achievements?.length;
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

  let platinumGames = [];
  let nonPlatinumGames = [];

  platinumGames = sortedGames?.filter((game) => {
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

    let completed = game?.achievements?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );
    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }

    completed = completed > total ? total : completed;

    return completion == 100;
  });

  nonPlatinumGames = sortedGames?.filter((game) => {
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

    let completed = game?.achievements?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );
    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }

    completed = completed > total ? total : completed;

    return completion != 100;
  });

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

  console.log({ selectedRarityAchs });

  sortedGames = sortedGames?.filter((game) =>
    game?.name?.toLowerCase()?.includes(gameSearch?.toLowerCase())
  );

  let allUnlocked = [];
  let notUnlocked = [];

  games?.forEach((game) => {
    console.log(game);
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 1) {
        allUnlocked.push(ach);
      } else {
        notUnlocked.push(ach);
      }
    });
  });

  allUnlocked = allUnlocked?.sort(
    (ach1, ach2) => ach2?.unlocktime - ach1?.unlocktime
  );

  notUnlocked = notUnlocked?.sort(
    (ach1, ach2) => ach2?.percentage - ach1?.percentage
  );

  useEffect(() => {
    let timer = setInterval(() => {
      setActiveAch((old) => {
        if (old < allUnlocked?.length - 1) {
          return old + 1;
        } else {
          return 0;
        }
      });
    }, [3000]);
    return () => {
      clearInterval(timer);
    };
  }, [games]);

  let shouldShowRight =
    selectedMode !== "LIBRARY" &&
    selectedMode !== "LIBRARY_NEW" &&
    selectedMode !== "TROPHY_LOG" &&
    selectedMode !== "LEVEL_HISTORY" &&
    selectedMode !== "TROPHY_ADVISOR" &&
    selectedMode !== "STATS";

  const {
    levelAchs,
    dailyUnlocks,
    monthlyUnlocks,
    dailyTypeBreakdown,
    hourlyUnlocks,
    weeklyUnlocks,
  } = calculateLevelForAchs(games);

  if (refeshing) {
    return <></>;
  }
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
      <FirstRow>
        <FRItem>P</FRItem>
        <FRLeft>OBSIDIANLOGAN'S PROFILE</FRLeft>
        <FRRight>
          <TabLink
            onClick={() => setSelectedMode("TROPHY_LOG")}
            active={selectedMode == "TROPHY_LOG"}
            onMouseEnter={() => setActive("TROPHY_LOG")}
            onMouseLeave={() => setActive("")}
          >
            ALL TROPHIES
          </TabLink>
        </FRRight>
      </FirstRow>
      <SecondRow>
        {gamesLoading && (
          <SRLeft>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </SRLeft>
        )}
        {!gamesLoading && (
          <SRLeft>
            {selectedMode == "TROPHY_LOG" && (
              <Game2Line>
                {allUnlocked?.map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    "Hidden achievement:"
                  )?.[1];
                  return (
                    <AchCard
                      color={index % 2 == 0 ? "#161D25" : "#1a232eff"}
                      achieved={ach?.achieved}
                    >
                      <span style={{ marginLeft: "1rem" }}></span>
                      <AchIconOuter achieved={ach?.achieved}>
                        <AchIcon
                          icon={ach?.icon}
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
                      <AchData>
                        <AchTitle>{ach?.displayName}</AchTitle>
                        <AchDesc>
                          {desc2 ? desc2 : desc3 ? desc3 : desc1}
                        </AchDesc>
                      </AchData>
                      <span
                        style={{
                          padding: "0rem 1rem",
                          opacity: 0.75,
                          color: "#fefefeab",
                        }}
                      >
                        #{allUnlocked?.length - index}
                      </span>
                      <Seperator padding={".25rem"} />
                      {ach?.achieved == 1 && (
                        <Unlocked>
                          <UnlockedT1>
                            {formatDate1(new Date(ach?.unlocktime * 1000))}
                          </UnlockedT1>
                          <UnlockedT2>
                            {formatDate2(new Date(ach?.unlocktime * 1000))}
                          </UnlockedT2>
                        </Unlocked>
                      )}
                      <Seperator padding={".25rem"} />
                      <AchRarity>
                        <span style={{ fontSize: "1.2rem" }}>
                          {ach?.percentage}%
                        </span>
                        <span style={{ fontSize: ".7rem" }}>
                          {ach?.label?.toUpperCase()}
                        </span>
                      </AchRarity>
                      <Seperator padding={".25rem"} />
                      <AchTrophy>
                        {ach?.color == "Platinum" && <PlatinumIconS />}
                        {ach?.color == "Gold" && <GoldIconS />}
                        {ach?.color == "Silver" && <SilverIconS />}
                        {ach?.color == "Bronze" && <BronzeIconS />}
                      </AchTrophy>
                    </AchCard>
                  );
                })}
              </Game2Line>
            )}
            {selectedMode == "ICON_VIEW" && (
              <Game3Line>
                {allUnlocked?.map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    "Hidden achievement:"
                  )?.[1];
                  return (
                    <AchCardIcon
                      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                      achieved={ach?.achieved}
                    >
                      <span style={{ marginLeft: "1rem" }}></span>
                      <AchIconOuter achieved={ach?.achieved}>
                        <AchIcon
                          icon={ach?.icon}
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
                    </AchCardIcon>
                  );
                })}
              </Game3Line>
            )}
          </SRLeft>
        )}
      </SecondRow>
    </Container>
  );
}

const Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100px;
  color: #579428;
`;

const UnlockedT1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  padding-top: 0.25rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #4486c6;
  justify-content: flex-start;
  flex: 2;
  font-size: 0.8rem;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 2;
  width: 100%;
  opacity: 0.75;
  font-size: 0.75rem;
  color: #fefefeab;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
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
  min-width: 300px;
  height: 60px;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
  color: #fefefe65;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(2) translate(0.25rem, 0.25rem);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: ${(props) => (props.achieved ? props.color : props.color)};
  border: 1px solid #161d25;
`;

const AchCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  background-color: ${(props) => (props.achieved ? props.color : props.color)};
  border: 1px solid #eee;
  cursor: pointer;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding: 0rem 0.25rem;
`;

const Game3Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: scroll;
  width: 100%;
  flex-wrap: wrap;
  padding: 0.25rem 0.25rem;
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
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 2;
  width: 100%;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #141a21ff;
  width: 100%;
  padding: 1rem;
  color: #44484b;
`;

const FRItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_BRONZE};
  padding: 0.75rem;
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
  color: ${generateDarkTextColorForLightBg(COLOR_BRONZE, 50)};
`;

const TabLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 0.8rem;
  margin-right: 1rem;
  padding-bottom: 0.5rem;
  font-weight: ${(props) => (props.active ? "bold" : "300")};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${COLOR_ACCENT}` : `2px solid #00000000`};
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const FRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #141a21;
  padding: 1rem 1rem;
  width: 100%;
  color: #44484b;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 4px;
  background-color: #161d25;
  min-width: 1000px;
  max-height: 90vh;
  overflow: scroll;
`;
