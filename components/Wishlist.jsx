import { LoadingOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Dropdown,
  message,
  Popconfirm,
  Popover,
  Progress,
  Rate,
  Space,
  Spin,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete, MdVideogameAsset } from "react-icons/md";
import styled from "styled-components";
import { GAME_COLORS, ICON_COLORS } from "./helpers/iconHelper";
import { HiFolder, HiOutlineDotsVertical } from "react-icons/hi";
import {
  itemsGameCompleted,
  itemsGamePlatform,
  itemsType,
} from "./moneytracker/EntryGame";
import { FaCaretDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "./helpers/stringHelper";
import { timeAgoFromZulu } from "./helpers/dateHelper";
import {
  generateDarkTextColorForLightBg,
  stringToColor,
} from "./helpers/colorHelper";
import GamesTrophies from "./GamesTrophies";
import MoneySaved from "./MoneySaved";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGamesForIds, selectGame } from "../store/gameSlice";
import { FETCH_ALL_ACHIEVEMENTS_SCHEMA } from "./helpers/urlHelper";

export const MAPPING_ORDER = {
  0: "PLATFORM",
  1: "GENRE",
  2: "NAME",
  3: "RATING",
  4: "COMPLETED",
  5: "RELEASE",
  6: "SAVED",
  7: "IMAGE",
};

export default function Wishlist({
  forceRefreshGame,
  activeTabGame,
  filterOption,
  setActiveTabGame,
  setActiveTab,
  setForceRefreshGame,
  excelGames,
  loading,
}) {
  const dispatch = useDispatch();
  const [newValues, setNewValues] = useState({});
  const { habittracker } = useSelector((state) => state);
  const { steamGames, selectedGameId } = habittracker;
  const [completed, setCompleted] = useState({});
  const [completedLoading, setCompletedLoading] = useState(false);

  let itemsToTarget = itemsType;

  const handleMenuClick = (e) => {
    setNewValues((old) => ({ ...old, category: String(e.key) }));
  };

  const handleMenuClickType = (e) => {
    setNewValues((old) => ({ ...old, type: String(e.key) }));
  };

  const handleGamePlatformChange = (e) => {
    setNewValues((old) => ({ ...old, platform: String(e.key) }));
  };
  const handleGameCompletedChange = (e) => {
    setNewValues((old) => ({ ...old, completed: String(e.key) }));
  };

  const menu = {
    items: itemsToTarget,
    onClick: handleMenuClick,
  };

  const menuType = {
    items: itemsType,
    onClick: handleMenuClickType,
  };

  const menuGamePlatform = {
    items: itemsGamePlatform,
    onClick: handleGamePlatformChange,
  };

  const menuGameCompleted = {
    items: itemsGameCompleted,
    onClick: handleGameCompletedChange,
  };

  const updateGameValue = () => {
    let values = { ...newValues };
    axios
      .put(`/api/game/${newValues?._id}`, { ...values })
      .then((response) => {
        message.info("Game updated !");
        refreshGames();
      })
      .catch((error) => {
        message.error("Error while saving Game !");
      });
  };

  let gamesToShow = [];
  let games = excelGames;

  let ratingToFilter = filterOption?.rating ?? "0";

  if (activeTabGame == 0) {
    gamesToShow = games?.filter((game) => {
      return game?.COMPLETED == "INPROG";
    });
  } else if (activeTabGame == 1) {
    gamesToShow = games?.filter((game) => {
      return game?.COMPLETED == "DONE";
    });
  } else if (activeTabGame == 2) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == 5 && game?.COMPLETED == "NEW";
      })
      ?.sort((g1, g2) => g2?.RATING - g1?.RATING);
  } else if (activeTabGame == 3) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == 4 && game?.COMPLETED == "NEW";
      })
      ?.sort((g1, g2) => g2?.RATING - g1?.RATING);
  } else if (activeTabGame == 4) {
    gamesToShow = games?.filter((game) => {
      return game?.COMPLETED == "REPLAY";
    });
  }

  useEffect(() => {
    let validGameIds = [];
    games?.map((game) => {
      if (game?.gameId) {
        validGameIds?.push(game?.gameId);
      }
    });
    dispatch(fetchAllGamesForIds(validGameIds));
  }, []);

  const getAllCompleted = async (games) => {
    setCompletedLoading(true);
    let allCompleted = {};
    let allGameIds = games?.map((game) => game?.gameId);
    await Promise.all(
      allGameIds?.map(async (game) => {
        const completedForGame = await axios.get(
          `/api/achievement?gameId=${game}`
        );
        const gameData = completedForGame.data;
        allCompleted[game] = gameData?.achievements;
      })
    );
    setCompletedLoading(false);
    setCompleted(allCompleted);
  };

  useEffect(() => {
    getAllCompleted(gamesToShow);
  }, [activeTabGame]);

  if (loading) {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  } else
    return (
      <Container>
        <TotalContainer>
          <GamesTrophies
            games={games}
            activeTabGame={activeTabGame}
            setActiveTabGame={setActiveTabGame}
          />
        </TotalContainer>
        <OtherContainer>
          {gamesToShow?.length == 0 && <NoGames>No Results for Filter</NoGames>}
          {gamesToShow?.length > 0 &&
            gamesToShow?.map((game) => {
              let gameInSteam = steamGames?.find(
                (gameInner) => game?.gameId == gameInner?.id
              );
              console.log({ gameInSteam, game });
              let completedForGame = completed?.[game?.gameId] ?? [];

              let total = gameInSteam?.achievements?.length ?? 0;
              let completedCount =
                gameInSteam?.achievements?.reduce((acc, ach) => {
                  if (completedForGame?.includes(ach?.name)) {
                    return acc + 1;
                  } else {
                    return acc;
                  }
                }, 0) ?? 0;

              let completion = 0;

              if (completedCount == 0) {
                completion = 0;
              } else {
                completion = ((completedCount / total) * 100).toFixed(0);
              }

              console.log({
                completedForGame,
                gameInSteam,
                completed,
                selectedGameId: game?.gameId,
              });

              return (
                <GameContainer
                  onClick={() => {
                    dispatch(selectGame(game?.gameId));
                    setActiveTab(1);
                  }}
                >
                  <TopGame>
                    <Icon color={stringToColor(game?.NAME)} image={game?.IMAGE}>
                      <Genre
                        color={GAME_COLORS[game?.PLATFORM ?? "None"]}
                        onClick={() => {
                          setNewValues(game);
                        }}
                      >
                        {game?.PLATFORM?.toUpperCase() ?? "NONE"}
                      </Genre>
                      <Price
                        color={
                          Number(game?.SAVED ?? 0) <= 0
                            ? GAME_COLORS?.["GREEN"]
                            : GAME_COLORS?.["RED"]
                        }
                      >
                        {Math.abs(Number(game?.SAVED ?? 0))} Rs
                      </Price>
                    </Icon>
                    <Title>
                      <MainTitle>{game?.NAME}</MainTitle>
                      <MainGenre>
                        {game?.GENRE} - {timeAgoFromZulu(game?.RELEASE)}
                      </MainGenre>
                      <RateContainer>
                        <Rate
                          value={game?.RATING}
                          style={{ fontSize: ".75rem" }}
                        />
                        <MainStatus
                          color={GAME_COLORS[game?.COMPLETED ?? "NEW"]}
                        >
                          {game?.COMPLETED?.toUpperCase() ?? "NEW"}
                        </MainStatus>
                      </RateContainer>
                    </Title>
                  </TopGame>
                  <BottomGame>
                    <Progress
                      percent={completion}
                      percentPosition={{ align: "center", type: "inner" }}
                      size={["100%", 20]}
                      status={completedLoading ? "active" : ""}
                    />
                  </BottomGame>
                </GameContainer>
              );
            })}
        </OtherContainer>
        <MoneyContainer>
          <MoneySaved games={games} />
        </MoneyContainer>
      </Container>
    );
}

