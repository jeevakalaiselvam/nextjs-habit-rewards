import styled from 'styled-components';
import {
  COLOR_ACCENT,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREEN2,
  COLOR_GREY,
  COLOR_SILVER2,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
  generateDarkTextColorForLightBg,
} from '../helpers/colorHelper';
import { useEffect, useState } from 'react';
import { HEADER_IMAGE } from '../helpers/urlHelper';

import {
  calculateLevelForAchs,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
} from '../helpers/trophyHelper';

import GoldIconS from './GoldIconS';
import SilverIconS from './SilverIconS';
import BronzeIconS from './BronzeIconS';
import PlatinumIcon from './PlatinumIcon';

import EditGameForm from './EditGameForm';
import PlatinumIconS from './PlatinumIconS';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Row, Spin } from 'antd';

import {
  formatDate,
  formatDate1,
  formatDate2,
  formatDate3,
} from '../helpers/dateHelper';

import LevelUpIcon from './LevelUpIcon';
import LevelProgressChart from './LevelProgressChart';

import STATS from './STATS';
import RECENT_ACHIEVEMENTS from './RECENT_ACHIEVEMENTS';
import GAMES_MAIN from './GAMES_MAIN';
import GAME_MAIN from './GAME_MAIN';
import TROPHIES_MAIN from './TROPHIES_MAIN';
import SETTINGS_MAIN from './SETTINGS_MAIN';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import GAME_INFO from './GAME_INFO';
import GAME_INFO_ALT from './GAME_INFO_ALT';

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  platinumDataLoading,
  tabActive,
  setTabActive,
  gamesToInclude,
  setGamesToInclude,
  refreshIncludedGames,
}) {
  const [selectedRarity] = useState('COMMON');
  const [selectedMode, setSelectedMode] = useState('GAMES');
  const [selectedGame, setSelectedGame] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [gameData, setGameData] = useState({});
  const [gameSearch, setGameSearch] = useState('');
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
      if (ach?.color == 'Platinum') {
        platinumABG++;
      }
      if (ach?.color == 'Gold') {
        goldABG++;
      }
      if (ach?.color == 'Silver') {
        silverABG++;
      }
      if (ach?.color == 'Bronze') {
        bronzeABG++;
      }
    } else {
      if (ach?.color == 'Platinum') {
        platinumBG++;
      }
      if (ach?.color == 'Gold') {
        goldBG++;
      }
      if (ach?.color == 'Silver') {
        silverBG++;
      }
      if (ach?.color == 'Bronze') {
        bronzeBG++;
      }
    }
  });

  totalBG = selectedGame?.achievements?.length;
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
      dlcKey: 'DLC1',
      name: selectedGame?.dlc1Name,
      image: selectedGame?.dlc1Image,
    },

    {
      dlcKey: 'DLC2',
      name: selectedGame?.dlc2Name,
      image: selectedGame?.dlc2Image,
    },

    {
      dlcKey: 'DLC3',
      name: selectedGame?.dlc3Name,
      image: selectedGame?.dlc3Image,
    },

    {
      dlcKey: 'DLC4',
      name: selectedGame?.dlc4Name,
      image: selectedGame?.dlc4Image,
    },

    {
      dlcKey: 'DLC5',
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

  let sortedGames = games.sort((a, b) => {
    return a?.name.localeCompare(b?.name, undefined, { sensitivity: 'base' });
  });

  let platinumGames = [];
  let nonPlatinumGames = [];

  platinumGames = sortedGames?.filter((game) => {
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
        if (ach?.color == 'Platinum') {
          platinumA++;
        }
        if (ach?.color == 'Gold') {
          goldA++;
        }
        if (ach?.color == 'Silver') {
          silverA++;
        }
        if (ach?.color == 'Bronze') {
          bronzeA++;
        }
      } else {
        if (ach?.color == 'Platinum') {
          platinum++;
        }
        if (ach?.color == 'Gold') {
          gold++;
        }
        if (ach?.color == 'Silver') {
          silver++;
        }
        if (ach?.color == 'Bronze') {
          bronze++;
        }
      }
    });

    let completed = game?.achievements?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );

    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }

    completed = completed > total ? total : completed;

    return completion == 100;
  });

  nonPlatinumGames = sortedGames?.filter((game) => {
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
        if (ach?.color == 'Platinum') {
          platinumA++;
        }
        if (ach?.color == 'Gold') {
          goldA++;
        }
        if (ach?.color == 'Silver') {
          silverA++;
        }
        if (ach?.color == 'Bronze') {
          bronzeA++;
        }
      } else {
        if (ach?.color == 'Platinum') {
          platinum++;
        }
        if (ach?.color == 'Gold') {
          gold++;
        }
        if (ach?.color == 'Silver') {
          silver++;
        }
        if (ach?.color == 'Bronze') {
          bronze++;
        }
      }
    });

    let completed = game?.achievements?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );

    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }

    completed = completed > total ? total : completed;

    return completion != 100;
  });

  const { ultrarare, veryrare, rare, uncommon, common } =
    getAchsBasedOnRarity(games);

  let selectedRarityAchs = [];

  if (selectedRarity == 'ULTRA RARE') {
    selectedRarityAchs = ultrarare;
  }

  if (selectedRarity == 'VERY RARE') {
    selectedRarityAchs = veryrare;
  }

  if (selectedRarity == 'RARE') {
    selectedRarityAchs = rare;
  }

  if (selectedRarity == 'UNCOMMON') {
    selectedRarityAchs = uncommon;
  }

  if (selectedRarity == 'COMMON') {
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
        if (old < allUnlocked?.length - 1) {
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

  useEffect(() => {
    if (window) {
      let oldId = '';
      oldId = localStorage.getItem('SELECTED_GAME_ID');
      let game = games?.find((game) => game?.id == oldId);
      setSelectedGame(game);
    }
  }, [games]);

  let shouldShowRight =
    selectedMode !== 'LIBRARY' &&
    selectedMode !== 'LIBRARY_NEW' &&
    selectedMode !== 'TROPHY_LOG' &&
    selectedMode !== 'LEVEL_HISTORY' &&
    selectedMode !== 'TROPHY_ADVISOR' &&
    selectedMode !== 'STATS';

  const { levelAchs } = calculateLevelForAchs(games);

  const saveIncludedGame = async () => {
    try {
      await axios.post('/api/include/include', {
        games: gamesToInclude,
      });
      refreshIncludedGames();
      setSelectedMode('GAMES');

      console.log('Games updated successfully');
    } catch (error) {
      console.error('Error saving games', error);
    }
  };

  return (
    <Container>
      {showEditModal && (
        <EditGameForm
          games={games}
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
              setSelectedMode('ACTIVE');
              setTabActive('ACTIVE');
              if (window) {
                localStorage.setItem('SELECTED_TAB', 'ACTIVE');
              }
            }}
            active={selectedMode == 'ACTIVE'}
          >
            ACTIVE
          </TabLink>
          <TabLink
            onClick={() => {
              setSelectedMode('BACKLOG');
              setTabActive('BACKLOG');
              if (window) {
                localStorage.setItem('SELECTED_TAB', 'BACKLOG');
              }
            }}
            active={selectedMode == 'BACKLOG'}
          >
            BACKLOG
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
            TROPHIES
          </TabLink>
        </FRLeft>
        {selectedMode == 'GAME' && (
          <FRRight>
            <GAME_INFO_ALT game={selectedGame} />
          </FRRight>
        )}
        {selectedMode == 'GAMES' && (
          <FRRight>
            <GameSearch>
              <input
                placeholder="Search Games..."
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
              />
            </GameSearch>
          </FRRight>
        )}
      </FirstRow>
      {/* <RECENT_ACHIEVEMENTS allUnlocked={allUnlocked} activeAch={activeAch} /> */}
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
            {tabActive == 'ACTIVE' && (
              <GAMES_MAIN
                sortedGames={[...nonPlatinumGames, ...platinumGames]}
                setSelectedGame={setSelectedGame}
                setSelectedMode={setSelectedMode}
                setGameData={setGameData}
                setTabActive={setTabActive}
                setShowEditModal={setShowEditModal}
                selectedGame={selectedGame}
                active={true}
              />
            )}

            {tabActive == 'BACKLOG' && (
              <GAMES_MAIN
                sortedGames={[...nonPlatinumGames, ...platinumGames]}
                setSelectedGame={setSelectedGame}
                setSelectedMode={setSelectedMode}
                setGameData={setGameData}
                setTabActive={setTabActive}
                setShowEditModal={setShowEditModal}
                selectedGame={selectedGame}
                active={false}
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

            {tabActive == 'GAME' && (
              <GAME_MAIN
                setTabActive={setTabActive}
                selectedGame={selectedGame}
              />
            )}

            {selectedMode == 'SETTINGS' && (
              <GamesR>
                <GameLineHours>
                  <Games1Line>
                    <GamesLeft>SETTINGS</GamesLeft>
                    <GamesRight></GamesRight>
                  </Games1Line>
                  <StatWrapper2>
                    <Row style={{ marginBottom: '1rem', width: '100%' }}>
                      <TextArea
                        rows={10}
                        placeholder="Enter Platinum JSON..."
                        type="text"
                        value={gamesToInclude}
                        onChange={(e) => {
                          setGamesToInclude(e.target.value);
                        }}
                      />
                    </Row>
                    <Row
                      style={{
                        marginRight: '1rem',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={() => {
                          saveIncludedGame();
                        }}
                      >
                        Save
                      </Button>
                    </Row>
                  </StatWrapper2>
                </GameLineHours>
              </GamesR>
            )}
          </SRLeft>
        )}
      </SecondRow>
    </Container>
  );
}

const Trophies = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: '';
  height: 40px;
  background: #000000;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 0.5rem 1rem;
  width: 100%;
`;

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 0.5rem;
  color: ${(props) => props.color};
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

const GameLineTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  flex-direction: column;
  font-size: 0.9rem;
  border: 1px solid #ddd;
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
  font-size: 0.9rem;
  margin-left: 1rem;
  padding: 0.25rem;
  font-weight: ${(props) => (props.active ? 'bold' : '300')};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${COLOR_ACCENT}` : `2px solid #00000000`};
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const FRRight2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  }
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7e7e7;
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
  background-color: #292b2d;
`;
