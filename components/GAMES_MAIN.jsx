import React from "react";
import styled from "styled-components";
import { calculateRankForCompletion } from "../helpers/trophyHelper";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { formatDate } from "../helpers/dateHelper";
import PlatinumIcon from "./PlatinumIcon";
import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_SILVER2,
} from "../helpers/colorHelper";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import GameCdImage from "./GameCdImage";
import GameCdImageSmall from "./GameCdImageSmall";
import { FaCheck, FaCheckCircle, FaCircle } from "react-icons/fa";

export default function GAMES_MAIN({
  sortedGames,
  setSelectedGame,
  setSelectedMode,
  setGameData,
  setTabActive,
  setShowEditModal,
  selectedGame,
  active,
}) {
  return (
    <Games>
      <Games1Line>
        <GamesLeft>ALL GAMES</GamesLeft>
        <GamesRight></GamesRight>
      </Games1Line>
      <Games2Line>
        {sortedGames
          ?.filter((game) => {
            return active ? game?.completion > 0 : game?.completion == 0;
          })
          ?.map((game, index) => {
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

            completed = completed > total ? total : completed;

            let { color, rank } = calculateRankForCompletion(completion);
            let lastAch = game?.achievements?.sort(
              (ach1, ach2) => +ach2?.percentage - +ach1?.percentage
            )?.[game?.achievements?.length - 1];

            let allUnlocked = game?.achievements
              ?.filter((ach) => ach?.achieved == 1)
              ?.sort((ach1, ach2) => +ach2?.percentage - +ach1?.percentage);

            let lastUnlocked = allUnlocked?.[allUnlocked?.length - 1];

            let isPlatinumNotAdded = game?.achievements?.length == 1;

            return (
              <GameContainer
                onClick={() => {}}
                color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
              >
                <GameCdImageSmall
                  cover={game.cover}
                  scale={3}
                  onClick={() => {
                    setSelectedGame(game);
                    setSelectedMode("GAME");
                    setTabActive("GAME");
                    if (window) {
                      localStorage.setItem("SELECTED_GAME_ID", game?.id);
                    }
                  }}
                />
                <GameInfo>
                  <Rank>
                    <span style={{ fontSize: "1.5rem", color: color }}>
                      {rank}
                    </span>
                    <span style={{ fontSize: ".9rem", color: color }}>
                      RANK
                    </span>
                  </Rank>
                  <Seperator></Seperator>
                  <Trophies
                    onClick={() => {
                      setShowEditModal(true);
                      setGameData(() => game);
                    }}
                  >
                    <TTop>
                      <TSingle>
                        <GoldIconS />
                        <span
                          style={{
                            transform: "translate(-.5rem,-.25rem)",
                            color: COLOR_GOLD,
                            fontSize: "1.25rem",
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
                            fontSize: "1.25rem",
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
                            fontSize: "1.25rem",
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
                  <Platinum isPlatinum={completed >= total} color={color}>
                    <span style={{ fontSize: "1.25rem" }}>
                      <FaCheckCircle />
                    </span>
                    <span
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 500,
                      }}
                    >
                      {Number(
                        lastUnlocked?.percentage >= 0
                          ? lastUnlocked?.percentage
                          : 0
                      )}{" "}
                      %
                    </span>
                  </Platinum>
                </GameInfo>
              </GameContainer>
            );
          })}
      </Games2Line>
    </Games>
  );
}

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 0.5rem;
  color: ${(props) => props.color};
  flex: 1;
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12px;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 0.8rem;
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
  width: 150px;
  height: 18px;
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
  height: 18px;
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
  flex: 1;
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 50px;
  flex: 1;
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
  width: 100%6;
  justify-content: center;
  color: #057fcc;
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
  padding: 0.125rem 0.5rem 0.125rem 0;
  color: #666666;
`;

const GameHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.125rem 0;
  color: #666666;
`;

const GameCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0;
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
  padding: 0rem 1rem;
  flex-direction: column;
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  width: 100%;
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
  width: 500px;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 16px 4px;
  border: 1px solid #ddd;
  flex-direction: column;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
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
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const GamesLeft = styled.div`
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
