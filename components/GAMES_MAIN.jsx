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
import { Progress } from "antd";

export default function GAMES_MAIN({
  sortedGames,
  setSelectedGame,
  setSelectedMode,
  setGameData,
  setTabActive,
  setShowEditModal,
}) {
  return (
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
              color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
              onClick={() => {
                setSelectedGame(game?.id);
                setSelectedMode("GAME");
                setTabActive("GAME");
              }}
            >
              <GameImage url={HEADER_IMAGE(game?.id)}></GameImage>
              <BottomInner>
                <Top>
                  <TLeft>ACHIEVEMENTS</TLeft>
                  <TRight
                    onClick={() => {
                      setShowEditModal(true);
                      setGameData(() => game);
                    }}
                  >
                    {game?.completed}/{game?.total}
                  </TRight>
                </Top>
                <Bottom>
                  <Progress
                    percent={game?.completion}
                    showInfo={false}
                    trailColor="#3C3F49"
                    strokeColor={"#199FFF"}
                  />
                </Bottom>
              </BottomInner>
            </GameContainer>
          );
        })}
      </Games2Line>
    </Games>
  );
}

const TLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  grid-area: label;
  font-weight: 700;
  font-size: 0.75rem;
  margin-right: 8px;
  color: inherit;
  letter-spacing: 0.03em;
`;

const TRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2px 0 0 0;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const BottomInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  background-color: #16202d;
  width: 400px;
  color: #b8bcbf;
  padding: 2px 4px;
`;

const GameImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 400px;
  height: 187.5px;
  background-image: ${(props) => `url(${props.url})`};
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #111923;
  color: #333;
  padding: 4px;
  flex-direction: column;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  background-color: #111923;
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
  background-color: #111923;
`;