const TopGame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BottomGame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
`;

const RateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem 0rem;
  width: 100%;
  position: relative;
`;

const OptionInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const Options2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem 1rem 1rem 1rem;
`;

const RightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const RightBottom = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 60px;
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  width: 100%;
`;

const NoGames = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 70px;
  font-size: 1.5rem;
  margin-right: 1rem;
  background: ${(props) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  color: ${(props) => props.color};
  position: relative;
`;

const Delete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0.5rem;
  bottom: 1rem;

  &:active {
    color: #fe6662;
  }
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 0.9rem;
`;

const MainGenre = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 0.25rem;
  opacity: 0.5;
  font-size: 0.8rem;
`;

const MainStatus = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: ${(props) => props.color};
`;

const Genre = styled.div`
  position: absolute;
  left: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${(props) => (props.color ? props.color : "#3c4247")};
  color: ${(props) => "#000"};
  padding: 0.25rem 0.5rem;
  margin-right: 1rem;
  font-size: 0.6rem;
`;

const Price = styled.div`
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${(props) => (props.color ? props.color : "#3c4247")};
  color: ${(props) => "#000"};
  padding: 0.25rem 0.5rem;
  font-size: 0.6rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const TotalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.25rem 0.25rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
`;

const MoneyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 0.25rem 2rem 0.25rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
`;

const OtherContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem 0.25rem;
  border-radius: 0.5rem;
  min-height: 61vh;
  max-height: 61vh;
  overflow: scroll;
  flex-direction: column;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem 0.25rem;
  background-color: #1f2125;
  flex-direction: column;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 80vh;
  max-height: 80vh;
`;

const Picker1 = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  justify-content: flex-start;
`;

const Picker2 = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  justify-content: flex-end;
`;

const MonthSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem 0rem 0rem 0rem;
`;

const Caret = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
`;

const AddAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 100%;
  flex-direction: column;
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  background-color: #2a7af1;
  margin: 1rem 0rem;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  min-width: 100%;

  &:active {
    transform: translate(-1px, 2px);
  }
`;

const Rupees = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex: 1;
  top: 42%;
  left: 1rem;
  font-size: 0.9rem;
  color: #acaeb2;
`;

const AmountInputDropdown = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  font-size: 0.9rem;
  position: relative;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  & input {
    background-color: #1f2125;
    color: #fefefe;
    border: none;
    outline: none;
  }
`;

const AmountInputDropdown2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  font-size: 1.1rem;
  position: relative;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const AmountInputDropdownPeriod = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  font-size: 0.9rem;
  position: relative;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const AmountInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 100%;
  position: relative;

  & input {
    min-width: 100%;
    margin-bottom: 0.5rem;
    margin-top: 0.75rem;
    background-color: #1f2125;
    color: #fefefe;
    border: none;
    font-size: 0.9rem;
    padding: 0.5rem 0.5rem 0.5rem 3rem;
    outline: none;
  }
`;

const TitleMain = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  width: 100%;
`;
const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

const EntryForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 50%;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;
