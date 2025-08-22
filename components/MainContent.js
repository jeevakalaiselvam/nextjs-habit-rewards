import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLUE,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREEN2,
  COLOR_GREY,
  COLOR_RANK_F,
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
  COMPLETION_FACTOR,
  getAchsBasedOnRarity,
} from "../helpers/trophyHelper";
import GoldIcon from "./GoldIcon";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import { FaCheck, FaEdge, FaPlay, FaTrophy } from "react-icons/fa";
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
}) {
  const [gameHovered, setGameHovered] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("COMMON");
  const [selectedMode, setSelectedMode] = useState("GAMES");
  const [selectedGame, setSelectedGame] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [selected, setSelected] = useState("GAMES");
  const [active, setActive] = useState("GAMES");
  const [gameData, setGameData] = useState({});
  const [gameSearch, setGameSearch] = useState("");
  const [activeAch, setActiveAch] = useState(0);
  const [visibleAll, setVisibleAll] = useState(false);
  const [visibleAllGames, setVisibleAllGames] = useState(false);

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

  targetToGet =
    selectedGame?.price > 0 ? Math.ceil(selectedGame?.price / 100) : 1;

  targetObtained = selectedGame?.completed;

  let completedBG = selectedGame?.achievements?.filter(
    (item) => item?.achieved == 1
  )?.length;

  totalBG = Math.ceil(totalBG * COMPLETION_FACTOR);

  completedBG = completedBG > totalBG ? totalBG : completedBG;

  let completionBG =
    completedBG == 0 || totalBG == 0 ? 0 : (completedBG / totalBG) * 100;

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

  let sortedGames = games?.sort((a, b) =>
    a?.name?.localeCompare(b?.name, undefined, { sensitivity: "base" })
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

  selectedRarityAchs = selectedRarityAchs?.filter(
    (ach) => ach?.color !== "Platinum"
  );

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
        if (old < 13 - 1) {
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

  useEffect(() => {
    if (window) {
      let old = localStorage.getItem("SELECTED_TAB") ?? "GAME";
      let oldGameId = localStorage.getItem("SELECTED_GAME") ?? "";
      const game = games?.filter((game) => +game?.id == +oldGameId);
      console.log({ game, oldGameId, old });
      setSelected(old);
      setSelectedMode(old);
      setSelectedGame(games?.find((game) => +game?.id == +oldGameId));
    }
  }, [games]);

  let isPlatinumInSelectedGame =
    selectedGame?.achievements?.filter(
      (ach) => ach?.color == "Platinum" && ach?.achieved == 1
    )?.length > 0;

  return (
    <Container>
      {!gamesLoading && (
        <SecondRow>
          {gamesLoading && (
            <SRLeft>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </SRLeft>
          )}
          {shouldShowRight && (
            <SRRight>
              <Rarest>
                <Rarest2LineOuter>
                  <Rarest2Line>
                    {allUnlocked?.length == 0 && <span>No Trophies</span>}
                    {allUnlocked?.length > 0 &&
                      allUnlocked?.map((ach, index) => {
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
                            <AchIconOuter achieved={ach?.achieved}>
                              <AchIcon icon={ach?.icon}></AchIcon>
                            </AchIconOuter>
                            <Count>
                              <span
                                style={{
                                  transform: "translateY(.25rem)",
                                  marginLeft: ".0625rem",
                                }}
                              >
                                {ach?.color == "Gold" && <GoldIconS />}
                              </span>
                              <span
                                style={{
                                  transform: "translateY(.25rem)",
                                  marginLeft: ".0625rem",
                                }}
                              >
                                {ach?.color == "Silver" && <SilverIconS />}
                              </span>
                              <span
                                style={{
                                  transform: "translateY(.25rem)",
                                  marginLeft: ".0625rem",
                                }}
                              >
                                {ach?.color == "Bronze" && <BronzeIconS />}
                              </span>
                            </Count>
                          </AchCard>
                        );
                      })}
                  </Rarest2Line>
                </Rarest2LineOuter>
              </Rarest>
            </SRRight>
          )}
        </SecondRow>
      )}
    </Container>
  );
}

// Styles
const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0.35rem, -0.03125rem);
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

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  background-color: #080c116e;
  flex-direction: column;
  margin-bottom: 1rem;
  margin-right: 1rem;
  transition: 0.125s all;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const Rarest2LineOuter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: scroll;
  flex-wrap: wrap;
  padding: 0.5rem 0.5rem;
  width: 100%;
  max-height: 70vh;
  min-height: 70vh;
  color: #333;
`;

const Rarest2Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: scroll;
  flex-wrap: wrap;
  padding: 0.5rem 0.5rem;
  width: 100%;
  max-height: 80vh;
  color: #333;
`;

const Rarest = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  background-color: #16202d;
`;

const SRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1.1;
  padding: 0.5rem;
`;

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 2;
  padding: 0.5rem;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #111923;
  width: 100%;
  padding: 1rem;
  color: #44484b;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  border-radius: 4px;
  transform: translateY(-10rem);
  background-color: #111923;
`;
