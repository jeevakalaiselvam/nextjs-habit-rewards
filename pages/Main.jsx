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
import { COMPLETION_TARGET_PERCENT } from "../helpers/trophyHelper";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const GAMES_INCLUDED = [];

export default function Atom() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [tabActive, setTabActive] = useState("GAMES");
  const [gamesToInclude, setGamesToInclude] = useState([]);

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

      console.log("JEEVA", { platinumMapper });

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
      let isCompleted =
        total > 0 && completed / total >= COMPLETION_TARGET_PERCENT / 100;

      formedGame = {
        ...game,
        ...platinumGameData,
        achievements: lastAch
          ? [
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
            ]
          : [],
      };

      return formedGame;
    });
    setFinalGames(finalGames);
  }, [games, platinumData]);

  const refreshIncludedGames = async () => {
    try {
      const res = await axios.get("/api/include/include");
      setGamesToInclude(res.data[0]?.games || []); // assuming games stored in one document
    } catch (error) {
      console.error("Failed to refresh games", error);
    }
  };

  useEffect(() => {
    refreshIncludedGames();
  }, []);

  if (refeshing) {
    <Container>
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 48,
              marginTop: "2rem",
            }}
            spin
          />
        }
      />
    </Container>;
  } else {
    return (
      <Container>
        <MainHeader
          tabActive={tabActive}
          setTabActive={setTabActive}
          games={finalGames}
          gamesLoading={gamesLoading}
          refreshData={refreshData}
          gamesToInclude={gamesToInclude}
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
          gamesToInclude={gamesToInclude}
          setGamesToInclude={setGamesToInclude}
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
}

const RefreshButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  background: #336291;
  border: 1px solid #2a5278;
  color: #fff;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  z-index: 100;
  font-size: 0.8rem;
  gap: 0.35rem;
  font-family: 'Nunito', sans-serif;

  &:hover { background: #3d74ab; }
  &:active { transform: translateY(1px); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #ebebeb;
  color: #333;
  position: relative;
`;
