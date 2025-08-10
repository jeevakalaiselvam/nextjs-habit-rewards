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
  COMPLETION_FACTOR,
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
}) {
  const [gameHovered, setGameHovered] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("COMMON");
  const [selectedMode, setSelectedMode] = useState("GAMES");
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

  targetToGet =
    selectedGame?.price > 0 ? Math.ceil(selectedGame?.price / 100) : 1;

  targetObtained = selectedGame?.completed;

  let completedBG = selectedGame?.achievements?.filter(
    (item) => item?.achieved == 1
  )?.length;

  totalBG = Math.ceil(totalBG * COMPLETION_FACTOR);
  completedBG = completedBG > totalBG ? totalBG : completedBG;

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
        <GameSearch>
          <input
            placeholder="Search Games..."
            value={gameSearch}
            onChange={(e) => setGameSearch(e.target.value)}
          />
        </GameSearch>
      </FirstRow>
      <FirstRow>
        <FRItem>P</FRItem>
        <FRLeft
          onClick={() => {
            if (window) {
              window.open(
                "https://steamcommunity.com/profiles/76561199881782703/games/"
              );
            }
          }}
        >
          N7ShadowX Profile
        </FRLeft>
        <FRRight>
          <TabLink
            onClick={() => {
              setSelected("GAMES");
              setSelectedMode("GAMES");
              if (window) {
                localStorage.setItem("SELECTED_TAB", "GAMES");
              }
            }}
            active={selectedMode == "GAMES"}
            onMouseEnter={() => setActive("GAMES")}
            onMouseLeave={() => setActive("")}
          >
            GAMES
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelectedMode("TROPHY_LOG")}
            active={selectedMode == "TROPHY_LOG"}
            onMouseEnter={() => setActive("TROPHY_LOG")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY LOG
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelectedMode("TROPHY_ADVISOR")}
            active={selectedMode == "TROPHY_ADVISOR"}
            onMouseEnter={() => setActive("TROPHY_ADVISOR")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY ADVISOR
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelectedMode("STATS")}
            active={selectedMode == "STATS"}
            onMouseEnter={() => setActive("STATS")}
            onMouseLeave={() => setActive("")}
          >
            STATS
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelectedMode("LEVEL_HISTORY")}
            active={selectedMode == "LEVEL_HISTORY"}
            onMouseEnter={() => setActive("LEVEL_HISTORY")}
            onMouseLeave={() => setActive("")}
          >
            LEVEL HISTORY
          </TabLink>
        </FRRight>
      </FirstRow>
      {!gamesLoading && (
        <RecentAchs>
          {allUnlocked
            ?.filter((ach) => ach?.color != "Platinum")
            ?.slice(0, 13)
            ?.map((ach, index) => {
              let desc1 = ach?.hiddenDesc;
              let desc2 = ach?.description;
              let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];
              return (
                <RecentAch
                  color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                  achieved={ach?.achieved}
                >
                  {
                    <AchIconOuter achieved={ach?.achieved}>
                      <AchIcon icon={ach?.icon}></AchIcon>
                    </AchIconOuter>
                  }

                  <DataContainer active={index === activeAch}>
                    <AchData active={index === activeAch}>
                      <AchTitle>{ach?.displayName}</AchTitle>
                      <AchDesc>
                        {" "}
                        {desc2 ? desc2 : desc3 ? desc3 : desc1}
                      </AchDesc>
                      {ach?.achieved == 1 && (
                        <AchUnlocked>
                          <UnlockedT1>
                            <span style={{ color: COLOR_GREEN2 }}>
                              {timeAgoInGame(new Date(ach?.unlocktime * 1000))}
                            </span>
                            <span style={{ margin: "0rem .25rem" }}>in</span>
                            <span style={{ color: COLOR_BLUE }}>
                              {ach?.gameName}
                            </span>
                          </UnlockedT1>
                        </AchUnlocked>
                      )}
                    </AchData>
                    <Seperator padding={".25rem"} />{" "}
                    <AchRarity active={index === activeAch}>
                      <span style={{ fontSize: "1.2rem" }}>
                        {ach?.percentage}%
                      </span>
                      <span style={{ fontSize: ".7rem" }}>
                        {ach?.label?.toUpperCase()}
                      </span>
                    </AchRarity>
                    <Seperator padding={".25rem"} />
                    <AchTrophy active={index === activeAch}>
                      {ach?.color == "Platinum" && <PlatinumIconS />}
                      {ach?.color == "Gold" && <GoldIconS />}
                      {ach?.color == "Silver" && <SilverIconS />}
                      {ach?.color == "Bronze" && <BronzeIconS />}
                    </AchTrophy>
                  </DataContainer>
                </RecentAch>
              );
            })}
        </RecentAchs>
      )}
      {!gamesLoading && (
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
              {selectedMode == "GAMES" && (
                <Games>
                  <Games1Line>
                    <GamesLeft>GAMES</GamesLeft>
                    <GamesRight></GamesRight>
                  </Games1Line>
                  <Games2Line>
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

                      let completed = game?.achievements?.filter(
                        (item) => item?.achieved == 1
                      )?.length;

                      total = Math.ceil(total * COMPLETION_FACTOR);
                      completed = completed > total ? total : completed;

                      let completionBG =
                        completed == 0 ? 0 : (completed / total) * 100;

                      let completion = (
                        completed == 0 ? 0 : (completed / total) * 100
                      )?.toFixed(2);
                      allCompletion = allCompletion + completion;

                      let { color, rank } =
                        calculateRankForCompletion(completion);
                      let lastAch = game?.achievements?.sort(
                        (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
                      )?.[game?.achievements?.length - 1];

                      let allUnlocked = game?.achievements
                        ?.filter((ach) => ach?.achieved == 1)
                        ?.sort(
                          (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
                        );

                      let lastUnlocked = allUnlocked?.[allUnlocked?.length - 1];

                      let isPlatinumNotAdded = game?.achievements?.length == 1;

                      return (
                        <GameContainer
                          onClick={() => {
                            setSelectedGame(game);
                            setSelectedMode("GAME");
                            if (window) {
                              localStorage.setItem("SELECTED_TAB", "GAME");
                              localStorage.setItem("SELECTED_GAME", game?.id);
                            }
                          }}
                          color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                        >
                          <GameImage url={HEADER_IMAGE(game?.id)}></GameImage>
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
                            <GameLastPlayed>
                              {lastUnlocked &&
                                formatDate(
                                  new Date(lastUnlocked?.unlocktime * 1000)
                                )}
                              {!lastUnlocked && "Yet to Start"}
                            </GameLastPlayed>
                            <GameHours>
                              {game?.playtime == 0
                                ? "Yet to Start"
                                : (game?.playtime / 60)?.toFixed(1)}
                              {" Hours"}
                            </GameHours>
                            {isPlatinumNotAdded &&
                              !(gamesLoading || platinumDataLoading) && (
                                <Warning> PLATINUM DATA MISSING !</Warning>
                              )}
                            <Started></Started>
                          </GameData>
                          <GameInfo>
                            <Ps5
                              onClick={() => {
                                setShowEditModal(true);
                                setGameData((old) => game);
                              }}
                            >
                              PS5
                            </Ps5>
                            <Seperator></Seperator>
                            <Rank>
                              <span
                                style={{ fontSize: "1.5rem", color: color }}
                              >
                                {rank}
                              </span>
                              <span style={{ fontSize: ".7rem" }}>RANK</span>
                            </Rank>
                            <Seperator></Seperator>
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
                              {true && (
                                <TBottom>
                                  <Outer>
                                    <Inner percentage={completion}></Inner>
                                    <Text>{completion} %</Text>
                                  </Outer>
                                </TBottom>
                              )}
                            </Trophies>
                            <Seperator></Seperator>
                            <Platinum isPlatinum={total == completed}>
                              <span
                                style={{
                                  opacity: total == completed ? 1 : 0.1,
                                  color: "#7A96D1",
                                }}
                              >
                                <PlatinumIcon />
                              </span>
                              <span
                                style={{
                                  color: "#7A96D1",
                                  fontSize: ".7rem",
                                  marginTop: "4px",
                                  fontWeight: "bold",
                                  opacity: total == completed ? 1 : 0.1,
                                }}
                              >
                                {Number(lastAch?.percentage)} %
                              </span>
                            </Platinum>
                          </GameInfo>
                        </GameContainer>
                      );
                    })}
                  </Games2Line>
                </Games>
              )}
              {selectedMode == "GAME" && (
                <>
                  <Game>
                    <Game1Line>
                      <GameLeft>
                        {selectedGame?.name?.toUpperCase()} TROPHIES
                      </GameLeft>
                    </Game1Line>
                    <Game2Line>
                      {[
                        ...(selectedGame?.achievements ?? [])?.filter(
                          (ach) => ach?.color == "Platinum"
                        ),
                        ...(selectedGame?.achievements ?? [])?.filter(
                          (ach) =>
                            ach?.color != "Platinum" && ach?.achieved != 1
                        ),
                        ...(selectedGame?.achievements ?? [])
                          ?.filter(
                            (ach) =>
                              ach?.color != "Platinum" && ach?.achieved == 1
                          )
                          ?.sort(
                            (ach1, ach2) => ach2?.unlocktime - ach1?.unlocktime
                          ),
                      ]?.map((ach, index) => {
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
                            {ach?.color != "Platinum" && (
                              <AchIconOuter achieved={ach?.achieved}>
                                <AchIcon
                                  icon={
                                    ach?.achieved == 1
                                      ? ach?.icon
                                      : ach?.icongray
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
                              <AchIconOuterPlatinum achieved={ach?.achieved}>
                                <span
                                  style={{
                                    background: "#262D35",
                                    width: "60px",
                                    height: "60px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <PlatinumIcon />
                                </span>
                              </AchIconOuterPlatinum>
                            )}
                            <AchData>
                              <AchTitle>{ach?.displayName}</AchTitle>
                              <AchDesc>
                                {desc2 ? desc2 : desc3 ? desc3 : desc1}
                              </AchDesc>
                            </AchData>
                            {ach?.achieved == 1 && (
                              <Unlocked>
                                <UnlockedT1>
                                  {formatDate1(
                                    new Date(ach?.unlocktime * 1000)
                                  )}
                                </UnlockedT1>
                                <UnlockedT2>
                                  {formatDate2(
                                    new Date(ach?.unlocktime * 1000)
                                  )}
                                </UnlockedT2>
                              </Unlocked>
                            )}
                            <Seperator padding={".25rem"} />
                            {ach?.color != "Platinum" && (
                              <AchRarity>
                                <span style={{ fontSize: "1.2rem" }}>
                                  {ach?.percentage}%
                                </span>
                                <span style={{ fontSize: ".7rem" }}>
                                  {ach?.label?.toUpperCase()}
                                </span>
                              </AchRarity>
                            )}
                            {ach?.color == "Platinum" && (
                              <AchRarity>
                                <span style={{ fontSize: ".7rem" }}>
                                  PLATINUM
                                </span>
                              </AchRarity>
                            )}
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
                  </Game>
                </>
              )}
              {selectedMode == "STATS" && (
                <GamesR>
                  <GameLineHours>
                    <Games1Line>
                      <GamesLeft>MAIN STATISTICS</GamesLeft>
                      <GamesRight></GamesRight>
                    </Games1Line>
                    <StatWrapper>
                      <StatInformation games={games} />
                    </StatWrapper>
                  </GameLineHours>
                </GamesR>
              )}
              {selectedMode == "STATS" && (
                <GamesR>
                  <GameLineHours>
                    <Games1Line>
                      <GamesLeft>MONTHLY ACTIVITY</GamesLeft>
                      <GamesRight></GamesRight>
                    </Games1Line>
                    <StatWrapper2>
                      <LevelProgressChart
                        dailyUnlocks={monthlyUnlocks}
                        size={1550}
                      />
                    </StatWrapper2>
                  </GameLineHours>
                </GamesR>
              )}
              {selectedMode == "STATS" && (
                <GamesR>
                  <GameLineHours>
                    <Games1Line>
                      <GamesLeft>TROPHY PROGRESSION</GamesLeft>
                      <GamesRight></GamesRight>
                    </Games1Line>
                    <StatWrapper2>
                      <MultiProgressChart
                        size={1550}
                        dailyTypeBreakdown={dailyTypeBreakdown}
                      />
                    </StatWrapper2>
                  </GameLineHours>
                </GamesR>
              )}
              {selectedMode == "STATS" && (
                <GamesR>
                  <GameLineHours>
                    <Games1Line>
                      <GamesLeft>TROPHIES BY TIME</GamesLeft>
                      <GamesRight></GamesRight>
                    </Games1Line>
                    <StatWrapper2>
                      <BarProgressChart
                        dailyUnlocks={hourlyUnlocks}
                        size={1550}
                      />
                    </StatWrapper2>
                  </GameLineHours>
                </GamesR>
              )}
              {selectedMode == "STATS" && (
                <GamesR>
                  <GameLineHours>
                    <Games1Line>
                      <GamesLeft>TROPHIES BY DAY</GamesLeft>
                      <GamesRight></GamesRight>
                    </Games1Line>
                    <StatWrapper2>
                      <BarProgressChart
                        dailyUnlocks={weeklyUnlocks}
                        size={1550}
                      />
                    </StatWrapper2>
                  </GameLineHours>
                </GamesR>
              )}{" "}
              {selectedMode == "LEVEL_HISTORY" && (
                <LevelProgressChart
                  dailyUnlocks={levelAchs?.map((ach) => ({
                    date: formatDate3(new Date(ach?.unlocktime * 1000)),
                    Level: ach?.levelReached,
                  }))}
                  size={1550}
                />
              )}
              {selectedMode == "LEVEL_HISTORY" && (
                <Game2LineLH>
                  {levelAchs?.reverse().map((ach, index) => {
                    let desc1 = ach?.hiddenDesc;
                    let desc2 = ach?.description;
                    let desc3 = ach?.hiddenDesc?.split(
                      "Hidden achievement:"
                    )?.[1];
                    return (
                      <AchCard color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}>
                        <GameSubLeftImageSmall
                          image={HEADER_IMAGE(ach?.gameId)}
                        />
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
                        <AchTrophy2>
                          <LevelUpIcon />
                        </AchTrophy2>
                        <span
                          style={{
                            fontSize: "1.25rem",
                            padding: "1rem 0.5rem",
                            opacity: 0.75,
                            transform: "translate(-.66rem,.4rem)",
                            color: "#FEFEFE",
                          }}
                        >
                          {ach?.levelReached}
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
                </Game2LineLH>
              )}
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
                        color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                        achieved={ach?.achieved}
                      >
                        <GameSubLeftImageSmall
                          image={HEADER_IMAGE(ach?.gameId)}
                        />
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
                        <span style={{ padding: "0rem 1rem", opacity: 0.75 }}>
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
              {selectedMode == "TROPHY_ADVISOR" && (
                <Game2Line>
                  {notUnlocked?.map((ach, index) => {
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
                        <GameSubLeftImageSmall
                          image={HEADER_IMAGE(ach?.gameId)}
                        />
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
                        <span style={{ padding: "0rem 1rem", opacity: 0.75 }}>
                          #{index + 1}
                        </span>
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
            </SRLeft>
          )}
          {shouldShowRight && (
            <SRRight>
              {selectedMode == "GAME" && (
                <Milestones>
                  <Rarest1Line>
                    <GamesLeft>GAME</GamesLeft>
                    <GamesRight></GamesRight>
                  </Rarest1Line>
                  <Rarest3Line>
                    <GameSubLine>
                      <GameImage
                        url={HEADER_IMAGE(selectedGame?.id)}
                      ></GameImage>
                      <GameSubRight>
                        <Ps5
                          onClick={() => {
                            setShowEditModal(true);
                            setGameData((old) => selectedGame);
                          }}
                        >
                          PS5
                        </Ps5>
                        <Seperator></Seperator>
                        <Rank>
                          <span style={{ fontSize: "1.5rem", color: color }}>
                            {rank}
                          </span>
                          <span style={{ fontSize: ".7rem" }}>RANK</span>
                        </Rank>
                        <Seperator></Seperator>
                        <Platinum isPlatinum={totalBG == completedBG}>
                          <span
                            style={{
                              opacity: totalBG == completedBG ? 1 : 0.25,
                            }}
                          >
                            <PlatinumIcon />
                          </span>
                          <span
                            style={{
                              fontSize: ".7rem",
                              marginTop: "4px",
                              fontWeight: "bold",
                              opacity: totalBG == completedBG ? 1 : 0.25,
                              color: "#7A96D1",
                            }}
                          >
                            {lastAch?.percentage} %
                          </span>
                        </Platinum>
                        <Seperator></Seperator>
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
                                {goldBG}
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
                                {silverBG}
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
                                {bronzeBG}
                              </span>
                            </TSingle>
                          </TTop>
                          <TBottom>
                            <Outer>
                              <Inner percentage={completionBG}></Inner>
                              <Text>{completionBG?.toFixed(2)} %</Text>
                            </Outer>
                          </TBottom>
                        </Trophies>
                      </GameSubRight>
                    </GameSubLine>
                  </Rarest3Line>
                </Milestones>
              )}
              <Rarest>
                <Rarest1Line>
                  <GamesLeft>RAREST TROPHIES</GamesLeft>
                  <GamesRight></GamesRight>
                </Rarest1Line>
                <Rarest2Line>
                  {selectedRarityAchs?.length == 0 && <span>No Trophies</span>}
                  {selectedRarityAchs?.length > 0 &&
                    selectedRarityAchs?.map((ach, index) => {
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
                          <AchData>
                            <AchTitle>{ach?.displayName}</AchTitle>
                            <AchDesc>
                              {" "}
                              {desc2 ? desc2 : desc3 ? desc3 : desc1}
                            </AchDesc>
                          </AchData>
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
                </Rarest2Line>
                <RareSelection>
                  <RItem
                    active={selectedRarity == "ULTRA RARE"}
                    onClick={() => {
                      setSelectedRarity("ULTRA RARE");
                    }}
                  >
                    <span
                      style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}
                    >
                      {ultrarare?.length}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>ULTRA RARE</span>
                  </RItem>
                  <Seperator padding={".25rem"}></Seperator>
                  <RItem
                    active={selectedRarity == "VERY RARE"}
                    onClick={() => {
                      setSelectedRarity("VERY RARE");
                    }}
                  >
                    <span
                      style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}
                    >
                      {veryrare?.length}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>VERY RARE</span>
                  </RItem>
                  <Seperator padding={".25rem"}></Seperator>
                  <RItem
                    active={selectedRarity == "RARE"}
                    onClick={() => {
                      setSelectedRarity("RARE");
                    }}
                  >
                    <span
                      style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}
                    >
                      {rare?.length}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>RARE</span>
                  </RItem>
                  <Seperator padding={".25rem"}></Seperator>
                  <RItem
                    active={selectedRarity == "UNCOMMON"}
                    onClick={() => {
                      setSelectedRarity("UNCOMMON");
                    }}
                  >
                    <span
                      style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}
                    >
                      {uncommon?.length}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>UNCOMMON</span>
                  </RItem>
                  <Seperator padding={".25rem"}></Seperator>
                  <RItem
                    active={selectedRarity == "COMMON"}
                    onClick={() => {
                      setSelectedRarity("COMMON");
                    }}
                  >
                    <span
                      style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}
                    >
                      {common?.length}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>COMMON</span>
                  </RItem>
                </RareSelection>
              </Rarest>
            </SRRight>
          )}
        </SecondRow>
      )}
    </Container>
  );
}

// Styles
const CoverData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0rem;
  bottom: 0.5rem;
  width: 98%;
  z-index: 2;
  padding: 0.5rem 1rem;
  transition: 0.25s all ease-in;
  background-color: #fefefedd;
  border-radius: 0 0 2px 2px;
`;

const Case = styled.div`
  position: relative;
  width: 200px;
  height: 270px;
  perspective: 800px;
  margin: 1rem;
  position: relative;
  &:hover {
    cursor: pointer;
    transform: scale(1.025);
  }
`;

const Template = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Run = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1rem;
  color: ${COLOR_GREY};
  opacity: 0.75;

  &:hover {
    opacity: 1;
    color: ${COLOR_GREEN};
  }
`;

const Cover = styled.img`
  position: absolute;
  top: 42px;
  left: 0px;
  width: calc(100% - 4px);
  height: calc(100% - 52px);
  object-fit: cover;
  border-radius: 2px;
`;

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

const GameSubLeftImageSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100px;
  background: ${(props) => `url(${props.image})`};
  background-size: cover;
  position: relative;
`;

const GameSubLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
`;

const GameSubRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-left: 1rem;
`;

const GameSubLine = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #fefefe;
  justify-content: flex-start;
  flex: 2;
  font-size: 16px;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 2;
  width: 100%;
  font-size: 12px;
  color: #898989;
`;

const AchUnlocked = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 1;
  width: 100%;
  opacity: 0.75;
  font-size: 0.8rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
`;

const AchIconOuterPlatinum = styled.div`
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

const DataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: ${(props) => (props.active ? "600px" : "0px")};
  max-width: ${(props) => (props.active ? "600px" : "0px")};
  transition: all 0.5s ease-in;
  overflow: hidden;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
  color: rgb(139, 146, 154);
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(1.5) translate(0.25rem, 0.25rem);
`;

const AchTrophy2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(1) translate(0.25rem, 0.25rem);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: #080c11;
  margin-bottom: 0.5rem;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding: 0.25rem 0.25rem;
`;

const Game2LineLH = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding: 0.25rem 1rem;
`;

const Game1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  color: #fefefe;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const Game = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
`;

const RItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  cursor: pointer;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

const RareSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4486c6;
  width: 100%;
  padding: 1rem;
  background-color: #16202d;
`;

const Rarest2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  padding: 0.5rem 0.5rem;
  width: 100%;
  min-height: 600px;
  max-height: 600px;
  color: #333;
`;

const Rarest3Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  padding: 0.5rem 0.5rem;
  width: 100%;
  color: #333;
`;

const Rarest1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
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

const Milestones = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 0.5rem;
  color: #2f3e56;
  min-width: 50px;
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
  background-color: #3c3f49;
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
  transform: translate(0.25rem, 0rem);
`;

const TBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Trophies = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 50px;
  color: rgb(139, 146, 154);
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: "";
  height: 40px;
  background: #eee;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
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
  color: rgb(139, 146, 154);
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%6;
  justify-content: center;
  color: #fefefe;
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.5rem 0;
  color: red;
  animation: blinkSmooth 1.5s ease-in-out infinite;

  @keyframes blinkSmooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const GameLastPlayed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0;
  color: #666666;
`;

const GameHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0;
  color: #666666;
`;

const GameCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.5rem 0.5rem 0.25rem 0;
  color: #666666;
`;

const GameCompletionCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.5rem;
  color: #666666;
`;

const GamePrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.5rem;
  color: #666666;
  color: ${COLOR_GREEN2};
`;

const Started = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GameData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0rem 1rem;
  flex-direction: column;
`;

const GameDataCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;
  flex-direction: column;
`;

const GameInfoCD = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
`;

const GameInfo = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-end;
`;

const GameImage = styled.div`
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: #16202d;
  color: #333;
  padding: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const GameContainerCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 8px;
  flex-direction: column;
  cursor: pointer;
  width: 350px;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Games2LineCDL = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const Games2LineCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 93%;
`;

const Games1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const GamesCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Games = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const GamesR = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
`;

const GameLineTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  flex-direction: column;
  font-size: 0.9rem;
  flex: 1;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const GameLineHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const GamesLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const GameLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const GamesRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
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
  padding-bottom: 0.25rem;
  color: ${(props) => (props.active ? "#FEFEFE" : "#777")};
  font-weight: ${(props) => (props.active ? "bold" : "300")};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${COLOR_ACCENT}` : `2px solid #00000000`};
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  color: #fefefe;
  opacity: 0.8;
  &:hover {
    color: #fefefe;
    cursor: pointer;
    opacity: 1;
  }
`;

const FRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const GameSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & input {
    width: 100%;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    background-color: #1b2838;
  }
`;

const RecentAchs = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  width: 100%;
  overflow: scroll;
  color: #44484b;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  width: 100%;
  color: #44484b;
  background-color: #111923;
`;

const OuterAchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 1600px;
  border-radius: 4px;
  transform: translateY(-10rem);
  background-color: #111923;
`;

const RecentAch = styled.div`
  color: #333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 0.5rem;
  background-color: #080c11;
  transition: 0.5s all ease;
`;

const StatWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StatWrapper2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 0rem;
`;
