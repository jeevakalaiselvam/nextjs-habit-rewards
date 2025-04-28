import { FaTrophy } from "react-icons/fa";
import styled from "styled-components";
import { GAME_COLORS } from "./helpers/iconHelper";

export default function GamesTrophies({ games }) {
  let total = 0,
    inprog = 0,
    started = 0,
    completed = 0,
    replay = 0,
    boring = 0;

  games?.forEach((game) => {
    if (game?.COMPLETED == "NEW") {
      started++;
    }
    if (game?.COMPLETED == "INPROG") {
      inprog++;
    }
    if (game?.COMPLETED == "BORING") {
      boring++;
    }
    if (game?.COMPLETED == "COMPLETED") {
      completed++;
    }
    if (game?.COMPLETED == "REPLAY") {
      replay++;
    }
  });

  return (
    <Container>
      <TrophySmall1 color={GAME_COLORS?.["NEW"]}>
        <Name>NEW</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{started}</Count>
      </TrophySmall1>
      <TrophySmall2 color={GAME_COLORS?.["INPROG"]}>
        <Name>INPROG</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{inprog}</Count>
      </TrophySmall2>
      <TrophySmall3 color={GAME_COLORS?.["DONE"]}>
        <Name>COMPLETED</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{completed}</Count>
      </TrophySmall3>
      <TrophySmall4 color={GAME_COLORS?.["REPLAY"]}>
        <Name>REPLAY</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{replay}</Count>
      </TrophySmall4>
      <TrophySmall5 color={GAME_COLORS?.["BORING"]}>
        <Name>BORING</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{boring}</Count>
      </TrophySmall5>
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
