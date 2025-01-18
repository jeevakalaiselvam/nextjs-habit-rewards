import styled from 'styled-components';
import Main from './Main';
import {
  CARD_BACKGROUND,
  COLOR_BACKGROUND,
} from '../components/helpers/colorHelper';

export default function Home() {
  return (
    <Container>
      <Main />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${COLOR_BACKGROUND};
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
`;
