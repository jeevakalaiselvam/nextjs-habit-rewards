import React from "react";
import styled from "styled-components";
import GameCdImageSmall from "./GameCdImageSmall";

// Sample game data

// Container for the stacked layout
const StackContainer = styled.div`
  position: relative;
  width: 500px;
  height: 600px;
  margin: 40px auto;
`;

// Each game item styled based on index
const GameCard = styled.div`
  position: absolute;
  top: ${({ index }) => 1 * 40}px;
  left: ${({ index }) => index * 20}px;
  z-index: ${({ index }) => index};
  transition: transform 0.3s ease, z-index 0.3s ease;
  cursor: pointer;

  &:hover {
    z-index: 100;
  }

  img {
    width: 450px;
    border-radius: 12px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

export default function StackedGameList({ games }) {
  return (
    <StackContainer>
      {games.map((game, i) => (
        <GameCard key={i} index={i}>
          <GameCdImageSmall cover={game?.cover} />
        </GameCard>
      ))}
    </StackContainer>
  );
}
