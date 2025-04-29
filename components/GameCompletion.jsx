import { FaTrophy } from "react-icons/fa";
import styled from "styled-components";
import { GAME_COLORS } from "./helpers/iconHelper";

export default function GameCompletion({ games }) {
  let platinum = 0,
    gold = 0,
    epic = 0;

  games?.forEach((game) => {
    if (game?.completion == 100) {
      platinum++;
    } else if (game?.completion >= 75 && game?.completion < 100) {
      gold++;
    } else if (game?.completion >= 50 && game?.completion < 75) {
      epic++;
    }
  });

  return (
    <Container>
      <TrophySmall2 onClick={() => {}} color={GAME_COLORS?.["PLATINUM"]}>
        <Name>PLATINUM</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{platinum}</Count>
      </TrophySmall2>
      <TrophySmall1 onClick={() => {}} color={GAME_COLORS?.["GOLD"]}>
        <Name>GOLD</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{gold}</Count>
      </TrophySmall1>
      <TrophySmall3 onClick={() => {}} color={GAME_COLORS?.["EPIC"]}>
        <Name>EPIC</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{epic}</Count>
      </TrophySmall3>
    </Container>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
  color: ${(props) => props.color};
`;

const TrophySmall1 = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.color};
`;

const TrophySmall2 = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.color};
`;

const TrophySmall3 = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.color};
`;

const TrophySmall4 = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.color};
`;

const TrophySmall5 = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.color};
`;

const Trophy = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  justify-content: flex-start;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  min-height: 40px;
`;
