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
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const GAMES_INCLUDED = [
  "1659040", //Hitman 3
  "2358720", //Wukong,
  "1030300", //SilkSong,
  "750920", //Rise of Tomb Raider
  "391220", //Cyberpunk,
  "292030",
  "1629520",
  "1693980",
  "1245620",
];

export default function Main() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [tabActive, setTabActive] = useState("GAMES");
  const [gamesToInclude, setGamesToInclude] = useState([]);
  const [learntAchs, setLearntAchs] = useState([]);

  const refreshSteamGames = () => {
    setGamesLoading(true);
    try {
      axios
        .post("/api/steam", { gamesToInclude: gamesToInclude })
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
    refreshIncludedGames();
    refreshLearntAchs();
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
        ?.sort((ach1, ach2) => +ach2.percentage - +ach1?.percentage);

      let lastAch =
        sortedPlatinumTrophies?.[sortedPlatinumTrophies?.length - 1];

      let total = sortedPlatinumTrophies?.length;
      let completed = sortedPlatinumTrophies?.filter(
        (ach) => ach?.achieved == "1"
      )?.length;
      let isCompleted = total == completed;

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
              achieved: ach?.achieved == 1 || allLearnAchs?.includes() ? 1 : 0,
              achievedByLearning: isLearnt,
              unlockedAt: allAchsMap[key]?.unlockedAt ?? "",
              unlocktime: isLearnt
                ? Math.ceil(
                    new Date(allAchsMap[key]?.unlocktime).getTime() / 1000
                  )
                : ach?.unlocktime,
            };
          }),
        ],
      };

      return formedGame;
    });
    setFinalGames(finalGames);
    console.log("FINAL GAMES SET", { finalGames });
  }, [games, platinumData, learntAchs]);

  const refreshIncludedGames = async () => {
    try {
      const res = await axios.get("/api/include/include");
      setGamesToInclude(res.data[0]?.games || []);
    } catch (error) {
      console.error("Failed to refresh games", error);
    }
  };

  const refreshLearntAchs = async () => {
    try {
      const res = await axios.get("/api/learnt");
      setLearntAchs(res.data || []);
    } catch (error) {
      console.error("Failed to refresh games", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Container>
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
      {(platinumDataLoading || refeshing || gamesLoading) && (
        <SpinnerContainer>
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
        </SpinnerContainer>
      )}
      {!platinumDataLoading && !refeshing && !gamesLoading && (
        <MainContent
          tabActive={tabActive}
          setTabActive={setTabActive}
          games={finalGames}
          refreshData={refreshData}
          setGamesLoading={setGamesLoading}
          gamesLoading={gamesLoading}
          platinumDataLoading={platinumDataLoading}
          gamesToInclude={gamesToInclude}
          setGamesToInclude={setGamesToInclude}
          setLearntAchs={setLearntAchs}
          learntAchs={learntAchs}
          refreshIncludedGames={refreshIncludedGames}
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
  min-height: 80vh;
`;

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
  color: #fefefe;
  position: relative;
  background-color: #111923;
`;
