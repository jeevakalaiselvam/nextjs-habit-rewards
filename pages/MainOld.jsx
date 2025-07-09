import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLUE_DARK,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { TbPlus, TbQrcode, TbRefresh } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import GameCdImage from "../components/GameCdImage";
import GAMES from "../GAMES_MOCK.json";
import { TbPaintFilled } from "react-icons/tb";
import EditGameForm from "../components/EditGameForm";
import { TbEdit } from "react-icons/tb";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import LevelInformation from "../components/LevelInformation";

const TAB_GAMES = "TAB_GAMES";
const TAB_COVER_ART = "TAB_COVER_ART";

export default function Atom() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [platinumDataLoading, setPlatinumDataLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [platinumData, setPlatinumData] = useState([]);

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

  useEffect(() => {
    if (games?.length == 0) {
      refreshSteamGames();
      refreshPlatinumData();
    }
  }, []);

  return (
    <Container>
      <Right>
        <RTop>
          <RTopLeft>
            <PSIcon></PSIcon>
            <PSName>ObsidianLogan</PSName>
          </RTopLeft>
          <RTopMiddle>
            <LevelInformation games={games} platinumData={platinumData} />
          </RTopMiddle>
          <RTopRight>
            <EditButton
              onClick={() => {
                refreshSteamGames();
                refreshPlatinumData();
              }}
            >
              <span style={{ transform: "translateY(2px)" }}>
                <TbRefresh />
              </span>
              <span style={{ marginLeft: ".25rem" }}>Refresh</span>
            </EditButton>
            <EditButton
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              <span style={{ transform: "translateY(2px)" }}>
                <TbEdit />
              </span>
              <span style={{ marginLeft: ".25rem" }}>Edit</span>
            </EditButton>
          </RTopRight>
        </RTop>
        <RBottom>
          {(!gamesLoading || !platinumDataLoading) &&
            selectedTab == TAB_GAMES && (
              <GamesContainer>
                {games?.map((game) => {
                  return (
                    <GameCdImage
                      game={game}
                      platinumData={platinumData}
                      editMode={isEditMode}
                      setIsEditMode={setIsEditMode}
                    />
                  );
                })}
              </GamesContainer>
            )}
          {(platinumDataLoading || gamesLoading) && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          )}
        </RBottom>
      </Right>
    </Container>
  );
}

const PSIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/PlayStation_App_Icon.jpg/960px-PlayStation_App_Icon.jpg");
  background-repeat: no-repeat;
  background-size: contain;
`;

const PSName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
`;

const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 1rem;

  &:hover {
    color: ${COLOR_ACCENT};
  }
`;

const GamesContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  min-height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  overflow: scroll;
  flex-wrap: wrap;
`;

const RTopLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const RTopMiddle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RTopRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const RTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  padding: 1rem;
`;

const RBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  min-height: 100vh;
  max-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  color: #fefefe;
`;
