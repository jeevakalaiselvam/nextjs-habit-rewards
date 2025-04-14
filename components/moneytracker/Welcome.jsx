import styled from "styled-components";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Welcome({ title, date, setDate }) {
  return (
    <Container>
      <Name>{title}</Name>
      <DatePicker
        allowClear={false}
        style={{
          width: "35%",
          backgroundColor: "#1f2125",
          outline: "none",
          border: "none",
        }}
        defaultValue={dayjs(date)}
        format="MMMM, YYYY"
        value={dayjs(date)}
        picker="month"
        onChange={(e) => {
          setDate(dayjs(e));
        }}
      />
    </Container>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  justify-content: flex-start;
  font-size: 2rem;
  text-shadow: 0 0 1px white, 0 0 1px rgba(255, 255, 255.25),
    0 0 1px rgba(255, 255, 255.25);
`;

const Date = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.3rem 0.3rem;
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: #252525;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90%;
`;
