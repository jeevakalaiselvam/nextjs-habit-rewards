import styled from "styled-components";
import Welcome from "../components/moneytracker/Welcome";
import {
  HiArrowsExpand,
  HiChartBar,
  HiChartPie,
  HiCheckCircle,
  HiClipboard,
  HiClipboardCheck,
  HiClipboardCopy,
  HiClipboardList,
  HiClock,
  HiCurrencyRupee,
  HiDocument,
  HiDocumentAdd,
  HiDocumentDownload,
  HiDocumentRemove,
  HiDocumentReport,
  HiDocumentSearch,
  HiDocumentText,
  HiDotsVertical,
  HiFolderAdd,
  HiLibrary,
  HiLockClosed,
  HiMailOpen,
  HiPlay,
  HiPlus,
  HiPresentationChartLine,
  HiRefresh,
  HiShieldCheck,
  HiSparkles,
  HiUserCircle,
  HiViewBoards,
  HiViewList,
} from "react-icons/hi";
import { SlRefresh } from "react-icons/sl";
import { useEffect, useState } from "react";
import Money from "../components/moneytracker/Money";
import Salary from "../components/moneytracker/Salary";
import Entry from "../components/moneytracker/Entry";
import { IoIosCloseCircle } from "react-icons/io";
import Spending from "../components/moneytracker/Spending";
import Wallets from "../components/moneytracker/Wallets";
import { getFirstDateOfCurrentMonth } from "../components/helpers/dateHelper";
import { BiSolidWalletAlt } from "react-icons/bi";
import { FaCheckCircle, FaGamepad, FaTrophy } from "react-icons/fa";
import { Button, DatePicker, Popover, Select } from "antd";
import dayjs from "dayjs";
import WalletEMI from "../components/moneytracker/WalletEMI";
import { MdAccessTimeFilled, MdGames, MdVideogameAsset } from "react-icons/md";
import Wishlist from "../components/Wishlist";
import EntryGame from "../components/moneytracker/EntryGame";
import {
  GAME_RATING_OPTIONS,
  MULTI_OPTIONS,
} from "../components/helpers/constantHelper";
import Games from "../components/Games";
import Achievements from "../components/Achievements";
import { useDispatch, useSelector } from "react-redux";
import { RiRefreshLine } from "react-icons/ri";
import { fetchAllGames, refreshGameSingle } from "../store/gameSlice";
import { TbRefreshDot } from "react-icons/tb";
import { HiTrophy } from "react-icons/hi2";
import {
  GAME_UNLOCK_TYPE_ALL,
  getaUnlockedAchievementsByType,
} from "../components/helpers/gameHelper";
import AchievementsIcons from "../components/AchievementsIcons";
import { IoGameControllerSharp } from "react-icons/io5";
import AchievementsGameIcons from "../components/AchievementsGameIcons";

const defaultFilter = { rating: "0" };

