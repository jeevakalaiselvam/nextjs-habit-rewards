import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLOR_GOLD } from "../helpers/colorHelper";
import styled from "styled-components";

export default function LevelProgressChart({ dailyUnlocks, size }) {
  const data = dailyUnlocks;

  return (
    <Container>
      <Inner>
        <LineChart
          width={size ? size : 3600}
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
          <Line
            type="monotone"
            dataKey="Level"
            stroke={COLOR_GOLD}
            fill={COLOR_GOLD}
          />
        </LineChart>
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
  width: 100%;
`;
