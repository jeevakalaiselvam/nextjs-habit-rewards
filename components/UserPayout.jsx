import styled from 'styled-components';

export default function Atom() {
  return <Container>TREND</Container>;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 94vh;
  max-height: 94vh;
  overflow: scroll;
  width: 98%;
`;