export default function MoneyTracker() {
  const dispatch = useDispatch();
  const [activeMode, setActiveMode] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabGame, setActiveTabGame] = useState(0);
  const [showEntry, setShowEntry] = useState(false);
  const [forceRefreshExpense, setForceRefreshExpense] = useState(false);
  const [forceRefreshGame, setForceRefreshGame] = useState(false);
  const [date, setDate] = useState(getFirstDateOfCurrentMonth());
  const [filterOption, setFilterOption] = useState(defaultFilter);
  const [open, setOpen] = useState(false);

  const { habittracker } = useSelector((state) => state);
  const { games, selectedGameId } = habittracker;
  const game = games?.find((game) => game?.id == selectedGameId);

  let title = "";
  let lowFont = false;

  if (activeTab == 0 && activeMode == 0) {
    title = "Income";
  }

  if (activeTab == 1 && activeMode == 0) {
    title = "Expense";
  }

  if (activeTab == 2 && activeMode == 0) {
    title = "Salaries";
  }

  if (activeTab == 3 && activeMode == 0) {
    title = "Wallets";
  }

  if (activeTabGame == 0 && activeMode == 1) {
    title = "New Games";
  }

  if (activeTabGame == 1 && activeMode == 1) {
    title = "In Progress";
  }

  if (activeTabGame == 2 && activeMode == 1) {
    title = "Replay";
  }

  if (activeTabGame == 3 && activeMode == 1) {
    title = "Tried";
  }

  if (activeTabGame == 4 && activeMode == 1) {
    title = "Completed";
  }

  if (activeTabGame == 5 && activeMode == 1) {
    title = "All Games";
  }

  if (activeMode == 1 && activeTab == 0) {
    let achSorted = getaUnlockedAchievementsByType(games, GAME_UNLOCK_TYPE_ALL);
    title = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "1rem",
            color: "#3BD987",
          }}
        >
          <div
            style={{
              transform: "translateY(2px)",
              fontSize: "1.5rem",
            }}
          >
            <IoGameControllerSharp />
          </div>
          <div style={{ marginLeft: ".25rem", fontSize: "1.35rem" }}>
            {games?.length}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#66c0f4",
          }}
        >
          <div style={{ transform: "translateY(1px)" }}>
            <FaTrophy />
          </div>
          <div style={{ marginLeft: ".25rem", fontSize: "1.35rem" }}>
            {achSorted?.length}
          </div>
        </div>
      </div>
    );
    lowFont = true;
  }

  if (activeMode == 1 && activeTab == 1) {
    title = game?.name;
    lowFont = true;
  }

  if (activeMode == 1 && (activeTab == 2 || activeTab == 3)) {
    let achSorted = getaUnlockedAchievementsByType(games, GAME_UNLOCK_TYPE_ALL);
    title = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#66c0f4",
        }}
      >
        <div style={{ transform: "translateY(1px)" }}>
          <FaTrophy />
        </div>
        <div style={{ marginLeft: ".25rem", fontSize: "1.35rem" }}>
          {achSorted?.length}
        </div>
      </div>
    );
    lowFont = true;
  }

  const refreshExpense = () => {
    setForceRefreshExpense(true);
  };

  const refreshGame = () => {
    setForceRefreshGame(true);
  };

  const saveFilterInStorage = () => {
    console.log(filterOption);
    if (window) {
      localStorage.setItem("PREFERENCE", JSON.stringify(filterOption));
    }
  };

  useEffect(() => {
    // saveFilterInStorage();
  }, [filterOption]);

  useEffect(() => {
    if (window) {
      setFilterOption(localStorage.getItem("PREFERENCE") ?? defaultFilter);
    }
  }, []);

  return (
    <Container>
      {showEntry && (activeTab == 1 || activeTab == 0) && activeMode == 0 && (
        <EntryModal>
          <Entry
            setShowEntry={setShowEntry}
            refreshExpense={refreshExpense}
            selectedDate={date}
          />
        </EntryModal>
      )}
      {showEntry && activeTab == 3 && (
        <WalletEMIModal>
          <WalletEMI />
        </WalletEMIModal>
      )}
      {showEntry && activeMode == 1 && (
        <EntryModal>
          <EntryGame
            setShowEntry={setShowEntry}
            refreshGame={refreshGame}
            selectedDate={date}
          />
        </EntryModal>
      )}
      <Header>
        <Name lowFont={lowFont}>{title}</Name>
        {activeMode == 0 && (
          <Picker>
            <DatePicker
              allowClear={false}
              style={{
                width: "70%",
                backgroundColor: "#1f2125",
                outline: "none",
                border: "none",
              }}
              defaultValue={dayjs(date)}
              format="MMMM, YYYY"
              value={dayjs(date)}
              picker="month"
              onChange={(e) => {
                setDate(dayjs(e));
              }}
            />
          </Picker>
        )}
        {activeMode == 0 && (
          <ModeIcon onClick={() => setActiveMode(1)}>
            <FaGamepad />
          </ModeIcon>
        )}
        {activeMode == 1 && (
          <ModeIcon onClick={() => setActiveMode(0)}>
            <HiClipboardCheck />
          </ModeIcon>
        )}
        {activeMode == 1 && activeTab == 0 && (
          <ModeIcon1
            onClick={() => {
              dispatch(fetchAllGames());
            }}
          >
            <TbRefreshDot />
          </ModeIcon1>
        )}
        {activeMode == 1 && activeTab == 1 && (
          <ModeIcon1
            onClick={() => {
              dispatch(refreshGameSingle(selectedGameId));
            }}
          >
            <TbRefreshDot />
          </ModeIcon1>
        )}
      </Header>
      {activeMode == 1 && (
        <>
          <Content showEntry={showEntry}>
            {activeTab == 0 && (
              <Games
                activeTabGame={activeTabGame}
                setActiveTab={setActiveTab}
                forceRefreshGame={forceRefreshGame}
                filterOption={filterOption}
              />
            )}
            {activeTab == 1 && (
              <Achievements
                activeTabGame={activeTabGame}
                setActiveTab={setActiveTab}
                forceRefreshGame={forceRefreshGame}
                filterOption={filterOption}
                singleGame
              />
            )}
            {activeTab == 2 && (
              <Achievements
                recent
                activeTabGame={activeTabGame}
                setActiveTab={setActiveTab}
                forceRefreshGame={forceRefreshGame}
                filterOption={filterOption}
              />
            )}
            {activeTab == 3 && (
              <AchievementsIcons
                recent
                activeTabGame={activeTabGame}
                setActiveTab={setActiveTab}
                forceRefreshGame={forceRefreshGame}
                filterOption={filterOption}
              />
            )}
          </Content>
          <Bottom>
            <Icon onClick={() => setActiveTab(3)} data-active={activeTab == 3}>
              <FaTrophy />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                PROFILE
              </span>
            </Icon>
            <Icon onClick={() => setActiveTab(2)} data-active={activeTab == 2}>
              <HiClock />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                RECENT
              </span>
            </Icon>{" "}
            <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
              <HiViewBoards />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                GAMES
              </span>
            </Icon>
            <Icon
              onClick={() => {
                if (!selectedGameId) {
                  setActiveTab(0);
                } else {
                  setActiveTab(1);
                }
              }}
              data-active={activeTab == 1}
            >
              <HiChartPie />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                ACHIEVEMENTS
              </span>
            </Icon>{" "}
          </Bottom>
        </>
      )}
      {activeMode == 0 && (
        <>
          <Content showEntry={showEntry}>
            {activeTab == 0 && (
              <Money
                showEntry={showEntry}
                selectedDate={date}
                forceRefreshExpense={forceRefreshExpense}
              />
            )}
          </Content>
          <Content>
            {activeTab == 1 && (
              <Spending
                showEntry={showEntry}
                selectedDate={date}
                forceRefreshExpense={forceRefreshExpense}
              />
            )}
          </Content>
          <Content>
            {activeTab == 2 && (
              <Salary showEntry={showEntry} selectedDate={date} />
            )}
          </Content>
          <Content>
            {activeTab == 3 && (
              <Wallets showEntry={showEntry} selectedDate={date} />
            )}
          </Content>
          <Bottom>
            <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
              <HiViewBoards />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                INCOME
              </span>
            </Icon>
            <Icon onClick={() => setActiveTab(1)} data-active={activeTab == 1}>
              <HiChartPie />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                SPENDING
              </span>
            </Icon>
            <Icon>
              <Inner
                onClick={() => {
                  setShowEntry((old) => !old);
                }}
              >
                {!showEntry && activeTab == 0 && <HiPlus />}
                {!showEntry && activeTab == 1 && <HiPlus />}
                {!showEntry && activeTab == 2 && <HiPlus />}
                {!showEntry && activeTab == 3 && <MdAccessTimeFilled />}
                {showEntry && <IoIosCloseCircle />}
              </Inner>
            </Icon>
            <Icon onClick={() => setActiveTab(2)} data-active={activeTab == 2}>
              <HiLibrary />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                SALARY
              </span>
            </Icon>
            <Icon onClick={() => setActiveTab(3)} data-active={activeTab == 3}>
              <HiViewList />{" "}
              <span
                style={{
                  fontSize: ".5rem",
                  fontWeight: 800,
                  marginTop: ".25rem",
                }}
              >
                WALLET
              </span>
            </Icon>
          </Bottom>
        </>
      )}
    </Container>
  );
}

