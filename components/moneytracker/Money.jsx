import axios from "axios";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { HiChartPie, HiCurrencyRupee } from "react-icons/hi";
import styled from "styled-components";
import {
  generateDailyTimestamps,
  generateHourlyTimestamps,
  generateMonthlyTimestamps,
  getDateInFormatDMY,
  getDaysInMonth,
  getFormattedDateWords,
  isInEarlierMonth,
  isSameMonthUTCZGMT,
} from "../helpers/dateHelper";
import {
  calculateEarnings,
  calculateEarnings1Today,
  calculateEarningsCurrentMonth,
  calculateEarningsEarlierMonths,
  calculateEarningsToday,
  calculateMoneyForPackages,
  formatIndianNumber,
} from "../helpers/moneyHelper";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import HabitTracker from "./HabitTracker";
import Timer from "../Timer";

export default function Money({ selectedDate, forceRefreshExpense }) {
  const [loading, setLoading] = useState(true);
  const [salaries, setAllSalaries] = useState([]);
  const [values, setValues] = useState({ totalEarned: 0, pocketMoney: 0 });
  const [valuesToday, setValuesToday] = useState({
    totalEarned: 0,
    pocketMoney: 0,
  });
  const [selectedTier1, setSelectedTier1] = useState("timer");
  const [selectedTier2, setSelectedTier2] = useState("hours");
  const [allSpendings, setAllSpendings] = useState([]);

  const refreshPackages = () => {
    setLoading(true);
    axios
      .get("/api/salary")
      .then((response) => {
        const data = response?.data;
        setAllSalaries(data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshPackages();
  }, []);

  const refreshSpendings = () => {
    setLoading(true);
    axios
      .get("/api/spend")
      .then((response) => {
        setAllSpendings(response?.data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshSpendings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedDate) {
        const currentMonthSalaries = salaries?.filter((salary) => {
          return isSameMonthUTCZGMT(salary?.date, selectedDate);
        });

        const totalCurrentMonthSalary = currentMonthSalaries?.reduce(
          (acc, sal) => acc + Number(sal?.salary),
          0
        );

        const today = new Date(); // actual current date

        const ifSelectedDateIsCurrentMonth =
          today?.getFullYear() === new Date(selectedDate).getFullYear() &&
          today?.getMonth() === new Date(selectedDate).getMonth();

        console.log(totalCurrentMonthSalary);

        if (ifSelectedDateIsCurrentMonth) {
          setValues(
            calculateEarningsCurrentMonth(
              totalCurrentMonthSalary,
              new Date(selectedDate)
            )
          );
        } else {
          setValues(
            calculateEarningsEarlierMonths(
              totalCurrentMonthSalary,
              selectedDate?.$d
            )
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [salaries, selectedDate]);

  const currentMonthSalaries = salaries?.filter((salary) => {
    return isSameMonthUTCZGMT(salary?.date, selectedDate);
  });

  const totalCurrentMonthSalary = currentMonthSalaries?.reduce(
    (acc, sal) => acc + Number(sal?.salary),
    0
  );

  const today = new Date(); // actual current date

  const ifSelectedDateIsCurrentMonth =
    today?.getFullYear() === new Date(selectedDate).getFullYear() &&
    today?.getMonth() === new Date(selectedDate).getMonth();

  const now = new Date(selectedDate);

  const allSpendingFamilyInMonth = allSpendings.filter((s) => {
    const spendingDate = new Date(s.date);
    return (
      spendingDate.getFullYear() === now.getFullYear() &&
      spendingDate.getMonth() === now.getMonth() &&
      s?.type == "family"
    );
  });

  const allSpendingPersonalInMonth = allSpendings.filter((s) => {
    const spendingDate = new Date(s.date);
    return (
      spendingDate.getFullYear() === now.getFullYear() &&
      spendingDate.getMonth() === now.getMonth() &&
      s?.type == "personal"
    );
  });

  const allSpendingFamilyInMonthAmount = allSpendingFamilyInMonth?.reduce(
    (acc, spend) => acc + Number(spend?.amount),
    0
  );

  const allSpendingPersonalInMonthAmount = allSpendingPersonalInMonth?.reduce(
    (acc, spend) => acc + Number(spend?.amount),
    0
  );

  let topGreen = 0;
  let bottomGreen = 0;
  let topTicker = 0;
  let bottomTicker = 0;
  let displayItems = [];
  let topMessage = "";
  let bottomMessage = "";
  let topTickerMessage = "";
  let bottomTickerMessage = "";
  let leftTitle = "LEFT TITLE";
  let rightTitle = "RIGHT TITLE";
  let leftAmount = 0;
  let rightAmount = 0;

  if (ifSelectedDateIsCurrentMonth) {
    //CURRENT MONTH SELECTION
    if (selectedTier1 == "income") {
      if (selectedTier2 == "days" || selectedTier2 == "hours") {
        topGreen = values?.totalSecondsInToday * values?.TperSecond;
        topTicker = values?.TperDay;
        bottomGreen = values?.totalSecondsInToday * values?.PMperSecond;
        bottomTicker = values?.PMperDay;
        leftAmount =
          values?.totalSecondsTillNow * values?.TperSecond -
          values?.totalSecondsTillNow * values?.PMperSecond;
        rightAmount = values?.totalSecondsTillNow * values?.PMperSecond;
        topTickerMessage = " / day";
        bottomTickerMessage = " / day";
        topMessage = "Family Today";
        bottomMessage = "Personal Today";
        leftTitle = "Family Total";
        rightTitle = "Personal Total";

        const dateOldFormat = getDateInFormatDMY(new Date(selectedDate?.$d));
        displayItems = generateDailyTimestamps(
          dateOldFormat,
          ifSelectedDateIsCurrentMonth
        );
      }
    }

    if (selectedTier1 == "expense") {
      if (selectedTier2 == "days" || selectedTier2 == "hours") {
        topGreen =
          values?.totalSecondsTillEnd * values?.TperSecond -
          values?.totalSecondsTillEnd * values?.PMperSecond -
          allSpendingFamilyInMonthAmount;
        topTicker = values?.TperDay - values?.PMperDay;
        bottomGreen =
          values?.totalSecondsTillEnd * values?.PMperSecond -
          allSpendingPersonalInMonthAmount;
        bottomTicker = values?.PMperDay;
        leftAmount = allSpendingFamilyInMonthAmount;
        rightAmount = allSpendingPersonalInMonthAmount;
        topTickerMessage = " / day";
        bottomTickerMessage = " / day";
        topMessage = "Family Balance";
        bottomMessage = "Personal Balance";
        leftTitle = "Family Expense";
        rightTitle = "Personal Expense";

        const dateOldFormat = getDateInFormatDMY(new Date(selectedDate?.$d));
        displayItems = generateDailyTimestamps(
          dateOldFormat,
          ifSelectedDateIsCurrentMonth
        );
      }
    }
  } else {
    if (selectedTier1 == "income") {
      if (selectedTier2 == "days" || selectedTier2 == "hours") {
        topGreen =
          values?.totalSecondsInToday * values?.TperSecond -
          values?.totalSecondsInToday * values?.PMperSecond;
        topTicker = values?.TperDay - values?.PMperDay;
        bottomGreen = values?.totalSecondsInToday * values?.PMperSecond;
        bottomTicker = values?.PMperDay;
        leftAmount =
          values?.seconds * values?.TperSecond -
          values?.seconds * values?.PMperSecond;
        rightAmount = values?.seconds * values?.PMperSecond;
        topTickerMessage = " / day";
        bottomTickerMessage = " / day";
        topMessage = "Family Today";
        bottomMessage = "Personal Today";
        leftTitle = "Family Total";
        rightTitle = "Personal Total";

        const dateOldFormat = getDateInFormatDMY(new Date(selectedDate?.$d));
        displayItems = generateDailyTimestamps(
          dateOldFormat,
          ifSelectedDateIsCurrentMonth
        );
      }
    }

    if (selectedTier1 == "expense") {
      if (selectedTier2 == "days" || selectedTier2 == "hours") {
        topGreen =
          values?.totalSecondsTillEnd * values?.TperSecond -
          values?.totalSecondsTillEnd * values?.PMperSecond -
          allSpendingFamilyInMonthAmount;
        topTicker = values?.TperDay - values?.PMperDay;
        bottomGreen =
          values?.totalSecondsTillEnd * values?.PMperSecond -
          allSpendingPersonalInMonthAmount;
        bottomTicker = values?.PMperDay;
        leftAmount = allSpendingFamilyInMonthAmount;
        rightAmount = allSpendingPersonalInMonthAmount;
        topTickerMessage = " / day";
        bottomTickerMessage = " / day";
        topMessage = "Family Balance";
        bottomMessage = "Personal Balance";
        leftTitle = "Family Expense";
        rightTitle = "Personal Expense";

        const dateOldFormat = getDateInFormatDMY(new Date(selectedDate?.$d));
        displayItems = generateDailyTimestamps(
          dateOldFormat,
          ifSelectedDateIsCurrentMonth
        );
      }
    }
  }

  displayItems = displayItems?.reverse();

  if (!loading && (selectedTier1 == "income" || selectedTier1 == "expense")) {
    return (
      <Container>
        <Options2>
          <Option
            selected={selectedTier1 == "income"}
            onClick={() => setSelectedTier1("income")}
          >
            Income
            {selectedTier1 == "income" && <SelectedDot></SelectedDot>}
          </Option>
          <Option
            selected={selectedTier1 == "expense"}
            onClick={() => setSelectedTier1("expense")}
          >
            Expense
            {selectedTier1 == "expense" && <SelectedDot></SelectedDot>}
          </Option>{" "}
          <Option
            selected={selectedTier1 == "timer"}
            onClick={() => setSelectedTier1("timer")}
          >
            Timer
            {selectedTier1 == "timer" && <SelectedDot></SelectedDot>}
          </Option>
        </Options2>
        <AmountInfo>
          <SubTitle>{topMessage}</SubTitle>
          <MainTitle
            ifSelectedDateIsCurrentMonth={ifSelectedDateIsCurrentMonth}
          >
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
            {(topTicker ? topTicker?.toFixed(0) : 0) + topTickerMessage}
          </Ticker>
        </AmountInfo>
        <BlueHeader>
          <LeftH>
            <TitleH>{leftTitle}</TitleH>
            <AmountH>
              <span style={{ fontSize: "1rem", transform: "translateY(1px)" }}>
                <FaIndianRupeeSign />
              </span>
              <span>
                {formatIndianNumber(
                  leftAmount ? (leftAmount > 0 ? leftAmount?.toFixed(0) : 0) : 0
                )}
              </span>
            </AmountH>
          </LeftH>
          <MiddleH></MiddleH>
          <RightH>
            <TitleH>{rightTitle}</TitleH>
            <AmountH>
              <span style={{ fontSize: "1rem", transform: "translateY(1px)" }}>
                <FaIndianRupeeSign />
              </span>
              <span>
                {" "}
                {formatIndianNumber(
                  rightAmount
                    ? rightAmount > 0
                      ? rightAmount?.toFixed(0)
                      : 0
                    : 0
                )}
              </span>
            </AmountH>
          </RightH>
        </BlueHeader>
        <DisplayAmounts>
          <DisplayHeader>
            <Options>
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
            <SubTitleInner>{bottomMessage}</SubTitleInner>
            <AmountInfo>
              <MainTitle
                ifSelectedDateIsCurrentMonth={ifSelectedDateIsCurrentMonth}
              >
                <span
                  style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}
                >
                  <FaIndianRupeeSign />
                </span>
                {bottomGreen ? bottomGreen?.toFixed(2) : 0}
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
                {(bottomTicker ? bottomTicker?.toFixed(0) : 0) +
                  bottomTickerMessage}
              </Ticker>
            </AmountInfo>
            {false && (
              <LineItems>
                {displayItems?.map((item, index) => {
                  return (
                    <SingleDisplayItem blink={index == 0}>
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
                        <DateInner>{item}</DateInner>
                        <MoneyInner>
                          <span
                            style={{
                              fontSize: ".9rem",
                              transform: "translateY(2px)",
                            }}
                          >
                            <FaIndianRupeeSign />
                          </span>
                          {tickerAmount
                            ? tickerAmount?.toFixed(0)
                            : tickerAmount}
                        </MoneyInner>
                      </SingleDisplayItemRight>
                    </SingleDisplayItem>
                  );
                })}
              </LineItems>
            )}
          </AllItems>
        </DisplayAmounts>
      </Container>
    );
  } else {
    if (loading) {
      return (
        <Container>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Container>
      );
    } else {
      if (selectedTier1 == "actuals") {
        return (
          <Container>
            <Options2>
              <Option
                selected={selectedTier1 == "income"}
                onClick={() => setSelectedTier1("income")}
              >
                Income
                {selectedTier1 == "income" && <SelectedDot></SelectedDot>}
              </Option>
              <Option
                selected={selectedTier1 == "expense"}
                onClick={() => setSelectedTier1("expense")}
              >
                Expense
                {selectedTier1 == "expense" && <SelectedDot></SelectedDot>}
              </Option>{" "}
              <Option
                selected={selectedTier1 == "timer"}
                onClick={() => setSelectedTier1("timer")}
              >
                Timer
                {selectedTier1 == "timer" && <SelectedDot></SelectedDot>}
              </Option>
            </Options2>
            <HabitTracker />
          </Container>
        );
      }
      if (selectedTier1 == "timer") {
        return (
          <Container>
            <Options2>
              <Option
                selected={selectedTier1 == "income"}
                onClick={() => setSelectedTier1("income")}
              >
                Income
                {selectedTier1 == "income" && <SelectedDot></SelectedDot>}
              </Option>
              <Option
                selected={selectedTier1 == "expense"}
                onClick={() => setSelectedTier1("expense")}
              >
                Expense
                {selectedTier1 == "expense" && <SelectedDot></SelectedDot>}
              </Option>{" "}
              <Option
                selected={selectedTier1 == "timer"}
                onClick={() => setSelectedTier1("timer")}
              >
                Timer
                {selectedTier1 == "timer" && <SelectedDot></SelectedDot>}
              </Option>
            </Options2>
            <Timer totalCurrentMonthSalary={totalCurrentMonthSalary} />
          </Container>
        );
      }
    }
  }
}

const TitleH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7db9f9;
`;

const AmountH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: #e3f6fe;
  font-size: 1.5rem;
`;

const LeftH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;

const MiddleH = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;
  height: 50px;
  background-color: #2982e3;
  border-radius: 4px;
`;

const RightH = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  flex-direction: column;
`;

const BlueHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 120px;
  padding: 1rem;
  transform: translateY(1.5rem);
  border-radius: 2rem 2rem 0 0;
  background-color: #126cd6;
  width: 110%;
  z-index: 4;
`;

const LineItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 30vh;
  margin-top: 2rem;
  padding: 0rem 0rem 3rem 0rem;
  max-height: 30vh;
  overflow: scroll;
  flex-direction: column;
  width: 100%;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

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
  justify-content: center;
  width: 10px;
  height: 10px;
  border-radius: 1rem;
  background-color: #fefefe;
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
  animation: ${(props) =>
    props?.blink ? "blink-smooth 1s infinite linear" : ""};
  @keyframes blink-smooth {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const AllItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
  padding: 0rem 0;
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
  padding: 0.5rem 0rem 1rem 0rem;
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
  padding: 1rem 1rem;
`;

const Options2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem 1rem 1rem 1rem;
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
  font-size: 1.5rem;
`;

const SubTitleInner = styled.div`
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

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  width: 110%;
  background-color: #1f2125;
  border-radius: 2rem 2rem 0 0;
  flex-direction: column;
  min-height: 38vh;
  position: relative;
  padding-top: 2rem;
  z-index: 12;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 80vh;
  flex-direction: column;
  max-height: 80vh;
  padding: 0rem 1rem 1rem 1rem;
  position: relative;
`;
