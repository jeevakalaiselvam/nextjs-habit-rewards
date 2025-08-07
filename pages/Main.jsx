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
import CreateAchForm from "../components/CreateAchForm";

export default function Atom() {
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);
  const [finalGames, setFinalGames] = useState([]);
  const [selectedMode, setSelectedMode] = useState("GAMES");
  const [showCreateModal, setShowCreatModal] = useState(false);

  const refreshSteamGames = () => {
    setGamesLoading(true);
    try {
      axios.get("/api/jeevaachievement").then((response) => {
        setGames(response?.data ?? []);
        setGamesLoading(false);
      });
    } catch (e) {
      setGamesLoading(false);
    }
  };

  const refreshData = () => {
    refreshSteamGames();
  };

  useEffect(() => {
    if (games?.length == 0) {
      refreshData();
    }
  }, []);

  return (
    <Container>
      <MainHeader
        games={games}
        setSelectedMode={setSelectedMode}
        refreshData={refreshData}
        gamesLoading={gamesLoading}
        showCreateModal={showCreateModal}
        setShowCreatModal={setShowCreatModal}
      />
      {showCreateModal && (
        <CreateAchForm
          refreshData={refreshData}
          showCreateModal={showCreateModal}
          setShowCreatModal={setShowCreatModal}
        />
      )}
      <MainContent
        games={games}
        selectedMode={selectedMode}
        refreshData={refreshData}
        setGamesLoading={setGamesLoading}
        gamesLoading={gamesLoading}
        setSelectedMode={setSelectedMode}
        platinumDataLoading={platinumDataLoading}
        showCreateModal={showCreateModal}
        setShowCreatModal={setShowCreatModal}
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
