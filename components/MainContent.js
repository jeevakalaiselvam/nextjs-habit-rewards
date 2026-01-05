import styled from 'styled-components';
import {
  COLOR_BRONZE,
  generateDarkTextColorForLightBg,
} from '../helpers/colorHelper';
import { useEffect, useState } from 'react';

import {
  calculateLevelForAchs,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
} from '../helpers/trophyHelper';

import EditGameForm from './EditGameForm';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Row, Spin } from 'antd';

import GAMES_MAIN from './GAMES_MAIN';
import GAME_MAIN from './GAME_MAIN';
import TROPHIES_MAIN from './TROPHIES_MAIN';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  tabActive,
  setTabActive,
  setLearntAchs,
  learntAchs,
}) {
  const [selectedMode, setSelectedMode] = useState('GAMES');
  const [selectedGame, setSelectedGame] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [gameData, setGameData] = useState({});
  const [gameSearch, setGameSearch] = useState('');

  let completedGames = [],
    notCompletedGames = [];
  let sortedGames = games.sort((a, b) => {
    return a.completion - b.completion;
  });

  sortedGames = sortedGames?.filter((game) =>
    game?.name?.toLowerCase()?.includes(gameSearch?.toLowerCase())
  );

  let allUnlocked = [];
  let notUnlocked = [];
  games?.forEach((game) => {
    if (game?.completion == 100) {
      completedGames.push(game);
    } else {
      notCompletedGames.push(game);
    }
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 1 || ach?.achievedByLearning) {
        allUnlocked.push(ach);
      } else {
        notUnlocked.push(ach);
      }
    });
  });

  return (
    <Container>
      {showEditModal && (
        <EditGameForm
          games={sortedGames}
          selectedGame={selectedGame}
          gameData={gameData}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          refreshData={refreshData}
          setGamesLoading={setGamesLoading}
        />
      )}

      <FirstRow>
        <FRLeft>
          <TabLink
            onClick={() => {
              setSelectedMode('GAMES');
              setTabActive('GAMES');
              if (window) {
                localStorage.setItem('SELECTED_TAB', 'GAMES');
              }
            }}
            active={selectedMode == 'GAMES'}
          >
            Games ({notCompletedGames?.length})
          </TabLink>
          <TabLink
            onClick={() => {
              setSelectedMode('TROPHIES');
              setTabActive('TROPHIES');
              if (window) {
                localStorage.setItem('SELECTED_TAB', 'TROPHIES');
              }
            }}
            active={selectedMode == 'TROPHIES'}
          >
            Achievements ({allUnlocked?.length})
          </TabLink>
          <GameSearch>
            <input
              placeholder="Search Games..."
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
            />
          </GameSearch>
        </FRLeft>
        <FRRight></FRRight>
      </FirstRow>
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
            {tabActive == 'GAMES' && (
              <GAMES_MAIN
                sortedGames={[...games]}
                setSelectedGame={setSelectedGame}
                setSelectedMode={setSelectedMode}
                setGameData={setGameData}
                setTabActive={setTabActive}
                setShowEditModal={setShowEditModal}
              />
            )}

            {tabActive == 'GAME' && (
              <GAME_MAIN
                setTabActive={setTabActive}
                selectedGame={selectedGame}
                setLearntAchs={setLearntAchs}
                learntAchs={learntAchs}
                games={games}
              />
            )}

            {tabActive == 'TROPHIES' && (
              <TROPHIES_MAIN
                sortedGames={sortedGames}
                setSelectedGame={setSelectedGame}
                setSelectedMode={setSelectedMode}
                setGameData={setGameData}
                setTabActive={setTabActive}
                setShowEditModal={setShowEditModal}
              />
            )}
          </SRLeft>
        )}
      </SecondRow>
    </Container>
  );
}

const StatWrapper2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 0rem;
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

const Games1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
`;

const GamesR = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
`;

const GameLineHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  width: 100%;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

// Styles

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 2;
  width: 100%;
  padding: 0rem 1rem;
  background-color: #111923;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #111923;
  width: 100%;
  color: #44484b;
`;

const TabLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  margin-right: 0.5rem;
  font-size: ${(props) => (props.active ? '.8rem' : '0.8rem')};
  padding: 0.25rem 1rem;
  background: ${(props) => (props.active ? '#56A1CC' : '#232f3eff')};
  color: #fefefe;
  border-radius: 2px 2px 0 0;
  /* transform: ${(props) => (props.active ? 'translateY(-.125rem)' : '')}; */
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  position: relative;
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
  flex: 1;

  & input {
    width: 100%;
    outline: none;
    border: none;
    padding: 0.25rem 1rem;
    background-color: #1b2838;
    color: rgb(138, 138, 138);
  }
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111923;
  padding: 0.5rem 1rem;
  width: 100%;
  color: #44484b;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  border-radius: 4px;
  min-height: 91vh;
  background-color: #111923;
`;
