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
  calculateMoneyForPackages,
} from "../helpers/moneyHelper";

export default function Money() {
  const [allPackages, setAllPackages] = useState([]);
  const [values, setValues] = useState({ totalEarned: 0, pocketMoney: 0 });
  const [selectedTier1, setSelectedTier1] = useState("total");
  const [selectedTier2, setSelectedTier2] = useState(0);

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

  if (selectedTier1 == "total") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * TperSecond;
    }
    if (selectedTier2 == "minutes") {
      totalAmount = minutes * TperSecond;
    }
    if (selectedTier2 == "hours") {
      totalAmount = hours * TperSecond;
    }
    if (selectedTier2 == "days") {
      totalAmount = days * TperSecond;
    }
  }

  if (selectedTier1 == "pocketmoney") {
    if (selectedTier2 == "seconds") {
      totalAmount = seconds * PMperSecond;
    }
    if (selectedTier2 == "minutes") {
      totalAmount = minutes * PMperSecond;
    }
    if (selectedTier2 == "hours") {
      totalAmount = hours * PMperSecond;
    }
    if (selectedTier2 == "days") {
      totalAmount = days * PMperSecond;
    }
  }

  console.log(totalAmount, seconds, PMperSecond);

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
      </AmountInfo>
      <DisplayAmounts>
        <DisplayHeader>
          <Options>
            <Option
              selected={selectedTier2 == "seconds"}
              onClick={() => setSelectedTier2("seconds")}
            >
              Seconds
              {selectedTier2 == "seconds" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier2 == "minutes"}
              onClick={() => setSelectedTier2("minutes")}
            >
              Minutes
              {selectedTier2 == "minutes" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier2 == "hours"}
              onClick={() => setSelectedTier2("hours")}
            >
              Hours
              {selectedTier2 == "hours" && <SelectedDot></SelectedDot>}
            </Option>
            <Option
              selected={selectedTier2 == "days"}
              onClick={() => setSelectedTier2("days")}
            >
              Days
              {selectedTier2 == "days" && <SelectedDot></SelectedDot>}
            </Option>
          </Options>
        </DisplayHeader>
      </DisplayAmounts>
    </Container>
  );
}

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

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #61ce9c;
  margin-bottom: 2rem;
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
  min-height: 50vh;
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
