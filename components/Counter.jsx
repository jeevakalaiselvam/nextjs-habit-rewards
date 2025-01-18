import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLOR_ACCENT } from './helpers/colorHelper';

export default function Counter({ old, habit, newCount, setNewCount }) {
  return (
    <Container>
      <CountContainer>
        <Minus
          onClick={() => {
            if (counter != 0) {
              setNewCount((old) => old - 1);
            }
          }}
        >
          -
        </Minus>
        <Count>{newCount}</Count>
        <Plus
          onClick={() => {
            setNewCount((old) => old + 1);
          }}
        >
          +
        </Plus>
      </CountContainer>
      <SaveContainer>{habit.reward * newCount} Rs</SaveContainer>
    </Container>
  );
}

const SaveContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 2rem;
  padding: 1rem;
  opacity: 0.5;
`;

const CountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Plus = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 3rem;
  width: 100px;
  background: ${COLOR_ACCENT};
  height: 100px;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 3rem;
  width: 100px;
  height: 100px;
`;

const Minus = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  height: 100px;
  background: ${COLOR_ACCENT};
  flex-direction: column;
  justify-content: center;
  font-size: 3rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
`;
