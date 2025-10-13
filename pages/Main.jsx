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
import { COMPLETION_FACTOR } from "../helpers/trophyHelper";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const GAMES_INCLUDED = [
  "1659040", //Hitman 3
  "2358720", //Wukong,
  "1030300", //SilkSong,
  "750920",
  "391220",
];

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
      axios
        .post("/api/steam", { gamesToInclude: GAMES_INCLUDED })
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

      total = Math.ceil(total * COMPLETION_FACTOR);
      completed = completed > total ? total : completed;
      let isCompleted = total == completed && total != 0;

      if (platinumGameData) {
        formedGame = {
          ...game,
          ...platinumGameData,
          achievements: [
            ...sortedPlatinumTrophies?.filter(
              (ach) => ach?.displayName != lastAch?.displayName
            ),
            { ...lastAch, color: "Gold" },
            {
              displayName: `Platinum`,
              description: `Achieved all Trophies in the game`,
              hiddenDesc: `${game?.name}`,
              percentage: lastAch?.percentage,
              label: getRarityBasedOnRarity(lastAch?.percentage),
              color: "Platinum",
              achieved: isCompleted ? 1 : 0,
              completedFinal: completed,
              unlocktime: lastAch?.unlocktime,
              icon: "https://pbs.twimg.com/media/GF8EZJZWQAAwDR7.jpg",
              gameName: lastAch?.gameName,
            },
          ],
        };
      } else {
        formedGame = {
          ...game,
        };
      }

      return formedGame;
    });
    setFinalGames(finalGames);
  }, [games, platinumData]);

  if (gamesLoading || platinumDataLoading) {
    return (
      <LoadingContainer>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </LoadingContainer>
    );
  }
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
  background-color: ${COLOR_ACCENT};
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  z-index: 100;

  &:active {
    transform: translateY(0.25rem);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #1b2838;
  color: #fefefe;
  min-width: 100vw;
  min-height: 100vh;
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
