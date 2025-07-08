import styled from "styled-components";
import { COLOR_BLUE_DARK } from "../helpers/colorHelper";

export default function Atom() {
  return (
    <Container>
      <Top>TOP</Top>
      <Content>CONTENT</Content>
      <Bottom>BOTTOM</Bottom>
    </Container>
  );
}

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  background-color: ${COLOR_BLUE_DARK};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0.5rem;
  flex: 1;
  width: 100%;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  background-color: ${COLOR_BLUE_DARK};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  width: 100%;
  max-height: 100vh;
  color: #fefefe;
`;
