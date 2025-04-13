import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell } from "recharts";
import { capitalizeFirstLetter } from "../helpers/stringHelper";
import { formatIndianNumber } from "../helpers/moneyHelper";
import { FaRupeeSign } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { generateSimilarColor } from "../helpers/colorHelper";
import { ICON_CATEGORY } from "../helpers/iconHelper";

export default function Spending({ showEntry }) {
  const [allSpendings, setAllSpendings] = useState([]);
  const [selectedTier1, setSelectedTier1] = useState("family");

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
  }, [showEntry]);

  const now = new Date();

  const thisMonthSpendings = allSpendings.filter((s) => {
    const spendingDate = new Date(s.date);
    return (
      spendingDate.getFullYear() === now.getFullYear() &&
      spendingDate.getMonth() === now.getMonth() &&
      s?.type == selectedTier1
    );
  });

  const allCategoriesThisMonth = thisMonthSpendings?.map((spend) => {
    return spend?.category;
  });

  const CATEGORY_COLORS = {};

  allCategoriesThisMonth?.forEach((category) => {
    CATEGORY_COLORS[category] = generateSimilarColor();
  });

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
      <MainTop>
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
      </MainTop>
      <Top>
        <LeftTop>
          <Total>
            <TTop>Spent</TTop>
            <TBottom>
              <span
                style={{ fontSize: ".75rem", transform: "translateY(1px)" }}
              >
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
        <AllSpending>
          {allCategoriesThisMonth?.map((category) => {
            const timesThisMonth = allSpendings?.reduce(
              (acc, spend) => acc + (spend?.category == category ? 1 : 0),
              0
            );
            return (
              <SpendCard>
                <Left color={CATEGORY_COLORS[category]}>
                  {ICON_CATEGORY[category]}
                </Left>
                <Middle>
                  <MTop>{capitalizeFirstLetter(category)}</MTop>
                  <MBottom>
                    {timesThisMonth > 1
                      ? `${timesThisMonth} payments`
                      : `${timesThisMonth} payment`}
                  </MBottom>
                </Middle>
                <Right></Right>
              </SpendCard>
            );
          })}
        </AllSpending>
      </Bottom>
    </Container>
  );
}

const MTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const MBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  flex: 1;
  font-size: 0.9rem;
  color: #6c6d6f;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2rem;
  width: 45px;
  height: 45px;
  font-size: 1.75rem;
  background-color: #faf2e6;
  color: ${(props) => props.color};
`;

const Middle = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0.5rem 1rem;
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpendCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: #1f2125;
  border-radius: 0.5rem;
`;

const MainTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 0rem;
  transform: translateY(-3rem);
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
  padding: 2rem 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

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
  width: 15px;
  height: 15px;
  border-radius: 1rem;
  border: ${(props) => `4px solid ${props.color}`};
`;

const CatName = styled.div`
  display: flex;
  padding: 0rem 1rem;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  font-size: 0.9rem;
`;

const CatPercent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 0.9rem;
  color: #8f8f8f;
`;

const CatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;
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
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0rem;
`;

const BTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 1.1rem;
  padding-left: 1rem;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  transform: translateY(-4rem);
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  transform: translateY(-4rem);
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 80vh;
  flex-direction: column;
  max-height: 80vh;
  padding-top: 2rem;
  position: relative;
  padding: 2rem 1rem 1rem 1rem;
`;
