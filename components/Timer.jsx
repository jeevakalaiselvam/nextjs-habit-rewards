import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getDateFromTime24, getDaysInMonth } from "./helpers/dateHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";

const TIMER_KEY = "persistent_timer";

const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

export default function Timer({ totalCurrentMonthSalary }) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [timeHours, setTimeHours] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");

  // Load saved state on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(TIMER_KEY));
    if (saved) {
      setElapsed(saved.elapsed || 0);
      setIsRunning(saved.isRunning || false);
      if (saved.isRunning && saved.startTime) {
        const timeSinceLast = Math.floor((Date.now() - saved.startTime) / 1000);
        setElapsed(saved.elapsed + timeSinceLast);
      }
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    const startTime = isRunning ? Date.now() : null;
    localStorage.setItem(
      TIMER_KEY,
      JSON.stringify({ elapsed, isRunning, startTime })
    );
  }, [elapsed, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const getElapsedSinceTodayTime = (hour, minute) => {
    const now = new Date();

    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0
    );

    const diffMs = now - startTime;
    const elapsedSeconds = Math.floor(diffMs / 1000);

    return elapsedSeconds;
  };

  const start = () => {
    let preSetElapsed = getElapsedSinceTodayTime(timeHours, timeMinutes);
    if (!isRunning && elapsed === 0) {
      setElapsed(preSetElapsed);
      setIsRunning(true);
    }
  };

  const pause = () => setIsRunning(false);

  const resume = () => {
    if (!isRunning && elapsed > 0) {
      setIsRunning(true);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    localStorage.removeItem(TIMER_KEY);
  };

  const getHMS = (elapsedSeconds) => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    return { hours, minutes, seconds };
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

  let topGreen = elapsed * perSecond;
  let topTicker = Number(perSecond);
  let topMessage = "Earned Today";
  let bottomMessage = "Remaining Today";
  let bottomGreen = (8 * 60 * 60 - (elapsed < 0 ? 0 : elapsed)) * perSecond;
  let topTickerMessage = (Number(topGreen) / 500)?.toFixed(0) + " Task Closure";

  let totalTime = 8 * 60 * 60;
  let timeLeftInToday = getSecondsLeftToday();
  let timeAlreadyCompleted = elapsed;
  let timeNeeded = totalTime - timeAlreadyCompleted;

  return (
    <Container>
      {!(isRunning || elapsed > 0) && (
        <TimerSelect>
          <input
            type="number"
            inputMode="numeric"
            value={timeHours}
            placeholder="HOUR"
            onChange={(e) => setTimeHours(e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            value={timeMinutes}
            placeholder="MINUTE"
            onChange={(e) => setTimeMinutes(e.target.value)}
          />
        </TimerSelect>
      )}
      {<SubTitle>{"Work Time"}</SubTitle>}
      {
        <TimerInfo marginHigh={!(isRunning || elapsed === 0)}>
          <Hour>{getHMS(elapsed)?.hours}h</Hour>
          <Min>{getHMS(elapsed)?.minutes}m</Min>
          <Sec>{getHMS(elapsed)?.seconds}s</Sec>
        </TimerInfo>
      }

      {!(isRunning || elapsed === 0) && <SubTitle>{"Work Needed"}</SubTitle>}
      {!(isRunning || elapsed === 0) && (
        <TimerInfo marginHigh={!(isRunning || elapsed === 0)}>
          <Hour>{getHMS(timeNeeded)?.hours}h</Hour>
          <Min>{getHMS(timeNeeded)?.minutes}m</Min>
          <Sec>{getHMS(timeNeeded)?.seconds}s</Sec>
        </TimerInfo>
      )}

      {!(isRunning || elapsed === 0) && <SubTitle>{"Time Left"}</SubTitle>}
      {!(isRunning || elapsed === 0) && (
        <TimerInfo marginHigh={!(isRunning || elapsed === 0)}>
          <Hour>{getHMS(timeLeftInToday)?.hours}h</Hour>
          <Min>{getHMS(timeLeftInToday)?.minutes}m</Min>
          <Sec>{getHMS(timeLeftInToday)?.seconds}s</Sec>
        </TimerInfo>
      )}

      {(isRunning || elapsed === 0) && (
        <TimerInfo2>
          <SubTitle>{topMessage}</SubTitle>
          <MainTitle ifSelectedDateIsCurrentMonth={true}>
            <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {topGreen ? (topGreen > 0 ? topGreen?.toFixed(2) : 0) : 0}
          </MainTitle>
          <Ticker>{topTickerMessage}</Ticker>
          <SubTitle>{bottomMessage}</SubTitle>
          <MainTitle ifSelectedDateIsCurrentMonth={true}>
            <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {bottomGreen ? (bottomGreen > 0 ? bottomGreen?.toFixed(2) : 0) : 0}
          </MainTitle>
        </TimerInfo2>
      )}
      <StartStopContainer>
        {!(isRunning || elapsed > 0) && (
          <Button onClick={start} disabled={isRunning || elapsed > 0}>
            Start
          </Button>
        )}
        {isRunning && (
          <Button onClick={pause} disabled={!isRunning}>
            Pause
          </Button>
        )}
        {!(isRunning || elapsed === 0) && (
          <Button onClick={resume} disabled={isRunning || elapsed === 0}>
            Resume
          </Button>
        )}
        <Button onClick={reset}>Reset</Button>
      </StartStopContainer>
    </Container>
  );
}

const Ticker = styled.div`
  display: flex;
  align-items: center;
  color: #929498;
  justify-content: center;
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
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
  font-size: 1.5rem;
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${(props) =>
    props.ifSelectedDateIsCurrentMonth ? "#04b488" : "#53B5D9"};
`;

const TimerInfo2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  flex-direction: column;
  width: 100%;
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
    color: #fefefe;
    border: none;
    font-size: 1.25rem;
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
  width: 100%;
  font-size: 3rem;
  margin-bottom: ${(props) => (props?.marginHigh ? "2rem" : "")};
`;

const StartStopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
  padding: 1rem;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  margin-right: 1rem;
  border-radius: 4px;
  padding: 1rem;
  font-size: 2rem;
  background-color: #04b488;

  &:active {
    transform: translate(0px, 2px);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 2rem 1rem;
  min-height: 60vh;
  width: 100%;
  max-height: 60vh;
`;
