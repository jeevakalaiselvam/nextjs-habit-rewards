import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getDaysInMonth } from "./helpers/dateHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";

const STORAGE_KEYS = {
  startTime: "timer-start-time",
  elapsed: "timer-elapsed",
  status: "timer-status",
  presetTime: "preset-time",
};

export default function Timer({ totalCurrentMonthSalary }) {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState("stopped"); // 'running', 'paused', 'stopped'
  const intervalRef = useRef(null);
  const [timeHours, setTimeHours] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedStatus = localStorage.getItem(STORAGE_KEYS.status);
    const savedElapsed =
      parseInt(localStorage.getItem(STORAGE_KEYS.elapsed), 10) || 0;
    const savedStart = parseInt(
      localStorage.getItem(STORAGE_KEYS.startTime),
      10
    );

    if (savedStatus === "running" && savedStart) {
      const timePassed = Date.now() - savedStart;
      setElapsed(savedElapsed + timePassed);
      startInterval(savedStart, savedElapsed);
    } else {
      setElapsed(savedElapsed);
    }

    setStatus(savedStatus || "stopped");
    return () => clearInterval(intervalRef.current);
  }, []);

  const startInterval = (startTime, previousElapsed = 0) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const savedElapsed =
        parseInt(localStorage.getItem(STORAGE_KEYS.presetTime), 10) || 0;
      setElapsed(previousElapsed + 0 + (Date.now() - startTime));
    }, 1000);
  };

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
    const elapsedSeconds = Math.floor(diffMs);

    return elapsedSeconds;
  };

  const handleStart = () => {
    const startTime = Date.now();
    let preSetElapsed = getElapsedSinceTodayTime(timeHours, timeMinutes);
    localStorage.setItem(STORAGE_KEYS.presetTime, preSetElapsed);
    localStorage.setItem(STORAGE_KEYS.startTime, startTime);
    localStorage.setItem(STORAGE_KEYS.elapsed, "0");
    localStorage.setItem(STORAGE_KEYS.status, "running");
    setElapsed(0);
    setStatus("running");
    startInterval(startTime, preSetElapsed);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    localStorage.setItem(STORAGE_KEYS.elapsed, elapsed.toString());
    localStorage.setItem(STORAGE_KEYS.status, "paused");
    setStatus("paused");
  };

  const handleResume = () => {
    const resumeTime = Date.now();
    localStorage.setItem(STORAGE_KEYS.startTime, resumeTime);
    localStorage.setItem(STORAGE_KEYS.status, "running");
    setStatus("running");
    startInterval(resumeTime, elapsed);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    localStorage.removeItem(STORAGE_KEYS.startTime);
    localStorage.removeItem(STORAGE_KEYS.elapsed);
    localStorage.setItem(STORAGE_KEYS.status, "stopped");
    setElapsed(0);
    setStatus("stopped");
  };

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

  let secondsElapsed = elapsed / 1000;
  let topGreen = secondsElapsed * perSecond;
  let topTicker = Number(perSecond);
  let topMessage = "Earned Today";
  let bottomMessage = "Remaining Today";
  let bottomGreen =
    (8 * 60 * 60 - (secondsElapsed < 0 ? 0 : secondsElapsed)) * perSecond;
  let topTickerMessage = Math.floor(Number(topGreen) / 500) + " Task Closed";

  let totalTime = 8 * 60 * 60;
  let timeLeftInToday = getSecondsLeftToday();
  let timeAlreadyCompleted = secondsElapsed;
  let timeNeeded = totalTime - timeAlreadyCompleted;

  return (
    <Container>
      {status === "stopped" && (
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

      <TimerInfo2>
        <MoneyLeft>
          {status === "running" && <SubTitle2>{topMessage}</SubTitle2>}
          {status === "running" && (
            <MainTitle ifSelectedDateIsCurrentMonth={true}>
              <span style={{ fontSize: "1rem", transform: "translateY(3px)" }}>
                <FaIndianRupeeSign />
              </span>
              {topGreen ? (topGreen > 0 ? topGreen?.toFixed(1) : 0) : 0}
            </MainTitle>
          )}
        </MoneyLeft>
        <MoneyRight>
          <SubTitle2>{bottomMessage}</SubTitle2>
          <MainTitle ifSelectedDateIsCurrentMonth={true}>
            <span style={{ fontSize: "1rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {bottomGreen ? (bottomGreen > 0 ? bottomGreen?.toFixed(1) : 0) : 0}
          </MainTitle>
        </MoneyRight>
      </TimerInfo2>
      <IndividualContainer>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Analysis"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "stopped" && (
            <PAButton
              onClick={handleStart}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Start
            </PAButton>
          )}
          {status === "running" && (
            <PAButton
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Pause
            </PAButton>
          )}
          {status === "paused" && (
            <PAButton
              onClick={handleResume}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Resume
            </PAButton>
          )}
          {(status === "running" || status === "paused") && (
            <PAButtonReset
              onClick={handleStop}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reset
            </PAButtonReset>
          )}
        </SingleEntry>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Tracking"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "running" && <PAButton>START</PAButton>}
        </SingleEntry>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Calls"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "running" && <PAButton>START</PAButton>}
        </SingleEntry>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Bugs"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "running" && <PAButton>START</PAButton>}
        </SingleEntry>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Build"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "running" && <PAButton>START</PAButton>}
        </SingleEntry>
        <SingleEntry>
          {status === "running" && <SubTitle>{"Total Time"}</SubTitle>}
          {status === "running" && (
            <TimerInfo marginHigh={!status === "running"}>
              <Hour>{getHMS(elapsed)?.hours}h</Hour>
              <Min>{getHMS(elapsed)?.minutes}m</Min>
              <Sec>{getHMS(elapsed)?.seconds}s</Sec>
            </TimerInfo>
          )}
          {status === "running" && <PAButton>START</PAButton>}
        </SingleEntry>
      </IndividualContainer>

      {status === "paused" && <SubTitle>{""}</SubTitle>}
      {status === "paused" && (
        <TimerInfo marginHigh={!status === "paused"}>
          <Hour>{getHMS(timeNeeded * 1000)?.hours}h</Hour>
          <Min>{getHMS(timeNeeded * 1000)?.minutes}m</Min>
          <Sec>{getHMS(timeNeeded * 1000)?.seconds}s</Sec>
        </TimerInfo>
      )}

      {status === "paused" && <SubTitle>{"Time Left"}</SubTitle>}
      {status === "paused" && (
        <TimerInfo marginHigh={!status === "paused"} danger={true}>
          <Hour>{getHMS(timeLeftInToday * 1000)?.hours}h</Hour>
          <Min>{getHMS(timeLeftInToday * 1000)?.minutes}m</Min>
          <Sec>{getHMS(timeLeftInToday * 1000)?.seconds}s</Sec>
        </TimerInfo>
      )}

      <Ticker>{topTickerMessage}</Ticker>
      <StartStopContainer>
        {status === "stopped" && (
          <Button
            onClick={handleStart}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start
          </Button>
        )}
        {status === "running" && (
          <Button
            onClick={handlePause}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Pause
          </Button>
        )}
        {status === "paused" && (
          <Button
            onClick={handleResume}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Resume
          </Button>
        )}
        {(status === "running" || status === "paused") && (
          <ButtonReset
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Reset
          </ButtonReset>
        )}
      </StartStopContainer>
    </Container>
  );
}

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
  color: #4f4f4f;
  flex: 1;
  transform: translateX(6px);
  padding: 1rem;
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
  margin-bottom: 1rem;
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
  flex: 1;
  margin-bottom: ${(props) => (props?.marginHigh ? "1rem" : "")};
  color: ${(props) => (props.danger ? "#fe6662" : "")};
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
  margin-right: 1rem;
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
