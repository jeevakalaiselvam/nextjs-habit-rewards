import React from "react";
import styled from "styled-components";
import { formatDate1, formatDate2 } from "../helpers/dateHelper";
import PlatinumIconS from "./PlatinumIconS";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import { COLOR_UNLOCKED, COLOR_UNLOCKED_DARK } from "../helpers/colorHelper";

export default function GAME_MAIN({ setTabActive, selectedGame }) {
  return (
    <Game>
      <Game1Line>
        <GameLeft>{selectedGame?.name?.toUpperCase()} TROPHIES</GameLeft>
      </Game1Line>
      <Game2Line>
        {selectedGame?.achievements
          ?.filter((ach) => ach?.achieved == 1)
          ?.map((ach, index) => {
            let desc1 = ach?.hiddenDesc;
            let desc2 = ach?.description;
            let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];
            return (
              <AchCard
                color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
                achieved={ach?.achieved}
              >
                {ach?.color != "Platinum" && (
                  <AchIconOuter achieved={ach?.achieved}>
                    <AchIcon
                      icon={ach?.icon}
                      onClick={() => {
                        if (window !== "undefined") {
                          const searchQuery = `${
                            ach?.displayName
                          } achievement ${encodeURIComponent(ach?.gameName)} `;
                          window.open(
                            `https://www.google.com/search?q=${searchQuery}`
                          );

                          // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
                        }
                      }}
                    ></AchIcon>
                  </AchIconOuter>
                )}

                {ach?.color == "Platinum" && (
                  <AchIconOuterPlatinum achieved={ach?.achieved}>
                    <span
                      style={{
                        background: "#D5D6D6",
                        width: "60px",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlatinumIcon />
                    </span>
                  </AchIconOuterPlatinum>
                )}

                <AchData>
                  <AchTitle>{ach?.displayName}</AchTitle>
                  <AchDesc>{desc2 ? desc2 : desc3 ? desc3 : desc1}</AchDesc>
                </AchData>
                {ach?.achieved == 1 && (
                  <Unlocked>
                    <UnlockedT1>
                      {formatDate1(new Date(ach?.unlocktime * 1000))}
                    </UnlockedT1>
                    <UnlockedT2>
                      {formatDate2(new Date(ach?.unlocktime * 1000))}
                    </UnlockedT2>
                  </Unlocked>
                )}

                <Seperator padding={".25rem"} />
                {ach?.color != "Platinum" && (
                  <AchRarity>
                    <span style={{ fontSize: "1.2rem" }}>
                      {ach?.percentage}%
                    </span>
                    <span style={{ fontSize: ".7rem" }}>
                      {ach?.label?.toUpperCase()}
                    </span>
                  </AchRarity>
                )}

                {ach?.color == "Platinum" && (
                  <AchRarity>
                    <span style={{ fontSize: ".7rem" }}>PLATINUM</span>
                  </AchRarity>
                )}

                <Seperator padding={".25rem"} />
                <AchTrophy>
                  {ach?.color == "Platinum" && <PlatinumIconS />}
                  {ach?.color == "Gold" && <GoldIconS />}
                  {ach?.color == "Silver" && <SilverIconS />}
                  {ach?.color == "Bronze" && <BronzeIconS />}
                </AchTrophy>
              </AchCard>
            );
          })}
      </Game2Line>
    </Game>
  );
}

// Styles

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

const GameLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100px;
  color: #579428;
`;

const UnlockedT1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  padding-top: 0.25rem;
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

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
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

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: ${(props) =>
    props.achieved ? COLOR_UNLOCKED : props.color};
  border: 1px solid #eee;
`;

const Game2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding: 0.25rem 0.25rem;
`;

const Game1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  color: #fefefe;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const Game = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
`;
