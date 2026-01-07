import { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import GoldIcon from './GoldIcon';
import BronzeIcon from './BronzeIcon';
import ACH_CARD from './ACH_CARD';
import { Popover } from 'antd';

export default function ACH_CARD_SMALL({
  index,
  desc1,
  desc2,
  desc3,
  ach,
  lane,
  hideCompletion,
  longer,
}) {
  const dispatch = useDispatch();

  const achId = `${ach.gameId}-${ach.name}`;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ACH_CARD',
      item: { achId, ach, fromLane: lane },
      canDrag: true, // Cannot drag completed achievements
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [lane, achId]
  );

  function formatUnlockDate(date, unlockedAt) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const d = date.getDate();
    const m = months[date.getMonth()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12

    if (unlockedAt?.length > 0) {
      return `${'Unlocked @'} ${unlockedAt}`;
    } else {
      return `${'Unlocked @'} ${d} ${m} @ ${hours}:${minutes}${ampm}`;
    }
  }

  return (
    <AchCard longer={longer} ref={drag} achieved={ach?.achieved}>
      <Popover
        placement="bottom"
        mouseEnterDelay={0.1}
        styles={{
          content: { backgroundColor: 'transparent', boxShadow: 'none' },
          body: { padding: 0 },
        }}
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
      >
        <AchIconOuter>
          <AchIcon
            icon={
              ach?.achieved == 1 || ach?.achievedByLearning
                ? ach?.icon
                : ach?.icongray
            }
            onClick={() => {
              if (window !== 'undefined') {
                const searchQuery = `${
                  ach?.displayName
                } achievement ${encodeURIComponent(ach?.gameName)} `;
                window.open(`https://www.google.com/search?q=${searchQuery}`);

                // window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
              }
            }}
          ></AchIcon>
        </AchIconOuter>
      </Popover>
    </AchCard>
  );
}

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 73px;
  height: 73px;
  border-radius: 4px;
  position: relative;
  z-index: 2;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 73px;
  height: 73px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  position: absolute;
  top: calc(50%);
  left: calc(50%);
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  margin: 4px;
  cursor: pointer;
  position: relative;
`;
