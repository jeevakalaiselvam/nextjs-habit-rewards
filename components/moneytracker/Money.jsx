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
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Money() {
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [values, setValues] = useState({ totalEarned: 0, pocketMoney: 0 });
  const [valuesToday, setValuesToday] = useState({
    totalEarned: 0,
    pocketMoney: 0,
  });
  const [selectedTier1, setSelectedTier1] = useState("family");
  const [selectedTier2, setSelectedTier2] = useState("minutes");

  const refreshPackages = () => {
    setLoading(true);
    axios
      .get("/api/package")
      .then((response) => {
        const data = response?.data;
        setAllPackages(data);
        setLoading(false);
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
  let perMessage = "";
  let subText = "";

  if (selectedTier1 == "family") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperSecond;
      totalAmountToday =
        valuesToday?.seconds * valuesToday?.TperSecond -
        valuesToday.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.TperSecond;
      perMessage = " / second";
      subText = "Family ";
    }
    if (selectedTier2 == "minutes") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperMinute;
      totalAmountToday =
        valuesToday?.seconds * valuesToday?.TperSecond -
        valuesToday.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.TperMinute;
      perMessage = " / minute";
      subText = "Family ";
    }
    if (selectedTier2 == "hours") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperHour;
      totalAmountToday =
        valuesToday?.seconds * valuesToday?.TperSecond -
        valuesToday.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.TperHour;
      perMessage = " / hour";
      subText = "Family ";
    }
    if (selectedTier2 == "days") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperDay;
      totalAmountToday =
        valuesToday?.seconds * valuesToday?.TperSecond -
        valuesToday.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.TperDay;
      perMessage = " / day";
      subText = "Family ";

      displayItems = new Array(days)
        ?.fill(1)
        ?.map((_, index) => {
          return 1 + index;
        })
        ?.map((countToMove) => {
          let firstEntry = allPackages?.[0];
          const dateOldFormat = getDateInFormatDMY(new Date(firstEntry?.date));
          const [day, month, year] = dateOldFormat.split("-").map(Number);
          const letStartDate = new Date(year, month - 1, 1 + (countToMove - 1));
          return letStartDate;
        })
        ?.reverse();
    }
    if (selectedTier2 == "months") {
      totalAmount = seconds * TperSecond;
      tickerAmount = TperMonth;
      totalAmountToday =
        valuesToday?.seconds * valuesToday?.TperSecond -
        valuesToday.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.TperMonth;
      perMessage = " / month";
      subText = "Family ";
    }
  }

  if (selectedTier1 == "personal") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperSecond;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperSecond;
      perMessage = " / second";
      subText = "Personal ";
    }
    if (selectedTier2 == "minutes") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperMinute;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperMinute;
      perMessage = " / minute";
      subText = "Personal ";
    }
    if (selectedTier2 == "hours") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperHour;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperHour;
      perMessage = " / hour";
      subText = "Personal ";
    }
    if (selectedTier2 == "days") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperDay;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperDay;
      perMessage = " / day";
      subText = "Personal ";
    }
    if (selectedTier2 == "months") {
      totalAmount = seconds * PMperSecond;
      tickerAmount = PMperMonth;
      totalAmountToday = valuesToday?.seconds * valuesToday?.PMperSecond;
      tickerAmountToday = valuesToday?.PMperMonth;
      perMessage = " / month";
      subText = "Personal ";
    }
  }

  if (!loading) {
    return (
      <Container>
        <AmountInfo>
          <Options>
            <Option
              selected={selectedTier1 == "family"}
              onClick={() => setSelectedTier1("family")}
            >
              Family
              {selectedTier1 == "family" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier1 == "personal"}
              onClick={() => setSelectedTier1("personal")}
            >
              Personal
              {selectedTier1 == "personal" && <SelectedDot></SelectedDot>}
            </Option>
          </Options>
          <SubTitle>{subText} Month</SubTitle>
          <MainTitle>
            <span style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}>
              <FaIndianRupeeSign />
            </span>
            {totalAmount ? totalAmount?.toFixed(2) : 0}
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
            {(tickerAmountToday ? tickerAmountToday?.toFixed(2) : "0") +
              perMessage}
          </Ticker>
        </AmountInfo>
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
              </Option>{" "}
              <Option
                selected={selectedTier2 == "months"}
                onClick={() => setSelectedTier2("months")}
              >
                1 Month
                {selectedTier2 == "months" && <SelectedDot></SelectedDot>}
              </Option>
            </Options>
          </DisplayHeader>
          <AllItems>
            <SubTitleInner>{subText} Today</SubTitleInner>
            <AmountInfo>
              <MainTitle>
                <span
                  style={{ fontSize: "2.25rem", transform: "translateY(3px)" }}
                >
                  <FaIndianRupeeSign />
                </span>
                {totalAmountToday ? totalAmountToday?.toFixed(2) : 0}
              </MainTitle>
              {false && (
                <Ticker>
                  <span
                    style={{
                      fontSize: ".9rem",
                      transform: "translateY(2px)",
                    }}
                  >
                    <FaIndianRupeeSign />
                  </span>
                  {(tickerAmountToday ? tickerAmountToday?.toFixed(2) : "0") +
                    perMessage}
                </Ticker>
              )}
            </AmountInfo>
            <LineItems>
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
                        {tickerAmount?.toFixed(0)}
                      </MoneyInner>
                    </SingleDisplayItemRight>
                  </SingleDisplayItem>
                );
              })}
            </LineItems>
          </AllItems>
        </DisplayAmounts>
      </Container>
    );
  } else {
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  }
}

const LineItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 30vh;
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
`;

const AllItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 90%;
  padding: 1rem 0;
`;

const Ticker = styled.div`
  display: flex;
  align-items: center;
  color: #929498;
  justify-content: center;
  transform: translateY(-0.5rem);
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
  min-height: 55vh;
  transform: translateY(8rem);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  min-height: 65vh;
  max-height: 65vh;
`;
