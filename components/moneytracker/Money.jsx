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
  const [totalEarned, setTotalEarned] = useState(0);

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

  const totalMoney = calculateEarnings(allPackages);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalEarned(calculateEarnings(allPackages));
    }, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, [allPackages]);

  return (
    <Container>
      <AmountInfo>
        <SubTitle>Balance</SubTitle>
        <MainTitle>
          <span style={{ fontSize: "3rem", transform: "translateY(3px)" }}>
            <FaIndianRupeeSign />
          </span>
          {totalEarned?.toFixed(2)}
        </MainTitle>
      </AmountInfo>
      <DisplayAmounts></DisplayAmounts>
    </Container>
  );
}

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
`;

const AmountInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 30vh;
  min-width: 100%;
  flex-direction: column;
  transform: translateX(-2px);
`;

const DisplayAmounts = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 110%;
  background-color: #1f2125;
  border-radius: 2rem 2rem 0 0;
  flex-direction: column;
  min-height: 60vh;
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
