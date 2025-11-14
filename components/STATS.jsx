import styled from "styled-components";
import StatInformation from "./StatInformation";
import LevelProgressChart from "./LevelProgressChart";
import MultiProgressChart from "./MultiProgressChart";
import { calculateLevelForAchs } from "../helpers/trophyHelper";
import BarProgressChart from "./BarProgressChart";

export default function STATS({ selectedMode, games }) {
  const {
    levelAchs,
    dailyUnlocks,
    monthlyUnlocks,
    dailyTypeBreakdown,
    hourlyUnlocks,
    weeklyUnlocks,
  } = calculateLevelForAchs(games);

  return (
    <Container>
      <GamesR>
        <GameLineHours>
          <Games1Line>
            <GamesLeft>MAIN STATISTICS</GamesLeft>
            <GamesRight></GamesRight>
          </Games1Line>
          <StatWrapper>
            <StatInformation games={games} size={3100} />
          </StatWrapper>
        </GameLineHours>
      </GamesR>

      <GamesR>
        <GameLineHours>
          <Games1Line>
            <GamesLeft>MONTHLY ACTIVITYs</GamesLeft>
            <GamesRight></GamesRight>
          </Games1Line>
          <StatWrapper2>
            <LevelProgressChart dailyUnlocks={monthlyUnlocks} size={3100} />
          </StatWrapper2>
        </GameLineHours>
      </GamesR>

      <GamesR>
        <GameLineHours>
          <Games1Line>
            <GamesLeft>TROPHY PROGRESSION</GamesLeft>
            <GamesRight></GamesRight>
          </Games1Line>
          <StatWrapper2>
            <MultiProgressChart
              size={3100}
              dailyTypeBreakdown={dailyTypeBreakdown}
            />
          </StatWrapper2>
        </GameLineHours>
      </GamesR>

      <GamesR>
        <GameLineHours>
          <Games1Line>
            <GamesLeft>TROPHIES BY TIME</GamesLeft>
            <GamesRight></GamesRight>
          </Games1Line>
          <StatWrapper2>
            <BarProgressChart dailyUnlocks={hourlyUnlocks} size={3100} />
          </StatWrapper2>
        </GameLineHours>
      </GamesR>

      <GamesR>
        <GameLineHours>
          <Games1Line>
            <GamesLeft>TROPHIES BY DAY</GamesLeft>
            <GamesRight></GamesRight>
          </Games1Line>
          <StatWrapper2>
            <BarProgressChart dailyUnlocks={weeklyUnlocks} size={3100} />
          </StatWrapper2>
        </GameLineHours>
      </GamesR>
    </Container>
  );
}

// Styles

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
`;

const Games1Line = styled.div`
  display: flex;
  align-items: center;
  background-color: #336291;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  width: 100%;
`;

const GamesR = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
`;

const GameLineHours = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fefefe;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
`;

const GamesLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const GamesRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const StatWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StatWrapper2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 0rem;
`;
