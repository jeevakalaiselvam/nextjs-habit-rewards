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
import { HiFolder } from "react-icons/hi";
import { itemsGamePlatform, itemsType } from "./moneytracker/EntryGame";
import { FaCaretDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "./helpers/stringHelper";
import { timeAgoFromZulu } from "./helpers/dateHelper";
import { stringToColor } from "./helpers/colorHelper";

export default function Wishlist({ forceRefreshGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newValues, setNewValues] = useState({});

  const refreshGames = () => {
    setLoading(true);
    axios.get("/api/game").then((response) => {
      setGames(response?.data);
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

  if (loading) {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  } else
    return (
      <Container>
        {games?.length == 0 && <NoGames>No Games</NoGames>}
        {games?.length > 0 &&
          games?.map((game) => {
            return (
              <GameContainer>
                <Icon color={stringToColor(game?.title)}>
                  <MdVideogameAsset />
                </Icon>
                <Title>
                  <MainTitle>{game?.title}</MainTitle>
                  <MainGenre>{game?.category}</MainGenre>
                  <MainGenre>{timeAgoFromZulu(game?.date)}</MainGenre>
                </Title>
                <Popover
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
                              style={{ fontSize: ".9rem", color: "#ACAEB2" }}
                            >
                              {newValues?.platform
                                ? capitalizeFirstLetter(newValues?.platform)
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
                              style={{ fontSize: ".9rem", color: "#ACAEB2" }}
                            >
                              {newValues?.category
                                ? capitalizeFirstLetter(newValues?.category)
                                : "Select Genre"}
                            </span>
                            <Caret>
                              <FaCaretDown />
                            </Caret>
                          </Space>
                        </Dropdown>
                      </AmountInputDropdown>
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
                            setNewValues((old) => ({ ...old, date: dayjs(e) }));
                          }}
                          onFocus={(e) => e.preventDefault()}
                        />
                      </MonthSelection>
                      <RatingItem>
                        <Rate
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
                    onClick={() => {
                      setNewValues(game);
                    }}
                  >
                    {game?.platform}
                  </Genre>
                </Popover>
                <Popconfirm
                  placement="left"
                  onConfirm={() => {
                    deleteSpending(game?._id);
                  }}
                  content={<div>DELETE</div>}
                  title={<Title>Delete Game</Title>}
                >
                  <Delete>
                    <MdDelete />
                  </Delete>
                </Popconfirm>
              </GameContainer>
            );
          })}
      </Container>
    );
}

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
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  margin-right: 1rem;
  color: ${(props) => props.color};
`;

const Delete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fe6662;
  }
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const MainGenre = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8rem;
  width: 100%;
  margin-top: 0.25rem;
  opacity: 0.5;
`;

const Genre = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #3c4247;
  padding: 0.25rem 0.5rem;
  margin-right: 1rem;
  font-size: 0.9rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #1f2125;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 60vh;
  max-height: 60vh;
  padding: 1rem;
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
  padding: 1rem 0rem 0rem 0rem;
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
  justify-content: center;
  min-width: 100%;
  flex-direction: column;
`;

const SaveButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  background-color: #2a7af1;
  margin: 1rem 1rem;
  border-radius: 8px;
  padding: 1rem 1rem;
  min-width: 95%;

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
