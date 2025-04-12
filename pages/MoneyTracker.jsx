import styled from "styled-components";
import Welcome from "../components/moneytracker/Welcome";
import {
  HiChartBar,
  HiChartPie,
  HiCurrencyRupee,
  HiFolderAdd,
  HiLockClosed,
  HiPlus,
  HiPresentationChartLine,
  HiShieldCheck,
  HiUserCircle,
  HiViewBoards,
} from "react-icons/hi";
import { useState } from "react";
import Money from "../components/moneytracker/Money";
import Values from "../components/moneytracker/Values";
import Entry from "../components/moneytracker/Entry";
import { IoIosCloseCircle } from "react-icons/io";
import Spending from "../components/moneytracker/Spending";
import Wallets from "../components/moneytracker/Wallets";

export default function MoneyTracker() {
  const [activeTab, setActiveTab] = useState(1);
  const [showEntry, setShowEntry] = useState(false);

  return (
    <Container>
      {showEntry && (
        <EntryModal>
          <Entry setShowEntry={setShowEntry} />
        </EntryModal>
      )}
      <Header>
        <Welcome />
      </Header>
      <Content>{activeTab == 0 && <Money showEntry={showEntry} />}</Content>
      <Content>{activeTab == 1 && <Spending showEntry={showEntry} />}</Content>
      <Content>{activeTab == 2 && <Values showEntry={showEntry} />}</Content>
      <Content>{activeTab == 3 && <Wallets showEntry={showEntry} />}</Content>
      <Bottom>
        <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
          <HiViewBoards />
        </Icon>
        <Icon onClick={() => setActiveTab(1)} data-active={activeTab == 1}>
          <HiPresentationChartLine />
        </Icon>
        <Icon>
          <Inner
            onClick={() => {
              setShowEntry((old) => !old);
            }}
          >
            {!showEntry && <HiPlus />}
            {showEntry && <IoIosCloseCircle />}
          </Inner>
        </Icon>
        <Icon onClick={() => setActiveTab(2)} data-active={activeTab == 2}>
          <HiShieldCheck />
        </Icon>
        <Icon onClick={() => setActiveTab(3)} data-active={activeTab == 3}>
          <HiUserCircle />
        </Icon>
      </Bottom>
    </Container>
  );
}

const EntryModal = styled.div`
  display: flex;
  width: 95%;
  z-index: 100;
  min-height: 61vh;
  max-height: 61vh;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border-radius: 0.5rem;
  position: absolute;
  top: 5%;
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
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 70px;
  padding-top: 2rem;
  flex-direction: column;
  background-color: #141414;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  flex-direction: column;
  flex: 1;
`;

const Bottom = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  background-color: #0d1a28;
  justify-content: center;
  align-items: center;
  padding-bottom: 1.6rem;
  z-index: 10;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  overflow: scroll;
  width: 100%;
  color: #fefefe;
  position: relative;
`;
