import axios from "axios";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { HiChartPie, HiCurrencyRupee } from "react-icons/hi";
import styled from "styled-components";
import {
  getDateInFormatDMY,
  getFormattedDateWords,
} from "../helpers/dateHelper";
import {
  calculateEarnings,
  calculateEarningsToday,
  calculateMoneyForPackages,
} from "../helpers/moneyHelper";

export default function Money() {
  const [allPackages, setAllPackages] = useState([]);
  const [values, setValues] = useState({ totalEarned: 0, pocketMoney: 0 });
  const [valuesToday, setValuesToday] = useState({
    totalEarned: 0,
    pocketMoney: 0,
  });
  const [selectedTier1, setSelectedTier1] = useState("total");
  const [selectedTier2, setSelectedTier2] = useState("minutes");

  const refreshPackages = () => {
    axios
      .get("/api/package")
      .then((response) => {
        const data = response?.data;
        setAllPackages(data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshPackages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(calculateEarnings(allPackages));
      setValuesToday(calculateEarningsToday(allPackages));
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [allPackages]);

  const {
    totalEarned,
    pocketMoneytotalEarned,
    remainingtotalEarned,
    TperSecond,
    TperMinute,
    TperHour,
    TperDay,
    TperMonth,
    TperYear,
    PMperSecond,
    PMperMinute,
    PMperHour,
    PMperDay,
    PMperMonth,
    PMperYear,
    seconds,
    minutes,
    hours,
    days,
    months,
  } = values;

  let totalAmount = 0;
  let totalAmountToday = 0;
  let tickerAmount = 0;
  let tickerAmountToday = 0;
  let displayItems = [];

  console.log({ values, valuesToday });

  if (selectedTier1 == "total") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperSecond;
      totalAmountToday = valuesToday?.seconds * valuesToday?.TperSecond;
      tickerAmountToday = valuesToday?.TperSecond;
    }
    if (selectedTier2 == "minutes") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperMinute;
      totalAmountToday = valuesToday?.seconds * valuesToday?.TperSecond;
      tickerAmountToday = valuesToday?.TperMinute;
    }
    if (selectedTier2 == "hours") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperHour;
      totalAmountToday = valuesToday?.seconds * valuesToday?.TperSecond;
      tickerAmountToday = valuesToday?.TperHour;
    }
    if (selectedTier2 == "days") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperDay;
      totalAmountToday = valuesToday?.seconds * valuesToday?.TperSecond;
      tickerAmountToday = valuesToday?.TperDay;
    }
  }

  if (selectedTier1 == "pocketmoney") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperSecond;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperSecond;
    }
    if (selectedTier2 == "minutes") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperMinute;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperMinute;
    }
    if (selectedTier2 == "hours") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperHour;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperHour;
    }
    if (selectedTier2 == "days") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperDay;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperDay;
    }
  }

  return (
    <Container>
      <AmountInfo>
        <Options>
          <Option
            selected={selectedTier1 == "total"}
            onClick={() => setSelectedTier1("total")}
          >
            Total
            {selectedTier1 == "total" && <SelectedDot></SelectedDot>}
          </Option>
          <Option
            selected={selectedTier1 == "pocketmoney"}
            onClick={() => setSelectedTier1("pocketmoney")}
          >
            Pocket Money
            {selectedTier1 == "pocketmoney" && <SelectedDot></SelectedDot>}
          </Option>
        </Options>
        <SubTitle>Balance</SubTitle>
        <MainTitle>
          <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
            <FaIndianRupeeSign />
          </span>
          {totalAmount?.toFixed(2)}
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
          {tickerAmount?.toFixed(2)}
        </Ticker>
      </AmountInfo>
      <DisplayAmounts>
        <DisplayHeader>
          <Options>
            <Option
              selected={selectedTier2 == "minutes"}
              onClick={() => setSelectedTier2("minutes")}
            >
              1 Minute
              {selectedTier2 == "minutes" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier2 == "hours"}
              onClick={() => setSelectedTier2("hours")}
            >
              1 Hour
              {selectedTier2 == "hours" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier2 == "days"}
              onClick={() => setSelectedTier2("days")}
            >
              1 Day
              {selectedTier2 == "days" && <SelectedDot></SelectedDot>}
            </Option>
          </Options>
        </DisplayHeader>
        <AllItems>
          <SubTitleInner>Today</SubTitleInner>
          <AmountInfo>
            <MainTitle>
              <span
                style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}
              >
                <FaIndianRupeeSign />
              </span>
              {totalAmountToday?.toFixed(2)}
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
              {tickerAmountToday?.toFixed(2)}
            </Ticker>
          </AmountInfo>
          {displayItems?.map((item, index) => {
            return (
              <SingleDisplayItem>
                <SingleDisplayItemLeft>
                  {<TopLine hide={index == 0}></TopLine>}
                  <CenterCircle></CenterCircle>
                  {
                    <BottomLine
                      hide={index == displayItems?.length}
                    ></BottomLine>
                  }
                </SingleDisplayItemLeft>
                <SingleDisplayItemRight>
                  <DateInner>{getDateInFormatDMY(item)}</DateInner>
                  <MoneyInner>
                    <span
                      style={{
                        fontSize: ".9rem",
                        transform: "translateY(2px)",
                      }}
                    >
                      <FaIndianRupeeSign />
                    </span>
                    {tickerAmount}
                  </MoneyInner>
                </SingleDisplayItemRight>
              </SingleDisplayItem>
            );
          })}
        </AllItems>
      </DisplayAmounts>
    </Container>
  );
}

const TopLine = styled.div`
  display: flex;
  align-items: center;
  width: 1px;
  height: 20px;
  background-color: #fefefe;
  justify-content: center;
  opacity: ${(props) => (props?.hide ? "0" : "1")};
`;

const CenterCircle = styled.div`
  display: flex;
  align-items: center;
  width: 10px;
  height: 10px;
  border-radius: 1rem;
  background-color: #fefefe;
  justify-content: center;
`;

const BottomLine = styled.div`
  display: flex;
  align-items: center;
  width: 1px;
  height: 20px;
  background-color: #fefefe;
  justify-content: center;
`;

const DateInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const MoneyInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #04b488;
  flex: 1;
`;

const SingleDisplayItemLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  flex-direction: column;
`;

const SingleDisplayItemRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: #2c2e33;
  border-radius: 4px;
  padding: 0.5rem;
`;

const SingleDisplayItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-right: 1rem;
`;

const AllItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
  max-height: 40vh;
  padding: 1rem 0;
  overflow: scroll;
`;

const Ticker = styled.div`
  display: flex;
  align-items: center;
  color: #04b488;
  justify-content: center;
  transform: translateY(-0.5rem);
  @keyframes blink-smooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  margin: 1rem;
`;

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 50%;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
`;

const SubTitleInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  transform: translateX(6px);
  padding: 1rem;
`;

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #04b488;
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 10vh;
  min-width: 100%;
  flex-direction: column;
  transform: translateX(-2px);
`;

const DisplayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const DisplayAmounts = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;
  width: 110%;
  background-color: #1f2125;
  border-radius: 2rem 2rem 0 0;
  flex-direction: column;
  min-height: 48vh;
  transform: translateY(3rem);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 73vh;
  max-height: 73vh;
`;
