import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLOR_GOLD } from "../helpers/colorHelper";
import styled from "styled-components";

export default function BarProgressChart({ dailyUnlocks, size }) {
  const data = dailyUnlocks;

  return (
    <Container>
      <Inner>
        <BarChart
          width={size ? size : 1200}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            fill="#7D7D7D"
            activeBar={<Rectangle fill="#7D7D7D" stroke="#7D7D7D00" />}
          />
        </BarChart>
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
