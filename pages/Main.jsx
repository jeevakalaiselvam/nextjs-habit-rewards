import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../components/MainHeader";
import MainContent from "../components/MainContent";
import { TbRefresh } from "react-icons/tb";
import { COLOR_ACCENT } from "../helpers/colorHelper";
import {
  getColorBasedOnRarity,
  getRarityBasedOnRarity,
} from "../helpers/achHelper";
import MainContentNew from "../components/MainContentNew";
import { COMPLETION_FACTOR } from "../helpers/trophyHelper";

export default function Atom() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [selectedMode, setSelectedMode] = useState("GAMES");
  const [refeshing, setRefreshing] = useState(false);

  const refreshSteamGames = () => {
    setGamesLoading(true);
    try {
      axios.get("/api/steam").then((response) => {
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
      axios.get("/api/platinum").then((response) => {
        setPlatinumData(response?.data);
        setPlatinumDataLoading(false);
      });
    } catch (e) {
      setPlatinumDataLoading(false);
    }
  };

  const refreshData = () => {
    refreshSteamGames();
    refreshPlatinumData();
  };

  useEffect(() => {
    if (games?.length == 0) {
      refreshData();
    }
  }, []);

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

      console.log({ platinumMapper });

      let gameName = game?.achievements?.[0]?.gameName;

      let sortedPlatinumTrophies = game?.achievements
        ?.map((ach) => {
          return {
            ...ach,
            label: getRarityBasedOnRarity(ach?.percentage),
            color: getColorBasedOnRarity(ach?.percentage),
            title: ach?.displayName,
            hiddenDesc: platinumMapper[ach?.displayName]?.description,
          };
        })
        ?.filter((ach) => {
          if (platinumMapper[ach?.displayName]) {
            return true;
          } else {
            return false;
          }
        })
        ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

      let lastAch =
        sortedPlatinumTrophies?.[sortedPlatinumTrophies?.length - 1];

      let total = sortedPlatinumTrophies?.length;
      let completed = sortedPlatinumTrophies?.filter(
        (ach) => ach?.achieved == "1"
      )?.length;
      let isCompleted = completed > Math.ceil(total * COMPLETION_FACTOR);

      formedGame = {
        ...game,
        ...platinumGameData,
        achievements: [
          ...sortedPlatinumTrophies,
          {
            displayName: `Platinum`,
            description: `Achieved Completion in the game`,
            hiddenDesc: `${game?.name}`,
            percentage: lastAch?.percentage,
            label: getRarityBasedOnRarity(lastAch?.percentage),
            color: "Platinum",
            achieved: isCompleted ? 1 : 0,
            unlocktime: lastAch?.unlocktime,
            icon: "https://pbs.twimg.com/media/GF8EZJZWQAAwDR7.jpg",
          },
        ],
      };

      return formedGame;
    });
    setFinalGames(finalGames);
  }, [games, platinumData]);

  return (
    <Container>
      <MainHeader
        games={finalGames}
        setSelectedMode={setSelectedMode}
        refreshData={refreshData}
        gamesLoading={gamesLoading}
      />
      <MainContent
        games={finalGames}
        selectedMode={selectedMode}
        refreshData={refreshData}
        setGamesLoading={setGamesLoading}
        gamesLoading={gamesLoading}
        setSelectedMode={setSelectedMode}
        platinumDataLoading={platinumDataLoading}
      />
    </Container>
  );
}

const RefreshButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: fixed;
  right: 1rem;
  top: 1rem;
  background-color: #1b2838;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  z-index: 100;

  &:active {
    transform: translateY(0.25rem);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  background-color: #1b2838;
  color: #fefefe;
  position: relative;
`;
