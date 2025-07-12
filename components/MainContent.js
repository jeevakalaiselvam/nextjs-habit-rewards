import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_SILVER,
  COLOR_SILVER2,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
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

  console.log({});

  const items = [
    {
      key: "baseGame",
      label: (
        <GameHeader>
          <GameSubLine>
            <GameSubLeftImage>
              <GameCdImage game={{ cover: selectedGame?.cover }} />
            </GameSubLeftImage>
            <GameTitleHeader>
              <GameSubLeft>Base Game</GameSubLeft>
              <GameSubRight>
                <Rank>
                  <span style={{ fontSize: "1.5rem", color: color }}>
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
                      opacity: totalBG == completedBG ? 1 : 0.75,
                    }}
                  >
                    {lastAch?.percentage} %
                  </span>
                </Platinum>
              </GameSubRight>
            </GameTitleHeader>
          </GameSubLine>
        </GameHeader>
      ),
      children: (
        <Game2Line>
          {selectedGame?.achievements?.map((ach, index) => {
            return (
              <AchCard
                color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                achieved={ach?.achieved}
              >
                <AchIconOuter achieved={ach?.achieved}>
                  <AchIcon
                    icon={ach?.icon}
                    onClick={() => {
                      if (window !== "undefined") {
                        const searchQuery = `${
                          ach?.displayName
                        } achievement ${encodeURIComponent(ach?.gameName)} `;
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
                  <AchDesc
                    higher={ach?.description?.length > MAX_DESC}
                    medium={ach?.description?.length > MEDIUM_DESC}
                  >
                    {ach?.description}
                  </AchDesc>
                </AchData>
                <Seperator padding={".25rem"} />
                <AchRarity>
                  <span style={{ fontSize: ".8rem" }}>{ach?.percentage}%</span>
                  <span style={{ fontSize: ".6rem" }}>
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
      ),
    },
    ...allDLCKeys?.map((dlcKey) => {
      let unearnedDLC = 0;
      let platinumADLC = 0;
      let goldADLC = 0;
      let silverADLC = 0;
      let bronzeADLC = 0;
      let platinumDLC = 0;
      let goldDLC = 0;
      let silverDLC = 0;
      let bronzeDLC = 0;
      let totalDLC = 0;

      let dlcTrophies = selectedGame?.dlcAchievements?.filter(
        (ach) => ach?.dlc == dlcKey?.dlcKey
      );
      dlcTrophies?.forEach((ach) => {
        totalDLC++;
        if (ach?.achieved == 0) {
          unearnedDLC++;
          if (ach?.color == "Platinum") {
            platinumADLC++;
          }
          if (ach?.color == "Gold") {
            goldADLC++;
          }
          if (ach?.color == "Silver") {
            silverADLC++;
          }
          if (ach?.color == "Bronze") {
            bronzeADLC++;
          }
        } else {
          if (ach?.color == "Platinum") {
            platinumDLC++;
          }
          if (ach?.color == "Gold") {
            goldDLC++;
          }
          if (ach?.color == "Silver") {
            silverDLC++;
          }
          if (ach?.color == "Bronze") {
            bronzeDLC++;
          }
        }
      });

      let completedDLC = selectedGame?.achievements?.filter(
        (item) => item?.achieved == 1
      )?.length;
      let completionDLC =
        completedDLC == 0 ? 0 : (completedDLC / totalDLC) * 100;

      return {
        key: dlcKey?.dlcKey,
        label: (
          <GameHeader>
            <GameSubLine>
              <GameSubLeftImage>
                <GameCdImage game={{ cover: dlcKey?.image }} />
              </GameSubLeftImage>
              <GameTitleHeader>
                <GameSubLeft>{dlcKey?.name}</GameSubLeft>
                <GameSubRight>
                  <Rank>
                    <span style={{ fontSize: "1.5rem", color: color }}>
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
                          {goldDLC}
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
                          {silverDLC}
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
                          {bronzeDLC}
                        </span>
                      </TSingle>
                    </TTop>
                    <TBottom>
                      <Outer>
                        <Inner percentage={completionDLC}></Inner>
                        <Text>{completionDLC} %</Text>
                      </Outer>
                    </TBottom>
                  </Trophies>
                </GameSubRight>
              </GameTitleHeader>
            </GameSubLine>
          </GameHeader>
        ),
        children: (
          <Game2Line>
            {dlcTrophies?.map((ach, index) => {
              return (
                <AchCard
                  color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                  achieved={ach?.achieved}
                >
                  <AchIconOuter achieved={ach?.achieved}>
                    <AchIcon
                      icon={ach?.icon}
                      onClick={() => {
                        if (window !== "undefined") {
                          const searchQuery = `${
                            ach?.displayName
                          } achievement ${encodeURIComponent(ach?.gameName)} `;
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
                    <AchDesc higher={ach?.description?.length > MAX_DESC}>
                      {ach?.description}
                    </AchDesc>
                  </AchData>
                  <Seperator padding={".25rem"} />
                  <AchRarity>
                    <span style={{ fontSize: ".8rem" }}>
                      {ach?.percentage}%
                    </span>
                    <span style={{ fontSize: ".6rem" }}>
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
        ),
      };
    }),
  ];

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
                  let completion = (
                    completed == 0 ? 0 : (completed / total) * 100
                  )?.toFixed(2);
                  allCompletion = allCompletion + completion;
                  if (total == completed) {
                    completed = completed + 1;
                  }

                  let { color, rank } = calculateRankForCompletion(completion);
                  let lastAch = game?.achievements?.sort(
                    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
                  )?.[game?.achievements?.length - 1];

                  let isPlatinumNotAdded = game?.achievements?.length == 1;

                  return (
                    <GameContainer
                      onClick={() => {
                        setSelectedGame(game);
                        setSelectedMode("GAME");
                      }}
                      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                    >
                      <GameLeftCard>
                        <GameCdImage game={game} />
                      </GameLeftCard>
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
                                  <Inner percentage={completion}></Inner>
                                  <Text>{completion} %</Text>
                                </Outer>
                              </TBottom>
                            </Trophies>
                            <Seperator></Seperator>
                            <Platinum isPlatinum={total == completed}>
                              <span
                                style={{
                                  opacity: total == completed ? 1 : 0.25,
                                }}
                              >
                                <PlatinumIcon />
                              </span>
                              <span
                                style={{
                                  fontSize: ".7rem",
                                  marginTop: "4px",
                                  fontWeight: "bold",
                                  opacity: total == completed ? 1 : 0.75,
                                }}
                              >
                                {Number(lastAch?.percentage)} %
                              </span>
                            </Platinum>
                            <Seperator></Seperator>
                            <Rank>
                              <span
                                style={{ fontSize: "1.5rem", color: color }}
                              >
                                {rank}
                              </span>
                              <span style={{ fontSize: ".7rem" }}>RANK</span>
                            </Rank>
                          </GameInfo>
                        </GRBottom>
                      </GameRightCard>
                    </GameContainer>
                  );
                })}
              </Games2Line>
            </Games>
          )}
          {selectedMode == "GAME" && (
            <MainAccordion>
              <Collapse
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                items={items}
                activeKey={activeAccKey}
                defaultActiveKey={"baseGame"}
                onChange={(key) => {
                  setAccActiveKey(key);
                }}
              />
            </MainAccordion>
          )}
        </SRLeft>
      )}
    </Container>
  );
}

const GameTitleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const MainAccordion = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1rem;
  flex-direction: column;
  width: 100%;
  min-height: calc(80vh);
  max-height: calc(80vh);
`;

const GameLeftCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GameRightCard = styled.div`
  display: flex;
  align-items: center;
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

const PlayButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.1rem;
  background-color: ${COLOR_GREEN};
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN, 50)};
  opacity: 0.85;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const GameSubLeftImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: ${(props) => `url(${props.image})`};
  background-size: cover;
  position: relative;
`;

const GameSubLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0 1rem;
`;

const GameSubRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const GameSubLine = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  padding: 0rem 0.5rem 0rem 0rem;
  justify-content: center;
  width: 100%;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #4486c6;
  justify-content: flex-start;
  height: 20px;
  font-size: 0.7;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  height: ${(props) =>
    props.higher ? "80px" : props?.medium ? "60px" : "45px"};
  width: 100%;
  opacity: 0.75;
  font-size: 0.75rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  margin-left: 1rem;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  margin: 4px;
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
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
  justify-content: flex-start;
  transform: scale(1.25) translate(0.75rem, 0.25rem);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  width: 100%;
  background-color: ${(props) =>
    props.achieved ? COLOR_UNLOCKED : props.color};
  border: 1px solid #eee;
`;

const GameHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  background: "#FEFEFE";
  padding: 0.5rem;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 70vh;
  min-height: 70vh;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 1rem;
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
  border: 1px solid #ddd;
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
  background-color: #f5f5f7;
`;

const Rarest2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  min-height: 600px;
  max-height: 600px;
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
  border: 1px solid #ddd;
`;

const Milestones = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-top: 1rem;
`;

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 0.5rem;
  color: #b9c7e5;
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
  background-color: #bababa;
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
  width: 100px;
  height: 14px;
  background-color: #bababa;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 12px;
  background-color: #336291;
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
  padding: 0 1rem;
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
  width: 100%;
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
  padding: 0.25rem 0.5rem 0.25rem 0;
  color: #666666;
  height: 30px;
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

const GameData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 30px;
  width: 100%;
  padding: 0rem 1rem;
`;

const GameInfo = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-start;
`;

const GameImage = styled.div`
  width: 100px;
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
  background-color: ${(props) => props.color};
  color: #333;
  padding: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const GameContainerCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 4px;
  border: 1px solid #ddd;
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

const Games = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  min-height: calc(87vh);
  max-height: calc(87vh);
  overflow: scroll;
  padding-top: 2rem;
`;

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
