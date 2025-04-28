import { FaTrophy } from "react-icons/fa";
import styled from "styled-components";

export default function GamesTrophies({ games }) {
  let total = 0,
    started = 0,
    start = 0,
    completed = 0,
    boring = 0;

  games?.forEach((game) => {
    if (game?.COMPLETED == "NEW") {
      start++;
    }
  });

  return (
    <Container>
      <TrophySmall1>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{start}</Count>
      </TrophySmall1>
    </Container>
  );
}

const Trophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const TrophySmall1 = styled.div`
  position: absolute;
  left: 0;
  top: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  position: relative;
  min-height: 40px;
`;
