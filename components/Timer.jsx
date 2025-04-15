import styled from "styled-components";
import {
  getDateFromTime24,
  getDaysInMonth,
  getRemainingTimeTo8Hours,
  timeElapsedFrom,
} from "./helpers/dateHelper";
import { useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { TimePicker } from "antd";
import dayjs from "dayjs";

export default function Timer({ totalCurrentMonthSalary }) {
  const [timerString, setTimerString] = useState("");
  const [timeHours, setTimeHours] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");

  let isAlreadyStarted = false;
  let alreadyStartedTimeInStorage = "";
  let alreadyStartedTime = "";

  if (window) {
    if (localStorage.getItem("TIMER_START")) {
      isAlreadyStarted = true;
      alreadyStartedTimeInStorage = localStorage.getItem("TIMER_START");
      alreadyStartedTime = new Date(alreadyStartedTime);
    } else {
      isAlreadyStarted = false;
    }
  }

  const startTimer = () => {
    if (window) {
      localStorage.setItem(
        "TIMER_START",
        getDateFromTime24(timeHours, timeMinutes)
      );
      let timeStarted = localStorage.getItem("TIMER_START");
      setTimerString(timeStarted);
    }
  };
  const stopTimer = () => {
    setTimeHours("");
    setTimeMinutes("");
    if (window) {
      localStorage.setItem("TIMER_START", "");
      setTimerString("");
      localStorage.setItem("TIMER_END", new Date()?.toString());
    }
  };

  useEffect(() => {
    if (timerString?.length > 0) {
      let timer = setInterval(() => {
        let timerString = "";

        if (alreadyStartedTime) {
          timerString = timeElapsedFrom(alreadyStartedTimeInStorage);
          console.log(timerString);
          setTimerString(timerString);
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [timerString]);

  let hours = timerString?.split(" ")?.[0];
  let minutes = timerString?.split(" ")?.[1];
  let seconds = timerString?.split(" ")?.[2];
  let timeDifference = 0;

  const { hoursT, minutesT, secondsT } = getRemainingTimeTo8Hours(
    hours,
    minutes,
    seconds
  );

  if (alreadyStartedTime) {
    timeDifference =
      Number(new Date() - new Date(alreadyStartedTimeInStorage)) / 1000;
    timeDifference =
      timeDifference > 8 * 60 * 60 ? 8 * 60 * 60 : timeDifference;
  }

  let perSecond = (
    totalCurrentMonthSalary /
    getDaysInMonth(new Date()) /
    (8 * 60 * 60)
  )?.toFixed(10);

  let topGreen = timeDifference * perSecond;
  let topTicker = Number(perSecond);
  let topMessage = "Earned Today";
  let bottomMessage = "Remaining Today";
  let bottomGreen =
    (8 * 60 * 60 - (timeDifference < 0 ? 0 : timeDifference)) * perSecond;
  let topTickerMessage = " / second";

  const format = "HH:mm";

  return (
    <Container>
      {!isAlreadyStarted && (
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
      {isAlreadyStarted && (
        <TimerInfo>
          <Hour>{hoursT}h</Hour>
          <Min>{minutesT}m</Min>
          <Sec>{secondsT}s</Sec>
        </TimerInfo>
      )}
      <TimerInfo2>
        <SubTitle>{topMessage}</SubTitle>
        <MainTitle ifSelectedDateIsCurrentMonth={true}>
          <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
            <FaIndianRupeeSign />
          </span>
          {topGreen ? (topGreen > 0 ? topGreen?.toFixed(2) : 0) : 0}
        </MainTitle>
        <Ticker>
          <span
            style={{
              fontSize: ".9rem",
              transform: "translateY(2px)",
            }}
          >
            <FaIndianRupeeSign />
          </span>
          {(topTicker ? topTicker?.toFixed(2) : 0) + topTickerMessage}
        </Ticker>
        <SubTitle>{bottomMessage}</SubTitle>
        <MainTitle ifSelectedDateIsCurrentMonth={true}>
          <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
            <FaIndianRupeeSign />
          </span>
          {bottomGreen ? (bottomGreen > 0 ? bottomGreen?.toFixed(2) : 0) : 0}
        </MainTitle>
      </TimerInfo2>
      <StartStopContainer>
        {!isAlreadyStarted && (
          <Start
            disabled={timeHours?.length == 0}
            onClick={() => {
              if (timeHours?.length != 0) {
                startTimer();
              }
            }}
          >
            START
          </Start>
        )}
        {isAlreadyStarted && timeDifference < 8 * 60 * 60 && (
          <Stop
            onClick={() => {
              stopTimer();
            }}
          >
            RESTART
          </Stop>
        )}

        {isAlreadyStarted && timeDifference >= 8 * 60 * 60 && (
          <Stop
            onClick={() => {
              stopTimer();
            }}
          >
            COMPLETE
          </Stop>
        )}
      </StartStopContainer>
    </Container>
  );
}

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

const StartStopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 2rem 1rem;
  min-height: 60vh;
  max-height: 60vh;
`;
