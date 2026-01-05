import { useMemo } from "react";
import styled from "styled-components";
import { Popover } from "antd";
import { FixedSizeGrid as Grid } from "react-window";
import ACH_CARD from "./ACH_CARD";

export default function TROPHIES_MAIN({ sortedGames }) {
  const allAchs = useMemo(() => {
    if (!sortedGames) return [];
    return sortedGames
      .flatMap((game) => game?.achievements || [])
      .filter((ach) => ach?.achieved === 1 || ach?.achievedByLearning)
      .sort((a, b) => (b?.unlocktime || 0) - (a?.unlocktime || 0));
  }, [sortedGames]);

  // Settings for the grid layout
  const columnCount = 10; // Adjust based on your UI width
  const rowCount = Math.ceil(allAchs.length / columnCount);
  const itemSize = 75; // 61px icon + margins

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const ach = allAchs[index];

    if (!ach) return null;

    const desc3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];

    return (
      <div style={style}>
        <Popover
          placement="bottom"
          mouseEnterDelay={0.1} // Prevents lag while moving mouse fast
          content={
            <ACH_CARD
              ach={ach}
              desc1={ach?.hiddenDesc}
              desc2={ach?.description}
              desc3={desc3}
              index={index}
              hideCompletion
              longer="600"
            />
          }
          styles={{
            content: { backgroundColor: "transparent", boxShadow: "none" },
            body: { padding: 0 },
          }}
        >
          <AchIcon
            $iconUrl={ach?.icon}
            onClick={() => {
              const query = encodeURIComponent(
                `${ach?.displayName} achievement ${ach?.gameName}`
              );
              window.open(`https://www.google.com/search?q=${query}`, "_blank");
            }}
          />
        </Popover>
      </div>
    );
  };

  return (
    <GamesContainer>
      {/* Grid only renders what is visible in this 96vh window */}
      <Grid
        columnCount={columnCount}
        columnWidth={itemSize}
        height={800} // This should be calculated or fixed
        rowCount={rowCount}
        rowHeight={itemSize}
        width={columnCount * itemSize + 20}
      >
        {Cell}
      </Grid>
    </GamesContainer>
  );
}

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-height: 96vh;
  margin-bottom: 1rem;
`;

const AchIcon = styled.div`
  width: 61px;
  height: 61px;
  background: ${(props) => `url(${props?.$iconUrl})`} center/contain no-repeat;
  cursor: pointer;
  transition: transform 0.1s ease;
  &:hover {
    transform: scale(1.1);
  }
`;
