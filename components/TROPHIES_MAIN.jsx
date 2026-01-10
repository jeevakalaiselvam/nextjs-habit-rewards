import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Popover } from 'antd';
import { Grid } from 'react-virtualized';
import ACH_CARD from './ACH_CARD';
import ACH_CARD_BOTTOM from './ACH_CARD_BOTTOM';

export default function TROPHIES_MAIN({ sortedGames }) {
  // Use the name 'Grid' here as that is how it's imported
  console.log('Grid component status:', Grid);

  const allAchs = useMemo(() => {
    if (!sortedGames) return [];
    return sortedGames
      .flatMap((game) => game?.achievements || [])
      .filter((ach) => ach?.achievedByLearning)
      .sort((a, b) => (b?.unlocktime || 0) - (a?.unlocktime || 0));
  }, [sortedGames]);

  const columnCount = 16;
  const rowCount = Math.ceil(allAchs.length / columnCount);
  const itemSize = 90;

  // Define Cell inside so it has closure access to allAchs and columnCount
  const Cell = ({ columnIndex, rowIndex, key, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const ach = allAchs[index];

    if (!ach) return null;

    // Define desc3 so the Popover doesn't crash
    const desc3 = ach?.hiddenDesc?.split('Hidden achievement:')?.[1];

    return (
      <div key={key} style={style}>
        <Popover
          placement="bottom"
          mouseEnterDelay={0.1}
          content={
            <ACH_CARD_BOTTOM
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
            content: { backgroundColor: 'transparent', boxShadow: 'none' },
            body: { padding: 0 },
          }}
        >
          <AchIconOuter>
            <AchIcon
              $iconUrl={ach?.icon}
              onClick={() => {
                const query = encodeURIComponent(
                  `${ach?.displayName} achievement ${ach?.gameName}`
                );
                window.open(
                  `https://www.google.com/search?q=${query}`,
                  '_blank'
                );
              }}
            />
          </AchIconOuter>
        </Popover>
      </div>
    );
  };

  return (
    <GamesContainer>
      {allAchs.length > 0 ? (
        <Grid
          columnCount={columnCount}
          columnWidth={itemSize}
          height={1200}
          rowCount={rowCount}
          rowHeight={itemSize}
          width={columnCount * itemSize + 20}
          cellRenderer={Cell}
        />
      ) : (
        <div style={{ color: 'white' }}>No achievements found.</div>
      )}
    </GamesContainer>
  );
}

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-height: 96vh;
  margin-bottom: 1rem;

  /* Remove default focus outline on the grid */
  .ReactVirtualized__Grid {
    outline: none;
  }
`;

const AchIconOuter = styled.div`
  width: 80px;
  height: 80px;
  background: ${(props) => `url(${props?.$iconUrl})`} center/contain no-repeat;
  cursor: pointer;
  transition: transform 0.1s ease;
  position: relative;
  overflow: hidden;
`;

const AchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 78px;
  height: 78px;
  background: ${(props) => `url(${props?.$iconUrl})`} center/contain no-repeat;
  cursor: pointer;
  border-radius: 4px 4px 4px 4px;
`;
