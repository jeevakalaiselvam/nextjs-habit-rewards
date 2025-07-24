import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import styled from "styled-components";
import { formatNumberWithCommas } from "../helpers/achHelper";

export default function DonutChart({ data, center, centerCount }) {
  const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
  };

  const pieData = data?.filter((item) => item?.value > 0);

  return (
    <MainContainer>
      <PieLeft>
        <PieChart
          series={[
            {
              innerRadius: 50,
              outerRadius: 100,
              data: pieData,
              arcLabel: "",
            },
          ]}
          {...settings}
        />
        <PieCircle></PieCircle>
        <PieCircleCenter>{center?.toUpperCase()}</PieCircleCenter>
        <PieCircleCenterCount>
          {formatNumberWithCommas(centerCount)}
        </PieCircleCenterCount>
      </PieLeft>
      <PieRight>
        {data?.map((item) => {
          return (
            <StripeContainer>
              <Stripe color={item?.color}></Stripe>
              <Data>
                {item?.label} ({formatNumberWithCommas(item?.value)})
              </Data>
            </StripeContainer>
          );
        })}
      </PieRight>
    </MainContainer>
  );
}

const Data = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  padding: 4px 0 4px 5px;
  list-style-type: none;
  font-size: 0.9rem;
  color: #646464;
`;

const Stripe = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5px;
  cursor: pointer;
  height: 30px;
  background-color: ${(props) => props.color};
`;

const StripeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.25rem;
  width: 100%;
  cursor: pointer;
  height: 30px;
`;

const PieCircleCenterCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 45%;
  left: 50%;
  font-size: 1.25rem;
  transform: translate(-50%, -50%);
`;

const PieCircleCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 55%;
  color: #646464;
  font-size: 0.8rem;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PieCircle = styled.div`
  width: 100px;
  color: #646464;
  height: 100px;
  border-radius: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 0.8rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fefefe;
`;

const PieLeft = styled.div`
  width: 300px;
  padding: 1rem 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PieRight = styled.div`
  width: 150px;
  padding: 1rem 0rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const MainContainer = styled.div`
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #eee;
  margin: 1rem;
  cursor: pointer;
`;
