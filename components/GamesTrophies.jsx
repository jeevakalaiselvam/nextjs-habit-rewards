import { FaTrophy } from "react-icons/fa";
import styled from "styled-components";
import { GAME_COLORS } from "./helpers/iconHelper";

export default function GamesTrophies({
  games,
  activeTabGame,
  setActiveTabGame,
}) {
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
    if (game?.COMPLETED == "TARGET") {
      inprog++;
    }
    if (game?.COMPLETED == "TRIED") {
      boring++;
    }
    if (game?.COMPLETED == "DONE") {
      completed++;
    }
    if (game?.COMPLETED == "REPLAY") {
      replay++;
    }
  });

  console.log()
  
  return (
    <Container>
      <TrophySmall2
        onClick={() => {
          setActiveTabGame(0);
        }}
        color={activeTabGame == 0 ? GAME_COLORS?.["TARGET"] : "#757575"}
      >
        <Name>TARGET</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{inprog}</Count>
      </TrophySmall2>
      <TrophySmall1
        onClick={() => {
          setActiveTabGame(1);
        }}
        color={activeTabGame == 1 ? GAME_COLORS?.["NEW"] : "#757575"}
      >
        <Name>NEW</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{started}</Count>
      </TrophySmall1>
      <TrophySmall3
        onClick={() => {
          setActiveTabGame(4);
        }}
        color={activeTabGame == 4 ? GAME_COLORS?.["DONE"] : "#757575"}
      >
        <Name>COMPLETED</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{completed}</Count>
      </TrophySmall3>
      <TrophySmall4
        onClick={() => {
          setActiveTabGame(2);
        }}
        color={activeTabGame == 2 ? GAME_COLORS?.["REPLAY"] : "#757575"}
      >
        <Name>REPLAY</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{replay}</Count>
      </TrophySmall4>
      <TrophySmall5
        onClick={() => {
          setActiveTabGame(3);
        }}
        color={activeTabGame == 3 ? GAME_COLORS?.["TRIED"] : "#757575"}
      >
        <Name>MEH</Name>
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
