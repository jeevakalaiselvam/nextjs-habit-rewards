import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell } from "recharts";
import { capitalizeFirstLetter } from "../helpers/stringHelper";

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
    food: "#FF7043",
    movies: "#7E57C2",
    clothing: "#42A5F5",
    gadget: "#26A69A",
    games: "#EC407A",
  };

  const totalSpending = thisMonthSpendings?.reduce(
    (acc, spend) => acc + spend?.amount,
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
      {true && JSON.stringify(data)}
      <Top>
        <LeftTop>
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={60}
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
                <CatIcon></CatIcon>
                <CatName>{capitalizeFirstLetter(category)}</CatName>
                <CatPercent>{percentage} %</CatPercent>
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

const CatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CatName = styled.div`
  display: flex;
  padding: 0rem 1rem;
  align-items: center;
  justify-content: center;
`;

const CatPercent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeftTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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
  justify-content: center;
  width: 100%;
  flex: 1;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  flex: 2;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 60vh;
  max-height: 60vh;
`;
