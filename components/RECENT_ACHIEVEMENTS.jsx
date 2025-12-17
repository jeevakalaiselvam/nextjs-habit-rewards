import React from "react";
import styled from "styled-components";
import {
  COLOR_BLUE,
  COLOR_GREEN2,
  COLOR_UNLOCKED_DARK,
} from "../helpers/colorHelper";
import { timeAgoInGame } from "../helpers/dateHelper";
import BronzeIconS from "./BronzeIconS";
import SilverIconS from "./SilverIconS";
import GoldIconS from "./GoldIconS";
import PlatinumIconS from "./PlatinumIconS";

export default function RECENT_ACHIEVEMENTS({ allUnlocked, activeAch }) {
  return (
    <RecentAchs>
      {allUnlocked
        ?.slice(0, 35)
        ?.filter((ach) => ach?.color != "Platinum")
        ?.map((ach, index) => {
          let desc1 = ach?.hiddenDesc;
          let desc2 = ach?.description;
          let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];
          return (
            <RecentAch
              color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
              achieved={ach?.achieved}
            >
              <AchIconOuter achieved={ach?.achieved}>
                <AchIcon icon={ach?.icon}></AchIcon>
              </AchIconOuter>{" "}
              <DataContainer active={index === activeAch}>
                <AchData active={index === activeAch}>
                  <AchTitle>{ach?.displayName}</AchTitle>
                  <AchDesc> {desc2 ? desc2 : desc3 ? desc3 : desc1}</AchDesc>
                  {ach?.achieved == 1 && (
                    <AchUnlocked>
                      <UnlockedT1>
                        <span style={{ color: COLOR_GREEN2 }}>
                          {timeAgoInGame(new Date(ach?.unlocktime * 1000))}
                        </span>
                        <span style={{ margin: "0rem .25rem" }}>in</span>
                        <span style={{ color: COLOR_BLUE }}>
                          {ach?.gameName}
                        </span>
                      </UnlockedT1>
                    </AchUnlocked>
                  )}
                </AchData>
                <Seperator padding={".25rem"} />{" "}
                <AchRarity active={index === activeAch}>
                  <span style={{ fontSize: "1.2rem" }}>{ach?.percentage}%</span>
                  <span style={{ fontSize: ".7rem" }}>
                    {ach?.label?.toUpperCase()}
                  </span>
                </AchRarity>
                <Seperator padding={".25rem"} />
                <AchTrophy active={index === activeAch}>
                  {ach?.color == "Platinum" && <PlatinumIconS />}
                  {ach?.color == "Gold" && <GoldIconS />}
                  {ach?.color == "Silver" && <SilverIconS />}
                  {ach?.color == "Bronze" && <BronzeIconS />}
                </AchTrophy>
              </DataContainer>
            </RecentAch>
          );
        })}
    </RecentAchs>
  );
}

// Styles

const UnlockedT1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #4486c6;
  justify-content: flex-start;
  flex: 2;
  font-size: 0.8rem;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 2;
  width: 100%;
  opacity: 0.75;
  font-size: 0.75rem;
`;

const AchUnlocked = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  flex: 1;
  width: 100%;
  opacity: 0.75;
  font-size: 0.8rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
  height: 60px;
`;

const DataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: ${(props) => (props.active ? "600px" : "0px")};
  max-width: ${(props) => (props.active ? "600px" : "0px")};
  transition: all 0.5s ease-in;
  overflow: hidden;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(2) translate(0.25rem, 0.25rem);
`;

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: "";
  height: 40px;
  background: #000000;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;

const RecentAchs = styled.div`
  display: flex;
  align-items: center;
  justify-content: centera;
  background-color: #e7e7e7;
  padding: 0.25rem 1.5rem;
  width: 100%;
  overflow: scroll;
  color: #44484b;
`;

const RecentAch = styled.div`
  color: #333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 0.5rem;
  background-color: #f5f5f7;
  border: 2px solid #e3e3e6;
  transition: 0.5s all ease;
`;
