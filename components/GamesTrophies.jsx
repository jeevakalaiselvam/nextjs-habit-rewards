import { FaTrophy } from "react-icons/fa";
import styled from "styled-components";
import { GAME_COLORS } from "./helpers/iconHelper";

export default function GamesTrophies({
  games,
  activeTabGame,
  setActiveTabGame,
}) {
  let total = 0,
    two = 0,
    one = 0,
    four = 0,
    five = 0,
    three = 0;

  games?.forEach((game) => {
    if (game?.COMPLETED == "INPROG") {
      one++;
    }
    if (game?.COMPLETED == "DONE") {
      two++;
    }
    if (game?.RATING == 5 && game?.COMPLETED == "NEW") {
      three++;
    }
    if (game?.RATING == 4 && game?.COMPLETED == "NEW") {
      four++;
    }
    if (game?.COMPLETED == "REPLAY") {
      five++;
    }
  });

  return (
    <Container>
      <TrophySmall5
        onClick={() => {
          setActiveTabGame(0);
        }}
        color={activeTabGame == 0 ? GAME_COLORS?.["REPLAY"] : "#757575"}
      >
        <Name>IN PROG</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{one}</Count>
      </TrophySmall5>
      <TrophySmall3
        onClick={() => {
          setActiveTabGame(1);
        }}
        color={activeTabGame == 1 ? GAME_COLORS?.["DONE"] : "#757575"}
      >
        <Name>DONE</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{two}</Count>
      </TrophySmall3>
      <TrophySmall2
        onClick={() => {
          setActiveTabGame(2);
        }}
        color={activeTabGame == 2 ? GAME_COLORS?.["DONE"] : "#757575"}
      >
        <Name>PRIORITY 5</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{three}</Count>
      </TrophySmall2>
      <TrophySmall1
        onClick={() => {
          setActiveTabGame(3);
        }}
        color={activeTabGame == 3 ? GAME_COLORS?.["TARGET"] : "#757575"}
      >
        <Name>PRIORITY 4</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{four}</Count>
      </TrophySmall1>

      <TrophySmall4
        onClick={() => {
          setActiveTabGame(4);
        }}
        color={activeTabGame == 4 ? GAME_COLORS?.["REPLAY"] : "#757575"}
      >
        <Name>REPLAY</Name>
        <Trophy>
          <FaTrophy />
        </Trophy>
        <Count>{five}</Count>
      </TrophySmall4>
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
