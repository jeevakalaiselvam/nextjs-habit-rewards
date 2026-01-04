import { Line } from "@ant-design/plots";
import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_PLATINUM,
  COLOR_SILVER,
} from "../helpers/colorHelper";

export default function MultiProgressChart({ dailyTypeBreakdown, size }) {
  const data = dailyTypeBreakdown;

  return (
    <Container>
      <Inner>
        <AreaChart
          width={size ? size : 1200}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          style={{ fontSize: ".75rem" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Bronze"
            stroke={COLOR_BRONZE}
            fill={COLOR_BRONZE}
          />
          <Area
            type="monotone"
            dataKey="Silver"
            stroke={COLOR_SILVER}
            fill={COLOR_SILVER}
          />
          <Area
            type="monotone"
            dataKey="Gold"
            stroke={COLOR_GOLD}
            fill={COLOR_GOLD}
          />
          <Area
            type="monotone"
            dataKey="Platinum"
            stroke={COLOR_PLATINUM}
            fill={COLOR_PLATINUM}
          />
        </AreaChart>
      </Inner>
    </Container>
  );
}

const Inner = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 100%;
  transform: translateX(-2rem);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 100%;
`;
