import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, message, Rate, Space } from "antd";
import { useState } from "react";
import { BiSolidMoviePlay } from "react-icons/bi";
import {
  FaCaretDown,
  FaFemale,
  FaGamepad,
  FaGlobe,
  FaMale,
  FaMoneyBillAlt,
  FaShoppingCart,
  FaSteam,
  FaWallet,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoFastFood, IoWallet, IoWalletSharp } from "react-icons/io5";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { RiDeviceFill } from "react-icons/ri";
import { TbBrandElectronicArts, TbDeviceDesktopFilled } from "react-icons/tb";
import axios from "axios";
import {
  MdFamilyRestroom,
  MdLocalGroceryStore,
  MdOutlineElectricalServices,
  MdVideogameAsset,
} from "react-icons/md";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { HiMiniHome } from "react-icons/hi2";
import {
  GAME_COLORS,
  GROCERY_OPTIONS,
  ICON_CATEGORY,
  ICON_COLORS,
  WALLET_OPTIONS,
} from "../helpers/iconHelper";
import dayjs from "dayjs";
import {
  getFifteenth,
  getFirstDateOfCurrentMonth,
} from "../helpers/dateHelper";
import { HiFolder } from "react-icons/hi";

export const itemsType = [
  {
    key: "11",
    label: <div style={{ width: "100%" }}>All Genres</div>,
    disabled: true,
  },
  {
    key: "Action",
    label: "Action",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Action"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘A",
  },
  {
    key: "Adventure",
    label: "Adventure",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Adventure"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘A",
  },
  {
    key: "RPG",
    label: "RPG",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["RPG"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘R",
  },
  {
    key: "FPS",
    label: "FPS",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["FPS"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘F",
  },
  {
    key: "Strategy",
    label: "Strategy",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Strategy"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Stealth",
    label: "Stealth",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Stealth"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Simulation",
    label: "Simulation",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Simulation"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Horror",
    label: "Horror",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Horror"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘H",
  },
  {
    key: "Platformer",
    label: "Platformer",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Platformer"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘P",
  },
  {
    key: "Puzzle",
    label: "Puzzle",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Puzzle"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘P",
  },
  {
    key: "Open World",
    label: "Open World",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Open World"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘O",
  },
  {
    key: "Soul Like",
    label: "Soul Like",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Soul Like"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Card Game",
    label: "Card Game",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: ICON_COLORS["Card Game"],
        }}
      >
        {<HiFolder />}
      </span>
    ),
    extra: "⌘C",
  },
];

export const itemsGamePlatform = [
  {
    key: "11",
    label: <div style={{ width: "100%" }}>All Types</div>,
    disabled: true,
  },
  {
    key: "Unassigned",
    label: "Unassigned",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Unassigned"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘U",
  },
  {
    key: "Steam",
    label: "Steam",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Steam"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘S",
  },
  {
    key: "Game Pass",
    label: "Game Pass",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Game Pass"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "Ubisoft",
    label: "Ubisoft",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Ubisoft"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘M",
  },
  {
    key: "EA",
    label: "EA",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["EA"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘E",
  },
  {
    key: "Epic",
    label: "Epic",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Epic"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘E",
  },
];

export const itemsGameCompleted = [
  {
    key: "11",
    label: <div style={{ width: "100%" }}>Game Status</div>,
    disabled: true,
  },
  {
    key: "New",
    label: "New",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["New"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘N",
  },
  {
    key: "In Progress",
    label: "In Progress",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["In Progress"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘I",
  },
  {
    key: "Completed",
    label: "Completed",
    icon: (
      <span
        style={{
          transform: "translateY(2px)",
          color: GAME_COLORS["Completed"],
        }}
      >
        {<MdVideogameAsset />}
      </span>
    ),
    extra: "⌘C",
  },
];

export default function EntryGame({ setShowEntry, refreshGame, selectedDate }) {
  const [values, setValues] = useState({
    amount: "0",
    platform: "None",
    date: getFifteenth(selectedDate),
    category: "Action",
    type: "",
    startDate: getFirstDateOfCurrentMonth(),
    endDate: getFirstDateOfCurrentMonth(),
    rating: 0,
    completed: "New",
  });

  const saveGame = () => {
    axios
      .post("/api/game", { ...values })
      .then((response) => {
        message.info("Game saved !");
        setShowEntry(false);
        refreshGame();
      })
      .catch((error) => {
        console.error(error);
        if (error) {
          message.error("Error while saving Game !");
        }
      });
  };

  let itemsToTarget = itemsType;

  const handleMenuClick = (e) => {
    setValues((old) => ({ ...old, category: String(e.key) }));
  };

  const handleMenuClickType = (e) => {
    setValues((old) => ({ ...old, type: String(e.key) }));
  };

  const handleGamePlatformChange = (e) => {
    setValues((old) => ({ ...old, platform: String(e.key) }));
  };

  const handleGameCompletedChange = (e) => {
    setValues((old) => ({ ...old, completed: String(e.key) }));
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

  return (
    <Container>
      <EntryForm>
        <FormContainer>
          <AddAmount>
            <TitleMain>New Game</TitleMain>
            <AmountInputDropdown2>
              <Dropdown
                trigger={["click"]}
                overlayStyle={{ minWidth: "80%" }}
                menu={menuGamePlatform}
                overlayClassName="full-width-dropdown"
              >
                <Space>
                  <span style={{ fontSize: ".9rem", color: "#ACAEB2" }}>
                    {values?.platform
                      ? capitalizeFirstLetter(values?.platform)
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
                  <span style={{ fontSize: ".9rem", color: "#ACAEB2" }}>
                    {values?.category
                      ? capitalizeFirstLetter(values?.category)
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
                  <span style={{ fontSize: ".9rem", color: "#ACAEB2" }}>
                    {values?.completed
                      ? capitalizeFirstLetter(values?.completed)
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
                value={values?.amount}
                onChange={(e) => {
                  setValues((old) => ({
                    ...old,
                    amount: String(e.target.value),
                  }));
                }}
              />
            </AmountInput>
            <AmountInputDropdown>
              <input
                type="text"
                value={values?.title}
                onChange={(e) => {
                  setValues((old) => ({
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
                value={dayjs(values?.date)}
                picker="date"
                onChange={(e) => {
                  setValues((old) => ({ ...old, date: dayjs(e) }));
                }}
                onFocus={(e) => e.preventDefault()}
              />
            </MonthSelection>
            <RatingItem>
              <Rate
                onChange={(e) => {
                  setValues((old) => ({
                    ...old,
                    rating: String(e),
                  }));
                }}
              />
            </RatingItem>
            <SaveButton onClick={() => saveGame()}>Save Game</SaveButton>
          </AddAmount>
        </FormContainer>
      </EntryForm>
    </Container>
  );
}

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
    width: 100%;
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

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-size: 0.9rem;
  width: 100%;
`;

const RatingName = styled.div`
  display: flex;
  opacity: 0.5;
  align-items: center;
  justify-content: flex-start;
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #1f2125;
  padding: 0.5rem 1rem;
  width: 100%;
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

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