const Apply = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4872ea;
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;

  &:active {
    transform: translate(2px, 2px);
  }
`;

const FilterOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 150px;
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  opacity: 0.7;
  align-items: center;
  justify-content: flex-start;
`;

const Option = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const ModeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 1.5rem;
  margin-left: 1rem;
  color: #52b8da;
`;

const ModeIcon1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 1.3rem;
  margin-left: 1rem;
  color: #52b8da;
`;

const Picker = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  justify-content: flex-end;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
  font-size: ${(props) => (props.lowFont ? "1.25rem" : "2rem")};
  transform: translate(-10px, -0px);
`;

const Date = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.3rem 0.3rem;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #252525;
`;

const EntryModal = styled.div`
  display: flex;
  width: 98%;
  z-index: 100;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border-radius: 0.5rem;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1b1b1d;
  border: 1px solid #395ec333;
`;

const WalletEMIModal = styled.div`
  display: flex;
  width: 95%;
  z-index: 100;
  min-height: 78vh;
  max-height: 78vh;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border-radius: 0.5rem;
  position: absolute;
  top: 5%;
  padding: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1b1b1d;
`;

const Inner = styled.div`
  display: flex;
  width: 100%;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  background-color: #4872ea;
  border-radius: 32px;
  color: #fefefe;
  transform: translateY(-2rem);
  filter: drop-shadow(0 0 10px #395ec3) drop-shadow(0 0 10px #395ec3);

  &:active {
    transform: translate(0px, -1.8rem);
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.75rem;
  flex: 1;
  color: #717f8d;
  color: ${(props) => (props?.["data-active"] ? "#52b8da" : "#717f8d")};
`;

const Header = styled.div`
  display: flex;
  min-width: 100%;
  align-items: center;
  justify-content: center;
  height: 70px;
  padding: 1rem 1rem 1rem 2rem;
  background-color: #141414;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  filter: ${(props) => (props.showEntry ? "blur(10px)" : "blur(0px)")};
`;

const Bottom = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  background-color: #0d1a28;
  justify-content: center;
  align-items: center;
  padding-bottom: 1.6rem;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  min-width: 100%;
  color: #fefefe;
  position: relative;
`;
