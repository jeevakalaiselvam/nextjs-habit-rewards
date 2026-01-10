import { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import GoldIcon from './GoldIcon';
import BronzeIcon from './BronzeIcon';

export default function ACH_CARD_ICONS({
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
    <AchCard
      longer={longer}
      ref={drag}
      color={index % 2 == 0 ? '#F9F9F9' : '#F5F5F7'}
      achieved={ach?.achieved}
    >
      <AchIconOuter>
        <AchIcon
          icon={
            ach?.achieved == 1 || ach?.achievedByLearning
              ? ach?.icon
              : ach?.icon
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
    </AchCard>
  );
}

const AchIconOuter = styled.div`
  width: 76px;
  height: 76px;
  cursor: pointer;
  position: relative;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
`;

const AchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76px;
  height: 76px;
  background: ${(props) => `url(${props?.icon})`} center/contain no-repeat;
  cursor: pointer;
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  background-color: #23262e;
  margin: 6px;
  cursor: pointer;
  position: relative;
`;
