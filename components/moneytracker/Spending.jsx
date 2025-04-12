import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell } from "recharts";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function Spending() {
  const [allSpendings, setAllSpendings] = useState([]);

  const refreshSpendings = () => {
    axios
      .get("/api/spend")
      .then((response) => {
        setAllSpendings(response?.data);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    refreshSpendings();
  }, []);

  const now = new Date();

  const thisMonthSpendings = allSpendings.filter((s) => {
    const spendingDate = new Date(s.date);
    return (
      spendingDate.getFullYear() === now.getFullYear() &&
      spendingDate.getMonth() === now.getMonth()
    );
  });

  const allCategoriesThisMonth = thisMonthSpendings?.map((spend) => {
    return spend?.category;
  });

  const CATEGORY_COLORS = {
    food: "#FDAC46",
    movies: "#FE6662",
    clothing: "#3BD987",
    gadget: "#5474FD",
    games: "#8854FC",
  };

  const totalSpending = thisMonthSpendings?.reduce(
    (acc, spend) => acc + Number(spend?.amount),
    0
  );

  const data = thisMonthSpendings?.map((spending) => {
    return {
      name: spending?.category,
      value: (spending?.amount / totalSpending) * 100,
    };
  });

  return (
    <Container>
      <Top>
        <LeftTop>
          <Total>
            <TTop>Spent</TTop>
            <TBottom>
              <span style={{ fontSize: ".75rem" }}>
                <FaIndianRupeeSign />
              </span>
              {formatIndianNumber(totalSpending)}
            </TBottom>
          </Total>
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={0}
              stroke={"none"}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry?.name]}
                />
              ))}
            </Pie>
          </PieChart>
        </LeftTop>
        <RightTop>
          {allCategoriesThisMonth?.map((category) => {
            const percentage =
              (allSpendings
                ?.filter((spend) => spend?.category == category)
                ?.reduce((acc, spend) => acc + spend?.amount, 0) /
                totalSpending) *
              100;
            return (
              <CatItem>
                <CatIcon color={CATEGORY_COLORS[category]}></CatIcon>
                <CatName>{capitalizeFirstLetter(category)}</CatName>
                <CatPercent>{percentage.toFixed(1)} %</CatPercent>
              </CatItem>
            );
          })}
        </RightTop>
      </Top>
      <Bottom>
        <BTitle>Spends by Category</BTitle>
        <AllSpending></AllSpending>
      </Bottom>
    </Container>
  );
}

const TTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606060;
  margin-bottom: 0.5rem;
`;

const TBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  flex-direction: column;
  transform: translate(-50%, -50%);
  top: 50%;
`;

const CatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 1rem;
  border: ${(props) => `4px solid ${props.color}`};
`;

const CatName = styled.div`
  display: flex;
  padding: 0rem 1rem;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const CatPercent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const CatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const LeftTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
`;

const RightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 2;
`;

const AllSpending = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const BTitle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  transform: translateY(-3rem);
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 65vh;
  max-height: 65vh;
`;
