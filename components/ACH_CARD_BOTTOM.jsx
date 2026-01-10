import { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import GoldIcon from './GoldIcon';
import BronzeIcon from './BronzeIcon';

export default function ACH_CARD_BOTTOM({
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
      <AchData>
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
        <AchTitle>{ach?.displayName}</AchTitle>
        <AchDesc>{desc2 ? desc2 : desc3 ? desc3 : desc1}</AchDesc>
      </AchData>
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
  margin-left: 1px;
`;

const AchIcon = styled.div`
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
  font-size: 16px;
  font-weight: 500;
  color: rgb(220, 222, 223);
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 0.5rem;
  font-size: 12px;
  font-weight: 400;
  color: rgb(184, 188, 191);
`;

const AchData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem;
  flex: 1;
  z-index: 2;
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  background-color: #23262e;
  margin-bottom: 4px;
  cursor: pointer;
  position: relative;
`;
