import styled from 'styled-components';
import { COLOR_ACCENT, COLOR_SUCCESS } from './helpers/colorHelper';

export default function RewardCount({ reward }) {
  return <Container>{reward} Rs</Container>;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0rem 0rem 0rem 1rem;
  color: ${COLOR_SUCCESS};
  font-size: 3rem;
  width: 100%;
`;
