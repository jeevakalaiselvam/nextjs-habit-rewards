import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Popover } from 'antd';
import { Grid } from 'react-virtualized';
import ACH_CARD_BOTTOM from './ACH_CARD_BOTTOM';

export default function TROPHIES_MAIN({ sortedGames }) {
  // Use the name 'Grid' here as that is how it's imported
  console.log('Grid component status:', Grid);

  const allAchs = useMemo(() => {
    if (!sortedGames) return [];
    return sortedGames
      .flatMap((game) => game?.achievements || [])
      .filter((ach) => ach?.achievedByLearning || ach?.achieved == 1)
      .sort((a, b) => (b?.unlocktime || 0) - (a?.unlocktime || 0));
  }, [sortedGames]);

  const columnCount = 19;
  const rowCount = Math.ceil(allAchs.length / columnCount);
  const itemSize = 80;

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
            <AchInner>
              <AchIcon
                icon={ach?.icon}
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
            </AchInner>
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
          height={800}
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
  max-height: 90vh;
  overflow: scroll;
  margin-bottom: 1rem;

  /* Remove default focus outline on the grid */
  .ReactVirtualized__Grid {
    outline: none;
  }
`;

const AchInner = styled.div`
  padding: 3px;
  border-radius: 3px;
  overflow: hidden;
  line-height: 1em;
  position: relative;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0.14) 0,
    hsla(0, 0%, 100%, 0)
  );
`;

const AchIconOuter = styled.div`
  margin: 0 3px 7px;
  height: 74px;
  -webkit-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  position: relative;
  background: none;
  border-left: 1px solid transparent;
  border-top: 1px solid transparent;
  border-color: hsla(0, 0%, 96.1%, 0.3) transparent transparent
    hsla(0, 0%, 96.1%, 0.3);
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;

  &:hover {
    border-top: 1px solid transparent;
    border-color: #fefefe77;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
  }
`;

const AchIcon = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  -webkit-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  background: ${(props) => `url(${props?.icon})`} center/contain no-repeat;
`;
