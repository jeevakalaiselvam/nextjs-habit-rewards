import styled from 'styled-components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainHeader from '../components/MainHeader';
import MainContent from '../components/MainContent';
import { COLOR_ACCENT } from '../helpers/colorHelper';
import {
  getColorBasedOnRarity,
  getRarityBasedOnRarity,
} from '../helpers/achHelper';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Main() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [learntAchsLoading, setLearntAchsLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [tabActive, setTabActive] = useState('GAMES');
  const [gamesToInclude, setGamesToInclude] = useState([]);
  const [learntAchs, setLearntAchs] = useState([]);

  const refreshSteamGames = () => {
    setGamesLoading(true);
    try {
      axios
        .post('/api/steam', { gamesToInclude: gamesToInclude })
        .then((response) => {
          setGames(response?.data?.data ?? []);
          setGamesLoading(false);
        });
    } catch (e) {
      setGamesLoading(false);
    }
  };

  const refreshPlatinumData = () => {
    setPlatinumDataLoading(true);
    try {
      axios.get('/api/platinum').then((response) => {
        setPlatinumData(response?.data);
        setPlatinumDataLoading(false);
      });
    } catch (e) {
      setPlatinumDataLoading(false);
    }
  };

  const refreshData = () => {
    refreshSteamGames();
    refreshLearntAchs();
    // refreshPlatinumData();
  };

  useEffect(() => {
    let finalGames = [];

    finalGames = games?.map((game) => {
      let platinumGameData = platinumData?.find((item) => item?.id == game?.id);
      let formedGame = {};
      let platinumMapper = {};
      let dlcMapper = {};

      platinumGameData?.platinum?.forEach((ach) => {
        platinumMapper[ach?.title] = ach;
      });

      let sortedPlatinumTrophies = game?.achievements
        ?.map((ach) => {
          return {
            ...ach,
            label: getRarityBasedOnRarity(ach?.percentage),
            color: getColorBasedOnRarity(ach?.percentage),
            title: ach?.displayName,
            hiddenDesc:
              platinumMapper[ach?.displayName]?.description ??
              'Secret Achievement',
          };
        })
        ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

      let allAchsMap = {};
      let allLearnAchs = learntAchs?.map((ach) => {
        allAchsMap[ach?.name] = ach;
        return ach?.name;
      });
      formedGame = {
        ...game,
        ...platinumGameData,
        achievements: [
          ...sortedPlatinumTrophies?.map((ach) => {
            let key = `${ach?.gameId}-${ach?.name}`;
            let isLearnt = allLearnAchs?.includes(key);
            return {
              ...ach,
              color: getColorBasedOnRarity(ach?.percentage),
              achieved: allLearnAchs?.includes() ? 1 : 0,
              achievedByLearning: isLearnt,
              unlockedAt: allAchsMap[key]?.unlockedAt ?? '',
              unlocktime: isLearnt
                ? Math.ceil(
                    new Date(allAchsMap[key]?.unlocktime).getTime() / 1000
                  )
                : ach?.unlocktime,
            };
          }),
        ],
      };

      let newCompleted, newCompletion;

      newCompleted = formedGame?.achievements?.reduce((acc, ach) => {
        return acc + (ach?.achieved == 1 || ach?.achievedByLearning);
      }, 0);

      newCompletion = (newCompleted / formedGame?.total) * 100;

      formedGame = {
        ...formedGame,
        completed: newCompleted,
        completion: newCompletion,
      };

      return formedGame;
    });
    setFinalGames(finalGames);
    console.log('FINAL GAMES SET', { finalGames });
  }, [games, platinumData, learntAchs]);

  const refreshLearntAchs = async () => {
    setLearntAchsLoading(true);
    try {
      const res = await axios.get('/api/learnt');
      setLearntAchs(res.data || []);
      setLearntAchsLoading(false);
    } catch (error) {
      console.error('Failed to refresh games', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Container>
      {false && (
        <MainHeader
          tabActive={tabActive}
          setTabActive={setTabActive}
          games={finalGames}
          gamesLoading={gamesLoading}
          refreshData={refreshData}
          gamesToInclude={gamesToInclude}
          setGamesToInclude={setGamesToInclude}
          learntAchs={learntAchs}
        />
      )}
      {(platinumDataLoading ||
        refeshing ||
        gamesLoading ||
        learntAchsLoading) && (
        <SpinnerContainer>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 48,
                  marginTop: '2rem',
                }}
                spin
              />
            }
          />
        </SpinnerContainer>
      )}
      {!platinumDataLoading &&
        !refeshing &&
        !gamesLoading &&
        !learntAchsLoading && (
          <MainContent
            tabActive={tabActive}
            setTabActive={setTabActive}
            games={finalGames}
            refreshData={refreshData}
            setGamesLoading={setGamesLoading}
            gamesLoading={gamesLoading}
            platinumDataLoading={platinumDataLoading}
            setLearntAchs={setLearntAchs}
            learntAchs={learntAchs}
          />
        )}
    </Container>
  );
}

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #111923;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  position: relative;
  background-color: #111923;
`;
