import { LoadingOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Dropdown,
  message,
  Popconfirm,
  Popover,
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

const MAPPING_ORDER = {
  0: "PLATFORM",
  1: "GENRE",
  2: "NAME",
  3: "COMPLETED",
  4: "RELEASE",
  5: "RATING",
  6: "IMAGE",
};

export default function Wishlist({
  forceRefreshGame,
  activeTabGame,
  filterOption,
  setActiveTabGame,
}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [newValues, setNewValues] = useState({});

  const refreshGames = () => {
    setLoading(true);
    axios.get("/api/sheet").then((response) => {
      let gamesInner = response?.data?.rows?.slice(1) ?? [];
      let gamesMorphed = gamesInner?.map((singleGame) => {
        let mainGame = {};
        Object.keys(MAPPING_ORDER).forEach((index) => {
          mainGame[MAPPING_ORDER[index]] = singleGame?.[index];
        });
        return mainGame;
      });
      console.log({ gamesMorphed });
      setGames(gamesMorphed);
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshGames();
  }, [forceRefreshGame]);

  const deleteSpending = (gameId) => {
    axios
      .delete(`/api/game/${gameId}`)
      .then((response) => {
        refreshGames();
      })
      .catch((error) => {});
  };

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

  let ratingToFilter = filterOption?.rating ?? "0";

  if (activeTabGame == 0) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == ratingToFilter || ratingToFilter == "0";
      })
      ?.filter((game) => {
        return game?.COMPLETED == "INPROG";
      });
  } else if (activeTabGame == 1) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == ratingToFilter || ratingToFilter == "0";
      })
      ?.filter((game) => {
        return game?.COMPLETED == "NEW";
      })
      ?.sort((game1, game2) => game2?.RATING - game1?.RATING);
  } else if (activeTabGame == 2) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == ratingToFilter || ratingToFilter == "0";
      })
      ?.filter((game) => {
        return game?.COMPLETED == "REPLAY";
      });
  } else if (activeTabGame == 3) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == ratingToFilter || ratingToFilter == "0";
      })
      ?.filter((game) => {
        return game?.COMPLETED == "TRIED";
      });
  } else if (activeTabGame == 4) {
    gamesToShow = games
      ?.filter((game) => {
        return game?.RATING == ratingToFilter || ratingToFilter == "0";
      })
      ?.filter((game) => {
        return game?.COMPLETED == "DONE";
      });
  } else if (activeTabGame == 5) {
    gamesToShow = games;
  }

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
              return (
                <GameContainer>
                  <Icon color={stringToColor(game?.NAME)} image={game?.IMAGE}>
                    <Genre
                      color={GAME_COLORS[game?.PLATFORM ?? "None"]}
                      onClick={() => {
                        setNewValues(game);
                      }}
                    >
                      {game?.PLATFORM?.toUpperCase() ?? "NONE"}
                    </Genre>
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
                    </RateContainer>
                    <MainStatus color={GAME_COLORS[game?.COMPLETED ?? "NEW"]}>
                      {game?.COMPLETED?.toUpperCase() ?? "NEW"}
                    </MainStatus>
                  </Title>
                  <Right>
                    <RightTop>
                      {false && (
                        <Popover
                          trigger={"click"}
                          placement="left"
                          content={
                            <AddAmount>
                              <TitleMain>Edit Game</TitleMain>
                              <AmountInputDropdown2>
                                <Dropdown
                                  trigger={["click"]}
                                  overlayStyle={{ minWidth: "80%" }}
                                  menu={menuGamePlatform}
                                  overlayClassName="full-width-dropdown"
                                >
                                  <Space>
                                    <span
                                      style={{
                                        fontSize: ".9rem",
                                        color: "#ACAEB2",
                                      }}
                                    >
                                      {newValues?.platform
                                        ? capitalizeFirstLetter(
                                            newValues?.platform
                                          )
                                        : "Select Type"}
                                    </span>
                                    <Caret>
                                      <FaCaretDown />
                                    </Caret>
                                  </Space>
                                </Dropdown>
                              </AmountInputDropdown2>
                              <AmountInputDropdown>
                                <Dropdown
                                  trigger={["click"]}
                                  overlayStyle={{ minWidth: "80%" }}
                                  menu={menu}
                                  overlayClassName="full-width-dropdown"
                                  on
                                >
                                  <Space>
                                    <span
                                      style={{
                                        fontSize: ".9rem",
                                        color: "#ACAEB2",
                                      }}
                                    >
                                      {newValues?.category
                                        ? capitalizeFirstLetter(
                                            newValues?.category
                                          )
                                        : "Select Genre"}
                                    </span>
                                    <Caret>
                                      <FaCaretDown />
                                    </Caret>
                                  </Space>
                                </Dropdown>
                              </AmountInputDropdown>
                              <AmountInputDropdown2>
                                <Dropdown
                                  trigger={["click"]}
                                  overlayStyle={{ minWidth: "80%" }}
                                  menu={menuGameCompleted}
                                  overlayClassName="full-width-dropdown"
                                >
                                  <Space>
                                    <span
                                      style={{
                                        fontSize: ".9rem",
                                        color: "#ACAEB2",
                                      }}
                                    >
                                      {newValues?.completed
                                        ? capitalizeFirstLetter(
                                            newValues?.completed
                                          )
                                        : "Select Type"}
                                    </span>
                                    <Caret>
                                      <FaCaretDown />
                                    </Caret>
                                  </Space>
                                </Dropdown>
                              </AmountInputDropdown2>
                              <AmountInput>
                                <Rupees>
                                  <FaIndianRupeeSign />
                                </Rupees>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={newValues?.amount}
                                  onChange={(e) => {
                                    setNewValues((old) => ({
                                      ...old,
                                      amount: String(e.target.value),
                                    }));
                                  }}
                                />
                              </AmountInput>
                              <AmountInputDropdown>
                                <input
                                  type="text"
                                  value={newValues?.title}
                                  onChange={(e) => {
                                    setNewValues((old) => ({
                                      ...old,
                                      title: String(e.target.value),
                                    }));
                                  }}
                                />
                              </AmountInputDropdown>
                              <MonthSelection>
                                <DatePicker
                                  style={{
                                    width: "100%",
                                    backgroundColor: "#1f2125",
                                    padding: "0.5rem 1rem",
                                    outline: "none",
                                    border: "none",
                                  }}
                                  format="DD-MM-YYYY"
                                  inputReadOnly
                                  value={dayjs(newValues?.date)}
                                  picker="date"
                                  onChange={(e) => {
                                    setNewValues((old) => ({
                                      ...old,
                                      date: dayjs(e),
                                    }));
                                  }}
                                  onFocus={(e) => e.preventDefault()}
                                />
                              </MonthSelection>
                              <RatingItem>
                                <Rate
                                  value={newValues?.rating}
                                  onChange={(e) => {
                                    setNewValues((old) => ({
                                      ...old,
                                      rating: String(e),
                                    }));
                                  }}
                                />
                              </RatingItem>
                              <SaveButton onClick={() => updateGameValue()}>
                                Save Game
                              </SaveButton>
                            </AddAmount>
                          }
                        >
                          <Genre
                            color={GAME_COLORS[platform ?? "None"]}
                            onClick={() => {
                              setNewValues(game);
                            }}
                          >
                            {platform?.toUpperCase() ?? "NONE"}
                          </Genre>
                        </Popover>
                      )}
                    </RightTop>
                    <RightBottom></RightBottom>
                  </Right>
                  {false && (
                    <Popconfirm
                      placement="left"
                      onConfirm={() => {
                        deleteSpending(game?._id);
                      }}
                      content={<div>DELETE</div>}
                      title={<Title>Delete Game</Title>}
                    >
                      <Delete>
                        <HiOutlineDotsVertical />
                      </Delete>
                    </Popconfirm>
                  )}
                </GameContainer>
              );
            })}
        </OtherContainer>
      </Container>
    );
}

const MainTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0.5;
  font-size: 0.8rem;
`;

const RateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem 0rem;
  width: 100%;
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

const OtherContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.25rem 0.25rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  min-height: 80vh;
  max-height: 80vh;
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
  padding: 0.5rem;
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
