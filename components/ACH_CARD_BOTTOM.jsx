import { useState } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { COLOR_UNLOCKED_DARK } from "../helpers/colorHelper";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import GoldIcon from "./GoldIcon";
import BronzeIcon from "./BronzeIcon";

export default function ACH_CARD_BOTTOM({
  index,
  desc1,
  desc2,
  desc3,
  ach,
  lane,
  hideCompletion,
  longer,
}) {
  const dispatch = useDispatch();

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
      return `${"Unlocked @"} ${unlockedAt}`;
    } else {
      return `${"Unlocked @"} ${d} ${m} @ ${hours}:${minutes}${ampm}`;
    }
  }

  return (
    <AchCard
      longer={longer}
      ref={drag}
      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
      achieved={ach?.achieved}
    >
      <CompletionBar percentage={ach?.percentage}></CompletionBar>
      {(ach?.achieved == 1 || ach.achievedByLearning) && !hideCompletion && (
        <AchCompleted>
          <span
            style={{
              padding: ".5rem",
              color: "#fefefe",
              fontSize: "2rem",
              transform: "translateY(4px)",
            }}
          >
            <FaCheck />
          </span>
        </AchCompleted>
      )}

      <AchData>
        <AchTitle className="steamtracker_title">{ach?.displayName}</AchTitle>
        <AchIconOuter>
          <AchIcon
            icon={
              ach?.achieved == 1 || ach?.achievedByLearning
                ? ach?.icon
                : ach?.icon
            }
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
        <AchDesc>{desc2 ? desc2 : desc3 ? desc3 : desc1}</AchDesc>
        {false && (
          <AchUnlocked>
            {ach?.percentage}% of players have this achievement
          </AchUnlocked>
        )}
      </AchData>
      {false && (ach?.achieved == 1 || ach?.achievedByLearning) && (
        <AchRarity>
          {formatUnlockDate(
            new Date(ach?.unlocktime * (ach.achievedByLearning ? 1 : 1000)),
            ach.unlockedAt
          )}
        </AchRarity>
      )}
    </AchCard>
  );
}

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 4px;
  position: relative;
  z-index: 2;
  overflow: hidden;
  margin: 4px;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  position: absolute;
  top: calc(50%);
  left: calc(50%);
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 4px 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.25rem;
  font-size: 12px;
  text-align: center;
  font-weight: 400;
  color: #898989;
  opacity: 0.75;
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

const CompletionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) =>
    props.percentage ? `calc(${props.percentage}% + 58px)` : "50%"};
  height: 68px;
  background-color: #16202d;
  z-index: 1;
`;

const AchCompleted = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  z-index: 2;
  background-color: #16202d;
`;

const AchData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
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

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 208px;
  background-color: #16202d;
  cursor: pointer;
  position: relative;
  margin-bottom: 4px;
  border-radius: 4px;
`;
