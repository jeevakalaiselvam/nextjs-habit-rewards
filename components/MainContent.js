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
  COLOR_WHITE,
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
import { CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import GameCdImage from "./GameCdImage";
import { formatDate } from "../helpers/dateHelper";
import Panel from "antd/es/splitter/Panel";
import {
  TROPHY_GAME_LIST,
  TROPHY_GAME_OPTIONS,
  TROPHY_GAMES_OPTIONS,
} from "../helpers/optionHelper";
import { Collapse, Modal, Progress, theme } from "antd";
import SilverIcon from "./SilverIcon";
import BronzeIcon from "./BronzeIcon";
import axios from "axios";
import CreateAchForm from "./CreateAchForm";
import WhiteTrophy from "./WhiteTrophy";

const MAX_DESC = 80;
const MEDIUM_DESC = 60;

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  selectedMode,
  setSelectedMode,
  showCreateModal,
  setShowCreatModal,
}) {
  const [selectedRarity, setSelectedRarity] = useState("ULTRA RARE");
  const [selectedGame, setSelectedGame] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState("LIBRARY");
  const [active, setActive] = useState("PROFILE");
  const [gameData, setGameData] = useState({});
  const [showLevelUpModal, setShowLevelUpModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [levelLeft, setLevelLeft] = useState(0);
  const [levelRight, setLevelRight] = useState(0);
  const [platinumC, setPLatinumC] = useState(0);
  const [goldC, setGoldC] = useState(0);
  const [silverC, setSilverC] = useState(0);
  const [bronzeC, setBronzeC] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpNeeded, setXPNeeded] = useState(0);

  const addTrophy = () => {
    try {
      axios
        .post("/api/jeevaachievement", {
          ...formData,
        })
        .then((response) => {});
    } catch (e) {}
  };

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

  const { ultrarare, veryrare, rare, uncommon, common } =
    getAchsBasedOnRarity(games);

  let selectedRarityAchs = [];

  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

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

  allUnlockedAchs = games;

  const triggerLevelUpAnimation = (color) => {
    addTrophy();
    setShowLevelUpModal(true);
    let completed = 0;
    let allCompletion = 0;
    let unearned = 0;
    let platinumA = 0;
    let goldA = 0;
    let silverA = 0;
    let bronzeA = 0;
    let platinum = 0;
    let gold = 0;
    let silver = 0;
    let bronze = 0;
    let total = 0;

    games?.forEach((ach) => {
      if (ach?.color == "Platinum") {
        platinum++;
        total++;
      }
      if (ach?.color == "Gold") {
        gold++;
        total++;
      }
      if (ach?.color == "Silver") {
        silver++;
        total++;
      }
      if (ach?.color == "Bronze") {
        bronze++;
        total++;
      }
    });

    let averageCompletion =
      allCompletion == 0 ? 0 : allCompletion / games?.length;

    let { progressPercent, level, xpForNextLevel, remainingXP } =
      calculatePSLevelAndProgress(platinum, gold, silver, bronze);

    setLevelLeft(level);
    setLevelRight(level + 1);
    setPLatinumC(platinum);
    setGoldC(gold);
    setSilverC(silver);
    setBronzeC(bronze);
    setLevelProgress(progressPercent);
    setXPNeeded(xpForNextLevel);

    setTimeout(() => {
      let completed = 0;
      let allCompletion = 0;
      let unearned = 0;
      let platinumA = 0;
      let goldA = 0;
      let silverA = 0;
      let bronzeA = 0;
      let platinum = 0;
      let gold = 0;
      let silver = 0;
      let bronze = 0;
      let total = 0;

      games?.forEach((ach) => {
        if (ach?.color == "Platinum") {
          platinum++;
          total++;
        }
        if (ach?.color == "Gold") {
          gold++;
          total++;
        }
        if (ach?.color == "Silver") {
          silver++;
          total++;
        }
        if (ach?.color == "Bronze") {
          bronze++;
          total++;
        }
      });

      if (color == "Platinum") {
        platinum++;
        total++;
      }
      if (color == "Gold") {
        gold++;
        total++;
      }
      if (color == "Silver") {
        silver++;
        total++;
      }
      if (color == "Bronze") {
        bronze++;
        total++;
      }

      let averageCompletion =
        allCompletion == 0 ? 0 : allCompletion / games?.length;

      let { progressPercent, level, xpForNextLevel, remainingXP } =
        calculatePSLevelAndProgress(platinum, gold, silver, bronze);

      setLevelLeft(level);
      setLevelRight(level + 1);
      setPLatinumC(platinum);
      setGoldC(gold);
      setSilverC(silver);
      setBronzeC(bronze);
      setLevelProgress(progressPercent);
      setXPNeeded(xpForNextLevel);
    }, 2000);
  };

  const getItems = (panelStyle) => [
    ...TROPHY_GAME_LIST?.map((game, index) => {
      let allCompletion = 0;
      let total = 0;
      let platinum = 0;
      let gold = 0;
      let silver = 0;
      let bronze = 0;

      let unlockedForGame = allUnlockedAchs?.filter(
        (item) => item?.name == game?.name
      );

      unlockedForGame?.forEach((ach) => {
        total++;
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
      });

      let completion = 100;
      completion = completion >= 100 ? 100 : completion;
      allCompletion = allCompletion + completion;

      completion = total * 1;

      let { color, rank } = calculateRankForCompletion(completion);

      return {
        key: game?.name,
        label: (
          <GameContainer
            onClick={() => {}}
            color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
          >
            <GameInfoInner>
              <GameRightCard>
                <GRTop>
                  <GameData>
                    <GameTitle onClick={() => {}}>{game?.name}</GameTitle>
                    <GameCompletion>
                      {total} {total > 1 ? "Trophies" : "Trophy"}
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
                            percentage={Number(completion)?.toFixed(1)}
                          ></Inner>
                          <Text>{Number(completion)?.toFixed(1)} %</Text>
                        </Outer>
                      </TBottom>
                    </Trophies>
                    <Seperator></Seperator>
                    <Platinum isPlatinum={platinum > 0}>
                      <span
                        style={{
                          opacity: platinum > 0 ? 1 : 0.25,
                        }}
                      >
                        <PlatinumIcon />
                      </span>
                    </Platinum>
                    <Seperator></Seperator>
                    <Rank>
                      <span style={{ fontSize: "1.5rem", color: color }}>
                        {rank}
                      </span>
                      <span style={{ fontSize: ".7rem", color: color }}>
                        RANK
                      </span>
                    </Rank>
                  </GameInfo>
                </GRBottom>
              </GameRightCard>
              <GameLeftCard
                onClick={() => {
                  setSelectedMode("GAME");
                }}
              >
                <GameImage url={game?.url} center></GameImage>
              </GameLeftCard>
            </GameInfoInner>
          </GameContainer>
        ),
        children: (
          <ItemsContainer>
            {TROPHY_GAMES_OPTIONS?.map((ach) => {
              return (
                <AchCard
                  color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                  achieved={false}
                  onClick={() => {
                    if (!showLevelUpModal) {
                      setFormData((old) => ({
                        title: ach?.name,
                        color: ach?.color,
                        name: game?.name,
                      }));

                      triggerLevelUpAnimation(ach?.color);

                      if (window) {
                        localStorage.setItem("OPEN_ACCORDION", game?.name);
                      }
                    }
                  }}
                >
                  <AchIconOuter achieved={false}>
                    <AchIcon icon={ach?.icon}>
                      {ach?.color == "Platinum" && <PlatinumIcon />}
                      {ach?.color == "Gold" && <GoldIcon />}
                      {ach?.color == "Silver" && <SilverIcon />}
                      {ach?.color == "Bronze" && <BronzeIcon />}
                    </AchIcon>
                  </AchIconOuter>
                  <AchData>
                    <AchTitle>{ach?.name}</AchTitle>
                    <AchDesc>{ach?.name}</AchDesc>
                  </AchData>
                  <Seperator padding={".25rem"} />
                  <AchTrophy>
                    <span
                      style={{
                        fontSize: ".5rem",
                        transform: "translate(0.25rem, 0rem)",
                      }}
                    >
                      {ach?.color == "Platinum" && (
                        <div
                          style={{
                            transform: "scale(.5) translateX(-.25rem)",
                          }}
                        >
                          <PlatinumIcon />
                        </div>
                      )}
                      {ach?.color == "Gold" && (
                        <div
                          style={{
                            transform: "scale(.5) translateX(-.25rem)",
                          }}
                        >
                          <GoldIcon />
                        </div>
                      )}
                      {ach?.color == "Silver" && (
                        <div
                          style={{
                            transform: "scale(.5) translateX(-.25rem)",
                          }}
                        >
                          <SilverIcon />
                        </div>
                      )}
                      {ach?.color == "Bronze" && (
                        <div
                          style={{
                            transform: "scale(.5) translateX(-.25rem)",
                          }}
                        >
                          <BronzeIcon />
                        </div>
                      )}
                    </span>
                    <AchRarity>
                      <span style={{ fontSize: ".5rem" }}>
                        {ach?.color == "Platinum" && "300 XP"}
                        {ach?.color == "Gold" && "90 XP"}
                        {ach?.color == "Silver" && "60 XP"}
                        {ach?.color == "Bronze" && "15 XP"}
                      </span>
                      <span style={{ fontSize: ".35rem" }}>
                        {ach?.color == "Platinum" && "PLATINUM"}
                        {ach?.color == "Gold" && "GOLD"}
                        {ach?.color == "Silver" && "SILVER"}
                        {ach?.color == "Bronze" && "BRONZE"}
                      </span>
                    </AchRarity>
                  </AchTrophy>
                </AchCard>
              );
            })}
          </ItemsContainer>
        ),
        style: panelStyle,
      };
    }),
  ];

  let openAcc = "";

  if (window) {
    openAcc = localStorage.getItem("OPEN_ACCORDION");
  }

  return (
    <Container>
      {showLevelUpModal && (
        <LevelUpContainer
          onClick={() => {
            setShowLevelUpModal(false);
            refreshData();
          }}
        >
          <LevelUpInner>
            <TrophyContainer>
              <div style={{ fontSize: "2rem", padding: "1rem" }}>Level</div>
            </TrophyContainer>
            <TrophyContainer>
              <HeaderCounts>
                <Section color={COLOR_PLATINUM}>
                  <Top>
                    <span
                      style={{
                        transform: "translateY(-2.5px)",
                        marginRight: ".25rem",
                      }}
                    >
                      <PlatinumIcon />
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                      {platinumC}
                    </span>
                  </Top>
                </Section>
                <Section color={COLOR_GOLD}>
                  <Top>
                    <span
                      style={{
                        transform: "translateY(-2.5px)",
                        marginRight: ".25rem",
                      }}
                    >
                      <GoldIcon />
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                      {goldC}
                    </span>
                  </Top>
                </Section>
                <Section color={COLOR_SILVER}>
                  <Top>
                    <span
                      style={{
                        transform: "translateY(-2.5px)",
                        marginRight: ".25rem",
                      }}
                    >
                      <SilverIcon />
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                      {silverC}
                    </span>
                  </Top>
                </Section>
                <Section color={COLOR_BRONZE}>
                  <Top>
                    <span
                      style={{
                        transform: "translateY(-2.5px)",
                        marginRight: ".25rem",
                      }}
                    >
                      <BronzeIcon />
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                      {bronzeC}
                    </span>
                  </Top>
                </Section>
              </HeaderCounts>
            </TrophyContainer>
            <ProgressContainer>
              <ProgressLeft>Level {levelLeft}</ProgressLeft>
              <ProgressMiddle>
                <XPNeeded>
                  <span style={{ fontSize: ".8rem", opacity: ".75" }}>
                    {xpNeeded} XP
                  </span>
                </XPNeeded>
                <Progress percent={levelProgress} showInfo={false} />
              </ProgressMiddle>
              <ProgressRight>Level {levelRight}</ProgressRight>
            </ProgressContainer>
          </LevelUpInner>
        </LevelUpContainer>
      )}
      {showCreateModal && (
        <Modal
          title="Log Trophy"
          open={showCreateModal}
          onOk={() => {
            addTrophy();
            setShowCreatModal(false);
          }}
          onCancel={() => {
            setShowCreatModal(false);
          }}
        >
          <CreateAchForm setFormData={setFormData} formData={formData} />
        </Modal>
      )}
      {!gamesLoading && (
        <SRLeft showLevelUpModal={showLevelUpModal}>
          {selectedMode == "GAMES" && (
            <Games>
              <Games2LineR>
                <Collapse
                  bordered={false}
                  expandIconPosition="right"
                  defaultActiveKey={[openAcc]}
                  expandIcon={null}
                  style={{ background: token.colorBgContainer }}
                  items={getItems(panelStyle)}
                />
              </Games2LineR>
            </Games>
          )}
          {selectedMode == "GAME" && (
            <Games>
              <Game2Line>
                {allUnlockedAchs?.map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    "Hidden achievement:"
                  )?.[1];

                  return (
                    <AchCard
                      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                      achieved={true}
                    >
                      <Unlocked>
                        {formatDate(new Date(ach?.unlocktime * 1000))}
                      </Unlocked>
                      <AchIconOuter achieved={true}>
                        <AchIcon icon={ach?.icon}>
                          {ach?.color == "Platinum" && <PlatinumIcon />}
                          {ach?.color == "Gold" && <GoldIcon />}
                          {ach?.color == "Silver" && <SilverIcon />}
                          {ach?.color == "Bronze" && <BronzeIcon />}
                        </AchIcon>
                      </AchIconOuter>
                      <AchData>
                        <AchTitle>{ach?.title}</AchTitle>
                        <AchDesc
                          higher={ach?.description?.length > MAX_DESC}
                          medium={ach?.description?.length > MEDIUM_DESC}
                        >
                          {ach?.description}
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
                            {ach?.color == "Platinum" && "300 XP"}
                            {ach?.color == "Gold" && "90 XP"}
                            {ach?.color == "Silver" && "60 XP"}
                            {ach?.color == "Bronze" && "15 XP"}
                          </span>
                          <span style={{ fontSize: ".35rem" }}>
                            {ach?.color == "Platinum" && "PLATINUM"}
                            {ach?.color == "Gold" && "GOLD"}
                            {ach?.color == "Silver" && "SILVER"}
                            {ach?.color == "Bronze" && "BRONZE"}
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

const HeaderCounts = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 100%;
  padding: 0.25rem;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 1rem;
  flex: 1;
  color: ${(props) => props.color};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 300;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ProgressLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
`;

const ProgressMiddle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1rem 0.5rem;
  position: relative;
`;

const XPNeeded = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
`;

const ProgressRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.5rem;
`;

const TrophyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  margin-bottom: 0.25rem6;
`;

const LevelUpInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  width: 100%;
  color: #333;
  padding: 1rem;
  min-height: 20vh;
`;

const LevelUpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  width: 80%;
  top: 20%;
  z-index: 1000;
  transform: translate(-50%, -50%);
  position: absolute;
  background-size: contain;
  background-color: #fefefe;
  min-height: 20vh;
  padding: 1rem;

  border: 1px solid #ffd700;
  color: #ffd700;
  padding: 16px 24px;
  border-radius: 8px;
  text-align: center;

  box-shadow: 0 0 8px #ffd700;
  animation: goldBreath 2s ease-in-out infinite;

  @keyframes goldBreath {
    0%,
    100% {
      box-shadow: 0 0 10px #ffd700, 0 0 12px #ffa500;
    }
    50% {
      box-shadow: 0 0 30px #ffd700, 0 0 32px #ffa500;
    }
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem 0.125rem 0;
  color: #666666;
  width: 100%;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 1rem;
  color: #666666;
  width: 100%;
`;

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
  transform: translateX(-0.5rem);
`;

const GameHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.5rem 0;
  color: #666666;
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
  color: #4486c6;
  justify-content: flex-start;
  height: 20px;
  font-size: 0.8rem;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  height: 40px;
  width: 100%;
  opacity: 0.8;
  font-size: 0.7rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  margin-left: 0.25rem;
  transform: ${(props) =>
    props?.achieved ? "translateY(0.5rem)" : "translateY(0rem)"};
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  background: ${(props) => (props.achieved ? COLOR_UNLOCKED : "#00000000")};
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
  color: ${COLOR_UNLOCKED_TEXT};
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
  padding-bottom: ${(props) => (props.achieved ? "1rem" : "0rem")};
  position: relative;

  &:active {
    background-color: ${(props) => COLOR_UNLOCKED};
  }
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
  height: 14px;
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
  width: 100%;
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

const GameImageInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GameFirstInner = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 1rem;
  flex-direction: column;
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

const GameFirst = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const GameSecond = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.25rem 0rem;
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
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  background-position: center;
  position: relative;
  border-radius: 8px;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: red;
  justify-content: flex-start;
  flex-direction: column;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 4px 0px 0px 0px;
  width: 100%;
  border: 1px solid #eee;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Games2LineR = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
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
  filter: ${(props) => (props.showLevelUpModal ? "blur(2px)" : "")};
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
