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
import { TbEdit } from "react-icons/tb";
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

export default function MainContent({ games }) {
  const [selectedMode, setSelectedMode] = useState("GAMES");
  const [selectedGame, setSelectedGame] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState("PROFILE");
  const [active, setActive] = useState("PROFILE");
  const [gameData, setGameData] = useState({});

  const { ultrarare, veryrare, rare, uncommon, common } =
    getAchsBasedOnRarity(games);

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

  selectedGame?.achievements?.forEach((ach) => {
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

  let completed = selectedGame?.achievements?.filter(
    (item) => item?.achieved == 1
  )?.length;
  let completion = completed == 0 ? 0 : (completed / total) * 100;

  let { color, rank } = calculateRankForCompletion(completion ?? 0);
  let lastAch = selectedGame?.achievements?.sort(
    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
  )?.[selectedGame?.achievements?.length - 1];

  return (
    <Container>
      {showEditModal && (
        <EditGameForm
          gameData={gameData}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
      )}
      <FirstRow>
        <FRItem>P</FRItem>
        <FRLeft>OBSIDIANLOGAN'S PROFILE</FRLeft>
        <FRRight>
          <TabLink
            onClick={() => {
              setSelected("PROFILE");
              setSelectedMode("GAMES");
            }}
            active={selected == "PROFILE"}
            onMouseEnter={() => setActive("PROFILE")}
            onMouseLeave={() => setActive("")}
          >
            PROFILE
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("TROPHY LOG")}
            active={selected == "TROPHY LOG"}
            onMouseEnter={() => setActive("TROPHY LOG")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY LOG
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("TROPHY ADVISOR")}
            active={selected == "TROPHY ADVISOR"}
            onMouseEnter={() => setActive("TROPHY ADVISOR")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY ADVISOR
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("STATS")}
            active={selected == "STATS"}
            onMouseEnter={() => setActive("STATS")}
            onMouseLeave={() => setActive("")}
          >
            STATS
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("LEVEL HISTORY")}
            active={selected == "LEVEL HISTORY"}
            onMouseEnter={() => setActive("LEVEL HISTORY")}
            onMouseLeave={() => setActive("")}
          >
            LEVEL HISTORY
          </TabLink>
        </FRRight>
      </FirstRow>
      <SecondRow>
        <SRLeft>
          {selectedMode == "GAMES" && (
            <Games>
              <Games1Line>
                <GamesLeft>GAMES</GamesLeft>
                <GamesRight></GamesRight>
              </Games1Line>
              <Games2Line>
                {games?.map((game, index) => {
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
                    }
                  });

                  let completed = game?.achievements?.filter(
                    (item) => item?.achieved == 1
                  )?.length;
                  let completion =
                    completed == 0 ? 0 : (completed / total) * 100;
                  allCompletion = allCompletion + completion;
                  if (total == completed) {
                    completed = completed + 1;
                  }

                  let { color, rank } = calculateRankForCompletion(completion);
                  let lastAch = game?.achievements?.sort(
                    (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
                  )?.[game?.achievements?.length - 1];

                  return (
                    <GameContainer
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
                            style={{ opacity: total == completed ? 1 : 0.5 }}
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
                            {lastAch?.percentage} %
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
            <Game>
              <Game1Line>
                <GameLeft>
                  {selectedGame?.name?.toUpperCase()} TROPHIES
                </GameLeft>
              </Game1Line>
              <GameSubLine>
                <GameSubLeftImage
                  image={HEADER_IMAGE(selectedGame?.id)}
                ></GameSubLeftImage>
                <GameSubLeft>Base Game</GameSubLeft>
                <GameSubRight>
                  <Rank>
                    <span style={{ fontSize: "1.5rem", color: color }}>
                      {rank}
                    </span>
                    <span style={{ fontSize: ".7rem" }}>RANK</span>
                  </Rank>
                  <Seperator></Seperator>
                  <Platinum isPlatinum={total == completed}>
                    <span style={{ opacity: total == completed ? 1 : 0.25 }}>
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
                </GameSubRight>
              </GameSubLine>
              <Game2Line>
                {selectedGame?.achievements?.map((ach, index) => {
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
                        <AchDesc>{ach?.description}</AchDesc>
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
              </Game2Line>
            </Game>
          )}
        </SRLeft>
        <SRRight>
          <Rarest>
            <Rarest1Line>
              <GamesLeft>RAREST TROPHIES</GamesLeft>
              <GamesRight></GamesRight>
            </Rarest1Line>
            <Rarest2Line></Rarest2Line>
            <RareSelection>
              <RItem>
                <span style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>
                  {ultrarare?.length}
                </span>
                <span style={{ fontSize: ".7rem" }}>ULTRA RARE</span>
              </RItem>
              <Seperator padding={".25rem"}></Seperator>
              <RItem>
                <span style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>
                  {veryrare?.length}
                </span>
                <span style={{ fontSize: ".7rem" }}>VERY RARE</span>
              </RItem>
              <Seperator padding={".25rem"}></Seperator>
              <RItem>
                <span style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>
                  {rare?.length}
                </span>
                <span style={{ fontSize: ".7rem" }}>RARE</span>
              </RItem>
              <Seperator padding={".25rem"}></Seperator>
              <RItem>
                <span style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>
                  {uncommon?.length}
                </span>
                <span style={{ fontSize: ".7rem" }}>UNCOMMON</span>
              </RItem>
              <Seperator padding={".25rem"}></Seperator>
              <RItem>
                <span style={{ fontSize: "1.3rem", marginBottom: ".25rem" }}>
                  {common?.length}
                </span>
                <span style={{ fontSize: ".7rem" }}>COMMON</span>
              </RItem>
            </RareSelection>
          </Rarest>
          <Milestones>
            <Rarest1Line>
              <GamesLeft>TROPHY MILESTONES</GamesLeft>
              <GamesRight></GamesRight>
            </Rarest1Line>
            <Rarest2Line></Rarest2Line>
          </Milestones>
        </SRRight>
      </SecondRow>
    </Container>
  );
}

const GameSubLeftImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100px;
  background: ${(props) => `url(${props.image})`};
  background-size: cover;
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
  padding-right: 1rem;
  justify-content: flex-end;
  flex: 1;
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
  color: #4486c6;
  justify-content: flex-start;
  height: 35px;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  height: 35px;
  width: 100%;
  opacity: 0.75;
  font-size: 0.88rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
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
  background-size: cover;
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
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transform: scale(2) translate(1rem, 0.25rem);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  padding-right: 3rem;
  background-color: ${(props) =>
    props.achieved ? COLOR_UNLOCKED : props.color};
  border: 1px solid #eee;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
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
  min-height: 200px;
  max-height: 200px;
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
  transform: translateX(0.25rem);
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
  justify-content: center;
  color: #057fcc;
`;

const GameCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.5rem 0;
  color: #666666;
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
  flex: 1;
  padding: 0rem 1rem;
  flex-direction: column;
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
  background-color: ${(props) => props.color};
  color: #333;
  padding: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  min-height: 50vh;
  max-height: 50vh;
  width: 100%;
`;

const Games1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const Games = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
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
  justify-content: center;
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
  flex: 2;
  padding: 0.5rem;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #f7f7f7;
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
  background-color: #e7e7e7;
  padding: 1rem;
  width: 100%;
  color: #44484b;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 1800px;
  border-radius: 4px;
  transform: translateY(-2rem);
  background-color: #292b2d;
`;
