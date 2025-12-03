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

const GAMES_INCLUDED = [];

export default function Atom() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [tabActive, setTabActive] = useState("GAMES");

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
    setRefreshing(false);
  };

  useEffect(() => {
    if (games?.length == 0) {
      refreshData();
    }
  }, []);

  useEffect(() => {
    let finalGames = [];

    console.log("JEEVA", { platinumData });

    finalGames = games?.map((game) => {
      let platinumGameData = platinumData?.find(
        (item) => +item?.id == +game?.id
      );
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
      let isCompleted = total == completed;

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
            description: `Achieved all Trophies in game`,
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
        tabActive={tabActive}
        setTabActive={setTabActive}
        games={finalGames}
        gamesLoading={gamesLoading}
        refreshData={refreshData}
      />
      <MainContent
        GAMES_INCLUDED={GAMES_INCLUDED}
        tabActive={tabActive}
        setTabActive={setTabActive}
        games={finalGames}
        refreshData={refreshData}
        setGamesLoading={setGamesLoading}
        gamesLoading={gamesLoading}
        platinumDataLoading={platinumDataLoading}
      />
      <RefreshButton
        onClick={() => {
          setRefreshing(true);
          if (window) {
            refreshData();
          }
        }}
      >
        <span style={{ transform: "translateY(2px)", marginRight: ".5rem" }}>
          <TbRefresh />
        </span>
        <span>{refeshing ? "Refreshing..." : "Refresh"}</span>
      </RefreshButton>
    </Container>
  );
}

const RefreshButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: fixed;
  right: 2rem;
  bottom: 1rem;
  background-color: ${COLOR_ACCENT};
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
  background-color: #292b2d;
  color: #fefefe;
  position: relative;
`;
