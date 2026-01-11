import { useState } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { COLOR_UNLOCKED_DARK } from "../helpers/colorHelper";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import GoldIcon from "./GoldIcon";
import BronzeIcon from "./BronzeIcon";
import { MdOutlineArrowRight } from "react-icons/md";
import { MdDoubleArrow } from "react-icons/md";
import axios from "axios";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function ACH_CARD({
  index,
  desc1,
  desc2,
  desc3,
  ach,
  lane,
  hideCompletion,
  longer,
  setLearntAchs,
  hiddenMapper,
}) {
  const dispatch = useDispatch();
  const [mouseEnter, setMouseEnter] = useState(false);
  const [mouseClick, setMouseClick] = useState(false);

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

  const moveToCompletion = (ach) => {
    setMouseClick(true);
    let achToMarkLearnt = ach;
    try {
      axios
        .post("/api/learnt", {
          achName: `${achToMarkLearnt?.gameId}-${achToMarkLearnt?.name}`,
        })
        .then((response) => {
          let data = response.data;
          setLearntAchs(data);
          setMouseClick(false);
          setMouseEnter(false);
        });
    } catch (e) {}
  };

  return (
    <AchCard
      mouseEnter={mouseEnter}
      longer={longer}
      ref={drag}
      color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
      achieved={ach?.achieved}
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
      onMouseOver={() => {
        setMouseEnter(true);
      }}
    >
      <CompletionBar percentage={ach?.percentage}></CompletionBar>
      {(ach?.achieved == 1 || ach.achievedByLearning) && !hideCompletion && (
        <AchCompleted>
          <span style={{ padding: ".5rem", color: "#FEFEFE" }}>
            <FaCheck />
          </span>
        </AchCompleted>
      )}
      <AchIconOuter>
        <AchIcon
          icon={
            ach?.achieved == 1 || ach?.achievedByLearning
              ? ach?.icon
              : ach?.icongray
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

      <AchData>
        <AchTitle>{ach?.displayName}</AchTitle>
        <AchDesc>
          {hiddenMapper?.[ach?.displayName?.toLowerCase()] ??
            ach?.description ??
            "Secret Achievement"}
        </AchDesc>
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
      {false && (mouseEnter || mouseClick) && (
        <CompleteMark
          onClick={() => {
            moveToCompletion(ach);
          }}
        >
          <Mark
            onClick={() => {
              setMouseClick(true);
              setMouseEnter(true);
            }}
          >
            {!mouseClick && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "14px" }}>MARK</span>
              </span>
            )}
            {mouseClick && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "14px" }}>MARK</span>
                <span
                  style={{ transform: "translateY(-1px)", marginLeft: ".5rem" }}
                >
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                </span>
              </span>
            )}
          </Mark>
        </CompleteMark>
      )}
    </AchCard>
  );
}

const Mark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  width: 26px;
  height: 70px;
  transform: rotate(-90deg);
`;

const CompleteMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #1c1f25;
  color: #fefefe;
  z-index: 11;
  padding: 0 2px;
  font-size: 1.25rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
  color: rgb(220, 222, 223);
`;

const AchDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 14px;
  font-weight: 400;
  flex: 1;
  color: rgb(184, 188, 191);
  opacity: 0.7;
`;

const AchUnlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 400;
  padding-left: 0.5rem;
  color: rgb(139, 146, 154);
  flex: 1;
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
  height: 70px;
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

const AchIconOuter = styled.div`
  width: 68px;
  height: 68px;
  cursor: pointer;
  position: relative;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  margin-left: 1px;
`;

const AchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 68px;
  height: 68px;
  background: ${(props) => `url(${props?.icon})`} center/contain no-repeat;
  cursor: pointer;
  z-index: 10;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 70px;
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
  width: ${(props) => (props.longer ? `${props.longer}px` : "100%")};
  background-color: #23262e;
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
`;
