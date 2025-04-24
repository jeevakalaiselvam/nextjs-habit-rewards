import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getDaysInMonth } from "./helpers/dateHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";

const ACTIVITY_KEYS = ["Tracking", "Analysis", "Build", "Bugfix", "Calls"];

const getStoredData = () => {
  const data = localStorage.getItem("JEEVA_TIMER");
  return data ? JSON.parse(data) : {};
};

const storeData = (data) => {
  localStorage.setItem("JEEVA_TIMER", JSON.stringify(data));
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString(),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

function ActivityTracker({ totalCurrentMonthSalary }) {
  const [selectedKey, setSelectedKey] = useState(ACTIVITY_KEYS?.[0]);
  const [activityData, setActivityData] = useState(() => getStoredData());
  const [runningActivity, setRunningActivity] = useState(() => {
    const stored = getStoredData();
    return (
      ACTIVITY_KEYS.find(
        (key) =>
          stored[key]?.lastStart !== null &&
          stored[key]?.lastStart !== undefined
      ) || null
    );
  });
  const [startInput, setStartInput] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    storeData(activityData);
  }, [activityData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActivityData((prev) => {
        const updated = { ...prev };
        ACTIVITY_KEYS.forEach((key) => {
          if (updated[key]?.lastStart) {
            const elapsed = now - updated[key].lastStart;
            updated[key] = {
              ...updated[key],
              time: (updated[key].time || 0) + elapsed,
              lastStart: now,
            };
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = (key) => {
    setRunningActivity(key);
    setActivityData((prev) => {
      const updated = { ...prev };
      ACTIVITY_KEYS.forEach((k) => {
        if (updated[k]) updated[k].lastStart = null;
      });
      updated[key] = {
        ...(prev[key] || { time: 0 }),
        lastStart: Date.now(),
      };
      return updated;
    });
  };

  const handleStop = () => {
    setRunningActivity(null);
    setActivityData((prev) => {
      const updated = { ...prev };
      if (runningActivity && updated[runningActivity]?.lastStart) {
        const now = Date.now();
        updated[runningActivity].time +=
          now - updated[runningActivity].lastStart;
        updated[runningActivity].lastStart = null;
      }
      return updated;
    });
  };

  const handleReset = () => {
    setRunningActivity(null);
    setActivityData((prev) => {
      const updated = { ...prev };
      ACTIVITY_KEYS?.forEach((key) => {
        if (updated?.[key]) {
          updated[key].time = 0;
          updated[key].lastStart = 0;
        }
      });
      return updated;
    });
  };

  const handleSetInitialTime = () => {
    const { hours, minutes } = startInput;
    const now = new Date();
    const currentTimeMs =
      now.getHours() * 3600 * 1000 +
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000 +
      now.getMilliseconds();
    const inputTimeMs = (hours * 3600 + minutes * 60) * 1000;

    let elapsedMs = currentTimeMs - inputTimeMs;
    if (elapsedMs < 0) {
      elapsedMs += 24 * 3600 * 1000; // adjust if time is from previous day
    }

    setActivityData((prev) => ({
      ...prev,
      [selectedKey]: {
        time: (prev?.[selectedKey]?.time || 0) + elapsedMs,
        lastStart: prev?.[selectedKey]?.lastStart || null,
      },
    }));
    handleStart(selectedKey);
  };

  const totalTime = Object.values(activityData).reduce(
    (acc, cur) => acc + (cur?.time || 0),
    0
  );

  const getHMS = (elapsedSeconds) => {
    const totalSeconds = Math.floor(elapsedSeconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString(),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const getSecondsLeftToday = () => {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    const diffMs = endOfDay - now;
    return Math.floor(diffMs / 1000);
  };

  let perSecond = (
    totalCurrentMonthSalary /
    getDaysInMonth(new Date()) /
    (8 * 60 * 60)
  )?.toFixed(10);

  let totalEarnableToday = 8 * 60 * 60 * perSecond;

  let secondsElapsed = totalTime / 1000;
  let topGreen = secondsElapsed * perSecond;
  let topTicker = Number(perSecond);
  let topMessage = "Earned";
  let bottomMessage = "Remaining";
  let bottomGreen =
    (8 * 60 * 60 - (secondsElapsed < 0 ? 0 : secondsElapsed)) * perSecond;
  topGreen = topGreen > totalEarnableToday ? totalEarnableToday : topGreen;
  let topTickerMessage = Math.floor(Number(topGreen) / 500) + " Task Closed";

  let totalTimeInDay = 8 * 60 * 60;
  let timeLeftInToday = getSecondsLeftToday();
  let timeAlreadyCompleted = secondsElapsed;
  let timeNeeded = totalTimeInDay - timeAlreadyCompleted;

  console.log({ startInput });

  const showStartButtons = !runningActivity && !totalTime;

  return (
    <Container>
      {showStartButtons && (
        <TimerSelect>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Hours"
            value={startInput.hours}
            onChange={(e) =>
              setStartInput((prev) => ({
                ...prev,
                hours: Number(e.target.value),
              }))
            }
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Minutes"
            value={startInput.minutes}
            onChange={(e) =>
              setStartInput((prev) => ({
                ...prev,
                minutes: Number(e.target.value),
              }))
            }
          />
        </TimerSelect>
      )}
      {totalTime > 0 && (
        <TimerInfo3 marginHigh={!status === "paused"}>
          <Hour2>{formatTime(totalTime)?.hours}h</Hour2>
          <Min2>{formatTime(totalTime)?.minutes}m</Min2>
          <Sec2>{formatTime(totalTime)?.seconds}s</Sec2>
        </TimerInfo3>
      )}
      {ACTIVITY_KEYS.map((key) => (
        <SingleEntry key={key}>
          <SubTitle
            selected={key == selectedKey}
            onClick={() => setSelectedKey(key)}
          >
            {key}
          </SubTitle>

          <TimerInfo active={runningActivity == key}>
            <Hour>{formatTime(activityData[key]?.time || 0)?.hours}h</Hour>
            <Min>{formatTime(activityData[key]?.time || 0)?.minutes}m</Min>
            <Sec>{formatTime(activityData[key]?.time || 0)?.seconds}s</Sec>
          </TimerInfo>
        </SingleEntry>
      ))}

      <TimerInfo2>
        <MoneyLeft>
          {<SubTitle2>{topMessage}</SubTitle2>}
          {
            <MainTitle ifSelectedDateIsCurrentMonth={true}>
              <span
                style={{ fontSize: "1.5rem", transform: "translateY(3px)" }}
              >
                <FaIndianRupeeSign />
              </span>
              {topGreen ? (topGreen > 0 ? topGreen?.toFixed(1) : 0) : 0}
            </MainTitle>
          }
        </MoneyLeft>
        <MoneyRight>
          <SubTitle2>{bottomMessage}</SubTitle2>
          <MainTitle ifSelectedDateIsCurrentMonth={true}>
            <span style={{ fontSize: "1.5rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {bottomGreen ? (bottomGreen > 0 ? bottomGreen?.toFixed(1) : 0) : 0}
          </MainTitle>
        </MoneyRight>
      </TimerInfo2>

      {totalTime > 0 && (
        <StartStopContainer>
          <ButtonLeft
            onClick={() => {
              if (runningActivity == selectedKey) {
                handleStop();
              } else {
                handleStart(selectedKey);
              }
            }}
            disabled={runningActivity === selectedKey}
          >
            {runningActivity == selectedKey ? "Pause" : "Start"}
          </ButtonLeft>
          <ButtonReset
            onClick={handleReset}
            disabled={runningActivity !== selectedKey}
          >
            Reset
          </ButtonReset>
        </StartStopContainer>
      )}
      {showStartButtons && (
        <Button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleSetInitialTime}
        >
          Start
        </Button>
      )}
    </Container>
  );
}

export default ActivityTracker;

const Hour2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 2.25rem;
`;

const Min2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  flex: 1;
`;

const Sec2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  flex: 1;
`;

const TimerInfo3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 1rem;
  margin-bottom: ${(props) => (props?.marginHigh ? "1rem" : "")};
  color: ${(props) => (props.danger ? "#fe6662" : "")};
`;

const MoneyLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const MoneyRight = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const IndividualContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const SingleEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translateX(-0.5rem);
`;

const Ticker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #929498;
  animation: blink-smooth 1s infinite linear;
  @keyframes blink-smooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  padding: 1.5rem 0rem 1rem 0rem;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.selected ? "#52b8da" : "#5f5f5f")};
  width: 100px;
  transform: translateX(6px);
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;

const SubTitle2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  width: 100%;
  transform: translateX(6px);
  padding: 1rem;
  font-size: 1rem;
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${(props) =>
    props.ifSelectedDateIsCurrentMonth ? "#04b488" : "#53B5D9"};
`;

const TimerInfo2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  transform: translateX(-0.5rem);
`;

const Start = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  border-radius: 4px;
  padding: 1rem;
  font-size: 2rem;
  background-color: ${(props) => (props.disabled ? "#828282" : "#2982e3")};

  &:active {
    transform: translate(0px, 2px);
  }
`;

const Stop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  border-radius: 4px;
  padding: 1rem;
  font-size: 2rem;
  background-color: #04b488;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const TimerSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  & input {
    width: 90%;
    margin-bottom: 1rem;
    background-color: #141414;
    color: #a2a2a2;
    border: none;
    font-size: 2rem;
    text-align: center;
    padding: 0.5rem 1rem;
    outline: none;
  }
`;

const Hour = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Min = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Sec = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const TimerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1.5;
  color: ${(props) =>
    props.danger ? "#fe6662" : props.active ? "#e3e3e3" : "#303030"};
`;

const StartStopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const ButtonLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  border-radius: 4px;
  margin-right: 0.5rem;
  padding: 1rem;
  font-size: 2rem;
  background-color: #04b488;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  border-radius: 4px;
  margin-left: 0.5rem;
  padding: 1rem;
  font-size: 2rem;
  background-color: #04b488;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const PAButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.5rem;
  background-color: #04b488;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const PAButtonReset = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.5rem;
  background-color: #fe6662;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const ButtonReset = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin-left: 0.5rem;
  border-radius: 4px;
  padding: 1rem;
  font-size: 2rem;
  background-color: #fe6662;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 1rem 1rem;
  min-height: 60vh;
  width: 100%;
  max-height: 60vh;
`;
