import React from 'react';
import styled from 'styled-components';
import { formatDate1, formatDate2 } from '../helpers/dateHelper';
import PlatinumIconS from './PlatinumIconS';
import GoldIconS from './GoldIconS';
import SilverIconS from './SilverIconS';
import BronzeIconS from './BronzeIconS';
import PlatinumIcon from './PlatinumIcon';
import {
  COLOR_ACCENT_DARK,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
  COLOR_GREY,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
} from '../helpers/colorHelper';
import { useDrag } from 'react-dnd';
import ACH_CARD from './ACH_CARD';
import KANBAN_COLUMN from './KANBAN_COLUMN';
import { useSelector } from 'react-redux';
import ACH_CARD_PLATINUM from './ACH_CARD_PLATINUM';

export default function GAME_MAIN({ setTabActive, selectedGame }) {
  const { kanbanObj } = useSelector((state) => state.kanban);
  const gameData = kanbanObj?.[selectedGame?.id] || {};
  const [showingAll, setShowingAll] = React.useState(false);

  const allCategories = ['COMPLETED', 'ALL', 'MISSABLE', 'EASY', 'HARD'];

  console.log({ selectedGame });

  return (
    <Game>
      <Game2Line>
        {true &&
          allCategories.map((category) => {
            let currentAchievements = [];

            if (category === 'ALL') {
              if (true) {
                currentAchievements = (
                  selectedGame?.achievements ?? []
                )?.filter(
                  (ach) =>
                    !allCategories.some((cat) =>
                      gameData[cat]?.includes(ach.name)
                    ) && ach.achieved != 1
                );
              } else {
                currentAchievements = (
                  selectedGame?.achievements ?? []
                )?.filter((ach) => ach.achieved == 1);
              }
            } else if (category === 'COMPLETED') {
              currentAchievements = selectedGame?.achievements
                ?.filter((ach) => ach.achieved)
                ?.sort((a, b) => b.unlocktime - a.unlocktime);
            } else {
              currentAchievements = (selectedGame?.achievements ?? [])?.filter(
                (ach) => gameData[category]?.includes(ach.name)
              );
            }

            return (
              <KANBAN_COLUMN
                setShowingAll={setShowingAll}
                showingAll={showingAll}
                key={category}
                category={category}
                currentAchievements={currentAchievements}
                gameId={selectedGame.id}
              />
            );
          })}
      </Game2Line>
    </Game>
  );
}

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
    props.achieved ? COLOR_UNLOCKED_DARK : '#00000000'};
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : '#00000000'};
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

const Game2LineContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 70vh;
  flex-wrap: wrap;
  overflow: scroll;
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
