import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLUE,
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREEN2,
  COLOR_GREY,
  COLOR_RED,
  COLOR_SILVER,
  COLOR_SILVER2,
  COLOR_UNLOCKED,
  COLOR_UNLOCKED_DARK,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { MdDelete, MdOutlineModeEditOutline } from "react-icons/md";
import { TbEdit, TbPlayCard } from "react-icons/tb";
import { HiPlay } from "react-icons/hi2";
import {
  calculateLevelForAchs,
  calculatePSLevelAndProgress,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
} from "../helpers/trophyHelper";
import GoldIcon from "./GoldIcon";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIcon from "./PlatinumIcon";
import { FaEdge, FaPlay, FaRemoveFormat } from "react-icons/fa";
import EditGameForm from "./EditGameForm";
import PlatinumIconS from "./PlatinumIconS";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Spin } from "antd";
import GameCdImage from "./GameCdImage";
import {
  formatDate,
  formatDate1,
  formatDate2,
  formatDate3,
  timeAgoInGame,
} from "../helpers/dateHelper";
import StatInformation from "./StatInformation";
import LevelIcon from "./LevelIcon";
import LevelUpIcon from "./LevelUpIcon";
import LevelProgressChart from "./LevelProgressChart";
import MultiProgressChart from "./MultiProgressChart";
import BarProgressChart from "./BarProgressChart";

