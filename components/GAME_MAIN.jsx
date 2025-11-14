import React from "react";
import styled from "styled-components";
import { formatDate1, formatDate2 } from "../helpers/dateHelper";
import PlatinumIconS from "./PlatinumIconS";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import {
  COLOR_ACCENT_DARK,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
  COLOR_GREY,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
} from "../helpers/colorHelper";
import { useDrag } from "react-dnd";
import ACH_CARD from "./ACH_CARD";

export default function GAME_MAIN({ setTabActive, selectedGame }) {
  const categories = [
    "ALL",
    "COMPLETED",
    "MISSABLE",
    "EASY",
    "GRIND",
    "HARD",
    "ONLINE",
  ];

  return (
    <Game>
      <Game1Line>
        <GameLeft>{selectedGame?.name?.toUpperCase()} TROPHIES</GameLeft>
      </Game1Line>
      <Game2Line>
        {categories?.map((category, index) => {
          const currentAchievements = selectedGame?.achievements?.filter(
            (ach) => ach?.kanbanLane == category || category == "ALL"
          );

          return (
            <KanbanSingle>
              <KanbanTitle index={index}>{category}</KanbanTitle>
              <KanbanData>
                {currentAchievements?.map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    "Hidden achievement:"
                  )?.[1];
                  return (
                    <ACH_CARD
                      ach={ach}
                      index={index}
                      desc1={desc1}
                      desc2={desc2}
                      desc3={desc3}
                    />
                  );
                })}
              </KanbanData>
            </KanbanSingle>
          );
        })}
      </Game2Line>
    </Game>
  );
}

const KanbanTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: #336291;
  padding: 0.25rem 1rem;
  width: 100%;
  color: #fefefe;
`;

const KanbanData = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-height: 60vh;
  min-height: 600vh;
  overflow: scroll;
  color: #717171;
`;

const KanbanSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin: 0.25rem;
  flex: 1;
  background-color: #e7e7e7;
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

const GameLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
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
  font-size: 0.5rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
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
  padding: 0.5rem;
  flex: 2;
  width: 100%;
  opacity: 0.75;
  font-size: 0.75rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
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
  width: 500px;
  background-color: ${(props) =>
    props.achieved ? COLOR_UNLOCKED : props.color};
  border: 1px solid #eee;
  cursor: pointer;

  &:hover {
    border: 1px solid #d3d3d3;
  }
`;

const Game2Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem 0.25rem;
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
