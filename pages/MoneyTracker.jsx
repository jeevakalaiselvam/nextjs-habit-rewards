import styled from "styled-components";
import Welcome from "../components/moneytracker/Welcome";
import {
  HiChartBar,
  HiChartPie,
  HiCurrencyRupee,
  HiPresentationChartLine,
  HiUserCircle,
  HiViewBoards,
} from "react-icons/hi";
import { useState } from "react";

export default function MoneyTracker() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <Header>
        <Welcome />
      </Header>
      <Content>CONTENT</Content>
      <Bottom>
        <Icon onClick={() => setActiveTab(0)} data-active={activeTab == 0}>
          <HiViewBoards />
        </Icon>
        <Icon onClick={() => setActiveTab(1)} data-active={activeTab == 1}>
          <HiPresentationChartLine />
        </Icon>
        <Icon onClick={() => setActiveTab(2)} data-active={activeTab == 2}>
          <HiChartPie />
        </Icon>
        <Icon onClick={() => setActiveTab(3)} data-active={activeTab == 3}>
          <HiUserCircle />
        </Icon>
      </Bottom>
    </Container>
  );
}

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
