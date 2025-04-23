import styled from "styled-components";
import Welcome from "../components/moneytracker/Welcome";
import {
  HiChartBar,
  HiChartPie,
  HiCurrencyRupee,
  HiFolderAdd,
  HiLibrary,
  HiLockClosed,
  HiPlus,
  HiPresentationChartLine,
  HiShieldCheck,
  HiUserCircle,
  HiViewBoards,
  HiViewGrid,
  HiViewList,
} from "react-icons/hi";
import { useState } from "react";
import Money from "../components/moneytracker/Money";
import Salary from "../components/moneytracker/Salary";
import Entry from "../components/moneytracker/Entry";
import { IoIosCloseCircle } from "react-icons/io";
import Spending from "../components/moneytracker/Spending";
import Wallets from "../components/moneytracker/Wallets";
import { getFirstDateOfCurrentMonth } from "../components/helpers/dateHelper";
import { BiSolidWalletAlt } from "react-icons/bi";
import { FaGoogleWallet } from "react-icons/fa";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import WalletEMI from "../components/moneytracker/WalletEMI";
import { MdAccessTimeFilled } from "react-icons/md";

export default function MoneyTracker() {
  const [activeTab, setActiveTab] = useState(0);
  const [showEntry, setShowEntry] = useState(false);
  const [forceRefreshExpense, setForceRefreshExpense] = useState(false);
  const [date, setDate] = useState(getFirstDateOfCurrentMonth());

  let title = "";

  if (activeTab == 0) {
    title = "Income";
  }

  if (activeTab == 1) {
    title = "Expense";
  }

  if (activeTab == 2) {
    title = "Salaries";
  }

  if (activeTab == 3) {
    title = "Wallets";
  }

  const refreshExpense = () => {
    setForceRefreshExpense(true);
  };

  return (
    <Container>
      {showEntry && (activeTab == 1 || activeTab == 0) && (
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
      <Header>
        <Name>{title}</Name>
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
      </Header>
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
        {activeTab == 2 && <Salary showEntry={showEntry} selectedDate={date} />}
      </Content>
      <Content>
        {activeTab == 3 && (
          <Wallets showEntry={showEntry} selectedDate={date} />
        )}
      </Content>
      <Bottom>
        <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
          <HiViewGrid />
        </Icon>
        <Icon onClick={() => setActiveTab(1)} data-active={activeTab == 1}>
          <HiChartPie />
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
          <HiLibrary />
        </Icon>
        <Icon onClick={() => setActiveTab(3)} data-active={activeTab == 3}>
          <FaGoogleWallet />
        </Icon>
      </Bottom>
    </Container>
  );
}

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
  font-size: 2rem;
  transform: translateY(-2px);
  text-shadow: 0 0 1px white, 0 0 1px rgba(255, 255, 255.25),
    0 0 1px rgba(255, 255, 255.25);
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
  padding: 1rem 2rem;
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
