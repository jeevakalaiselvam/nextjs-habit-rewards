import React, { useRef } from 'react';
import styled from 'styled-components';
import { COLOR_UNLOCKED, COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import KANBAN_COLUMN from './KANBAN_COLUMN';
import { useSelector } from 'react-redux';

export default function GAME_MAIN({
  selectedGame,
  setLearntAchs,
  learntAchs,
  games,
  refreshData,
  setTabActive,
  setSelectedGame,
  gameIdRef,
}) {
  const { kanbanObj } = useSelector((state) => state.kanban);
  const gameData = kanbanObj?.[selectedGame?.id] || {};
  const [showingAll, setShowingAll] = React.useState(true);

  const allCategories = ['COMPLETED'];

  let selectedGameInner = { id: '', achievements: [] };

  if (selectedGameInner) {
    selectedGameInner = games.find((game) => {
      if (gameIdRef.current) {
        return game?.id == gameIdRef.current;
      } else {
        return game?.id == selectedGame;
      }
    });
  }

  console.log({ gameIdRef });

  return (
    <Game>
      <Game2Line>
        {allCategories.map((category) => {
          let currentAchievements = [];

          if (category === 'NOT COMPLETED') {
            currentAchievements = (
              selectedGameInner?.achievements ?? []
            )?.filter(
              (ach) =>
                !allCategories.some((cat) =>
                  gameData[cat]?.includes(ach.name)
                ) &&
                ach.achieved != 1 &&
                ach.achievedByLearning != 1
            );
          } else if (category === 'COMPLETED') {
            currentAchievements = selectedGameInner?.achievements
              ?.filter((ach) => {
                return ach.achieved == 1 || ach.achievedByLearning;
              })
              .sort((a, b) => b.percentage - a.percentage);
          } else {
            currentAchievements = (selectedGame?.achievements ?? [])?.filter(
              (ach) =>
                gameData[category]?.includes(ach.name) && ach.achieved != 1
            );
          }

          return (
            <KANBAN_COLUMN
              setShowingAll={setShowingAll}
              showingAll={showingAll}
              key={category}
              category={category}
              currentAchievements={currentAchievements}
              gameId={selectedGameInner?.id}
              learntAchs={learntAchs}
              setLearntAchs={setLearntAchs}
              refreshData={refreshData}
              setTabActive={setTabActive}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
              gameIdRef={gameIdRef}
            />
          );
        })}
      </Game2Line>
    </Game>
  );
}

const Game2Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: 0rem 0rem;
  background-color: #111923;
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
