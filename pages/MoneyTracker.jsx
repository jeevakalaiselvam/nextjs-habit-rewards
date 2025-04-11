import styled from "styled-components";
import Welcome from "../components/moneytracker/Welcome";
import {
  HiChartBar,
  HiChartPie,
  HiCurrencyRupee,
  HiFolderAdd,
  HiPlus,
  HiPresentationChartLine,
  HiShieldCheck,
  HiUserCircle,
  HiViewBoards,
} from "react-icons/hi";
import { useState } from "react";
import Money from "../components/moneytracker/Money";
import Values from "../components/moneytracker/Values";

export default function MoneyTracker() {
  const [activeTab, setActiveTab] = useState(2);

  return (
    <Container>
      <Header>
        <Welcome />
      </Header>
      <Content>{activeTab == 0 && <Money />}</Content>
      <Content>{activeTab == 2 && <Values />}</Content>
      <Bottom>
        <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
          <HiViewBoards />
        </Icon>
        <Icon onClick={() => setActiveTab(1)} data-active={activeTab == 1}>
          <HiPresentationChartLine />
        </Icon>
        <Icon>
          <Inner>
            <HiPlus />
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
  background-color: #141414;
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
`;
