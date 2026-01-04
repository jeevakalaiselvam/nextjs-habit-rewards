import React, { useState } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import PlatinumIcon from "./PlatinumIcon";
import { formatDate1, formatDate2 } from "../helpers/dateHelper";
import PlatinumIconS from "./PlatinumIconS";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import { COLOR_UNLOCKED, COLOR_UNLOCKED_DARK } from "../helpers/colorHelper";
import { useDispatch } from "react-redux";
import { actionAddAchToKanban } from "../store/actions/games.actions";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

export default function ACH_CARD({ index, desc1, desc2, desc3, ach, lane }) {
  const [isMouseOver, setMouseOver] = useState(false);
  const dispatch = useDispatch();
  const { kanbanObj } = useSelector((s) => s.kanban);

  const achId = `${ach.gameId}-${ach.name}`;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ACH_CARD",
      item: { achId, ach, fromLane: lane },
      canDrag: true, // Cannot drag completed achievements
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [lane, achId]
  );

  function formatUnlockDate(date, unlockedAt) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const d = date.getDate();
    const m = months[date.getMonth()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12

    if (unlockedAt?.length > 0) {
      return `${"Learnt"} ${unlockedAt}`;
    } else {
      return `${"Unlocked"} ${d} ${m} @ ${hours}:${minutes}${ampm}`;
    }
  }

  return (
    <AchCard
      ref={drag}
      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
      achieved={ach?.achieved}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      <CompletionBar percentage={ach?.percentage}></CompletionBar>
      {(ach?.achieved == 1 || ach.achievedByLearning) && (
        <AchCompleted>
          <span style={{ padding: ".5rem", color: "#FEFEFE" }}>
            <FaCheck />
          </span>
        </AchCompleted>
      )}
      <AchIcon
        icon={ach?.icon}
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

      <AchData>
        <AchTitle>{ach?.displayName}</AchTitle>
        <AchDesc>{desc2 ? desc2 : desc3 ? desc3 : desc1}</AchDesc>
        <AchUnlocked>
          {ach?.percentage}% of players have this achievement
        </AchUnlocked>
      </AchData>
      {(ach?.achieved == 1 || ach?.achievedByLearning) && (
        <AchRarity>
          {formatUnlockDate(
            new Date(ach?.unlocktime * (ach.achievedByLearning ? 1 : 1000)),
            ach.unlockedAt
          )}
        </AchRarity>
      )}
      {isMouseOver && ach?.achieved != 1 && false && (
        <AchCompleted>
          <span style={{ padding: ".5rem", color: "#FEFEFE" }}>
            <FaCheck />
          </span>
        </AchCompleted>
      )}
    </AchCard>
  );
}

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
  font-size: 0.5rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  padding-top: 0.25rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 16px;
  font-weight: 500;
  color: rgb(220, 222, 223);
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 12px;
  font-weight: 400;
  color: rgb(184, 188, 191);
`;

const AchUnlocked = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 400;
  padding-left: 0.5rem;
  color: rgb(139, 146, 154);
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : "#00000000"};
`;

const CompletionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) =>
    props.percentage ? `calc(${props.percentage}% + 58px)` : "50%"};
  height: 60px;
  background-color: #31343e;
  z-index: 1;
`;

const AchCompleted = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  z-index: 2;
  background-color: #31343e;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 60px;
  z-index: 2;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-size: 12px;
  font-weight: 400;
  color: rgb(139, 146, 154);
  z-index: 2;
  padding-right: 0.5rem;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: translate(0.25rem, 0.25rem);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: #23262e;
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
`;
