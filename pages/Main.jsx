import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../components/MainHeader";
import MainContent from "../components/MainContent";

export default function Atom() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);

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

      platinumGameData?.dlc1Trophies?.forEach((ach) => {
        dlcMapper[ach?.title] = { ...ach, dlc: "DLC1" };
      });
      platinumGameData?.dlc2Trophies?.forEach((ach) => {
        dlcMapper[ach?.title] = { ...ach, dlc: "DLC2" };
      });
      platinumGameData?.dlc3Trophies?.forEach((ach) => {
        dlcMapper[ach?.title] = { ...ach, dlc: "DLC3" };
      });
      platinumGameData?.dlc4Trophies?.forEach((ach) => {
        dlcMapper[ach?.title] = { ...ach, dlc: "DLC4" };
      });
      platinumGameData?.dlc5Trophies?.forEach((ach) => {
        dlcMapper[ach?.title] = { ...ach, dlc: "DLC5" };
      });

      let gameName = game?.achievements?.[0]?.gameName;

      let sortedPlatinumTrophies = game?.achievements
        ?.filter((ach) => {
          if (platinumMapper?.[ach?.displayName]) {
            return true;
          }
        })
        ?.map((ach) => {
          if (platinumMapper?.[ach?.displayName]) {
            return {
              ...ach,
              ...platinumMapper?.[ach?.displayName],
            };
          }
        })
        ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

      let sortedDLCTrophies = game?.achievements
        ?.filter((ach) => {
          if (dlcMapper?.[ach?.displayName]) {
            return true;
          }
        })
        ?.map((ach) => {
          if (dlcMapper?.[ach?.displayName]) {
            return {
              ...ach,
              ...dlcMapper?.[ach?.displayName],
            };
          }
        })
        ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

      let lastAch =
        sortedPlatinumTrophies?.[sortedPlatinumTrophies?.length - 1];

      formedGame = {
        ...game,
        ...platinumGameData,
        achievements: [
          ...sortedPlatinumTrophies,
          {
            ...lastAch,
            title: `${gameName}'s Platinum`,
            displayName: `${gameName}'s Platinum`,
            icon: "/icons/platinum.jpg",
            description: `Completed all Trophies in the game`,
            label: "Rare",
            color: "Platinum",
            achieved: 0,
          },
        ],
        dlcAchievements: [...sortedDLCTrophies],
      };

      console.log(game?.name, {
        platinumGameData,
        dlcMapper,
        sortedDLCTrophies,
        formedGame,
      });

      return formedGame;
    });
    setFinalGames(finalGames);
  }, [games, platinumData]);

  return (
    <Container>
      <MainHeader games={finalGames} />
      <MainContent
        games={finalGames}
        refreshData={refreshData}
        setGamesLoading={setGamesLoading}
        gamesLoading={gamesLoading}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  background-color: #292b2d;
  color: #fefefe;
`;