export default function AchCard({ ach, index, platinumFlag, onDeleteClick }) {
  let desc1 = ach?.hiddenDesc;
  let desc2 = ach?.description;
  let desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];

  return (
    <AchCardContainer
      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
      achieved={ach?.achieved}
    >
      {ach?.color != "Platinum" && (
        <AchIconOuter achieved={ach?.achieved}>
          <AchIcon
            icon={platinumFlag ? ach?.img : ach?.icon}
            onClick={() => {
              if (window !== "undefined") {
                const searchQuery = `${
                  ach?.displayName
                } achievement ${encodeURIComponent(ach?.gameName)} `;
                window.open(`https://www.google.com/search?q=${searchQuery}`);
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
        <AchTitle>{platinumFlag ? ach?.title : ach?.displayName}</AchTitle>
        <AchDesc>
          {platinumFlag
            ? ach?.description
            : desc2
            ? desc2
            : desc3
            ? desc3
            : desc1}
        </AchDesc>
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
            {platinumFlag ? ach?.globalPct : ach?.percentage + "%"}
          </span>
          <span style={{ fontSize: ".7rem" }}>
            {platinumFlag ? "UNKNOWN" : ach?.label?.toUpperCase()}
          </span>
        </AchRarity>
      )}
      {ach?.color == "Platinum" && (
        <AchRarity>
          <span style={{ fontSize: ".7rem" }}>PLATINUM</span>
        </AchRarity>
      )}
      <Seperator padding={".25rem"} />
      {!platinumFlag && (
        <AchTrophy>
          {ach?.color == "Platinum" && <PlatinumIconS />}
          {ach?.color == "Gold" && <GoldIconS />}
          {ach?.color == "Silver" && <SilverIconS />}
          {ach?.color == "Bronze" && <BronzeIconS />}
        </AchTrophy>
      )}
      {platinumFlag && (
        <AchTrophy>
          <DeleteIcon
            onClick={() => {
              onDeleteClick(ach);
            }}
          >
            <MdDelete />
          </DeleteIcon>
        </AchTrophy>
      )}
    </AchCardContainer>
  );
}

// Styles
const DeleteIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-0.35rem, -0.2rem);
  cursor: pointer;

  &:hover {
    color: ${COLOR_RED};
  }
`;

const Case = styled.div`
  position: relative;
  width: 200px;
  height: 270px;
  perspective: 800px;
  margin: 1rem;
  position: relative;
  &:hover {
    cursor: pointer;
    transform: scale(1.025);
  }
`;

const Template = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Run = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1rem;
  color: ${COLOR_GREY};
  opacity: 0.75;

  &:hover {
    opacity: 1;
    color: ${COLOR_GREEN};
  }
`;

const Cover = styled.img`
  position: absolute;
  top: 42px;
  left: 0px;
  width: calc(100% - 4px);
  height: calc(100% - 52px);
  object-fit: cover;
  border-radius: 2px;
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

const GameSubLeftImageSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100px;
  background: ${(props) => `url(${props.image})`};
  background-size: cover;
  position: relative;
`;

const GameSubLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
`;

const GameSubRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-left: 1rem;
`;

const GameSubLine = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
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

const AchTrophy2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: scale(1) translate(0.25rem, 0.25rem);
`;

const AchCardContainer = styled.div`
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

const Game2LineLH = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding: 0.25rem 1rem;
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

const RItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  cursor: pointer;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`;

const RareSelection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4486c6;
  width: 100%;
  padding: 1rem;
  background-color: #f5f5f7;
`;

const Rarest2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  padding: 0.5rem 0.5rem;
  width: 100%;
  min-height: 600px;
  max-height: 600px;
  color: #333;
`;

const Rarest3Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  padding: 0.5rem 0.5rem;
  width: 100%;
  color: #333;
`;

const Rarest1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const Rarest = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
`;

const Milestones = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const Platinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 0.5rem;
  color: #7a96d1;
  min-width: 50px;
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 0.7rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3), -1px -1px 1px rgba(0, 0, 0, 0.3),
    1px -1px 1px rgba(0, 0, 0, 0.3), -1px 1px 1px rgba(0, 0, 0, 0.3);
  color: #f9f9f9;
  text-align: center;
  font-weight: 600;
  line-height: 15px;
`;

const Outer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 14px;
  background-color: #bababa;
  position: relative;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 14px;
  background-color: #336291;
  width: ${(props) => `${props.percentage}%`};
`;

const TSingle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0.25rem, 0rem);
`;

const TBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Trophies = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 50px;
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

const Ps5 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border-radius: 2px;
  padding: 2px;
  cursor: pointer;
  width: 40px;
  box-shadow: 0 0 0 1px #939393 inset;
`;

const GameTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%6;
  justify-content: center;
  color: #057fcc;
`;

const Warning = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.5rem 0;
  color: red;
  animation: blinkSmooth 1.5s ease-in-out infinite;

  @keyframes blinkSmooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const GameLastPlayed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem 0.125rem 0;
  color: #666666;
`;

const GameHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.125rem 0;
  color: #666666;
`;

const GameCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem 0.25rem 0;
  color: #666666;
`;

const GameCompletionCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.5rem;
  color: #666666;
`;

const GamePrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  padding: 0.5rem;
  color: #666666;
  color: ${COLOR_GREEN2};
`;

const Started = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const GameData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0rem 1rem;
  flex-direction: column;
`;

const GameDataCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;
  flex-direction: column;
`;

const GameInfoCD = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
`;

const GameInfo = styled.div`
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-end;
`;

const GameImage = styled.div`
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
`;

const GameContainerCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${(props) => props.color};
  color: #333;
  padding: 8px;
  flex-direction: column;
  border: 1px solid #ddd;
  cursor: pointer;
  width: 350px;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Games2LineCDL = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const Games2LineCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 93%;
`;

const Games1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const GamesCD = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const Games = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const GamesR = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
`;

const GameLineTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fefefe;
  flex-direction: column;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  flex: 1;
  margin-right: 1rem;
  margin-bottom: 1rem;
`;

const GameLineHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const GamesLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const GameLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const GamesRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const SRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1.1;
  padding: 0.5rem;
`;

const SRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 2;
  width: 100%;
  padding: 0.5rem;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #f7f7f7;
  width: 100%;
  padding: 1rem;
  color: #44484b;
`;

const FRItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_BRONZE};
  padding: 0.75rem;
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
  color: ${generateDarkTextColorForLightBg(COLOR_BRONZE, 50)};
`;

const TabLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 0.8rem;
  margin-right: 1rem;
  padding-bottom: 0.25rem;
  font-weight: ${(props) => (props.active ? "bold" : "300")};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${COLOR_ACCENT}` : `2px solid #00000000`};
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const FRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const GameSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & input {
    width: 100%;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
  }
`;

const CollectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7e7e7;
  padding: 1rem;
  width: 100%;
  color: #44484b;
`;

const RecentAchs = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #e7e7e7;
  padding: 1rem;
  width: 100%;
  overflow: scroll;
  color: #44484b;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7e7e7;
  padding: 0.5rem 1rem;
  width: 100%;
  color: #44484b;
`;

const OuterAchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 1400px;
  border-radius: 4px;
  transform: translateY(-2rem);
  background-color: #292b2d;
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

const StatWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StatWrapper2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 0rem;
`;
