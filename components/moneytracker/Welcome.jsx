import styled from "styled-components";
import { getCurrentDayIdentifier } from "../helpers/dateHelper";

export default function Welcome() {
  let date = getCurrentDayIdentifier();

  return (
    <Container>
      <Name>Hello Jeeva!</Name>
      <Date>{date}</Date>
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
  width: 90%;
`;
