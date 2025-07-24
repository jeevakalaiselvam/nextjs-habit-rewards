import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import styled from "styled-components";

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

export default function DonutChart({ data, center, centerCount }) {
  return (
    <MainContainer>
      <PieLeft>
        <PieChart
          series={[
            { innerRadius: 50, outerRadius: 100, data, arcLabel: "value" },
          ]}
          {...settings}
        />
        <PieCircle></PieCircle>
        <PieCircleCenter>{center}</PieCircleCenter>
        <PieCircleCenterCount>{centerCount}</PieCircleCenterCount>
      </PieLeft>
      <PieRight>
        {data?.map((item) => {
          return (
            <StripeContainer>
              <Stripe color={item?.color}></Stripe>
              <Data>
                {item?.label} ({item?.value})
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
  justify-content: center;
  width: 300px;
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
  transform: translate(-50%, -50%);
`;

const PieCircleCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PieCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fefefe;
`;

const PieLeft = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PieRight = styled.div`
  width: 150px;
  height: 300px;
  display: flex;
  align-items: center;
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
