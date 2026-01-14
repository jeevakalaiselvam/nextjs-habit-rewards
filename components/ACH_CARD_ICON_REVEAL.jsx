import { useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FaCheck, FaTrophy } from 'react-icons/fa';
import GoldIcon from './GoldIcon';
import BronzeIcon from './BronzeIcon';

export default function ACH_CARD_BOTTOM_REVEAL({
  index,
  desc1,
  desc2,
  desc3,
  ach,
  lane,
  hideCompletion,
  longer,
  rowIndex,
  onlyUnlocked,
  hiddenMapper,
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
          <AchInner>
            <AchIcon
              achieved={ach?.achieved}
              icon={ach?.icon}
              onClick={() => {
                if (ach?.achieved == 0) {
                  const query = encodeURIComponent(
                    `${ach?.displayName} achievement ${ach?.gameName}`
                  );
                  window.open(
                    `https://www.google.com/search?q=${query}`,
                    '_blank'
                  );
                }
              }}
            />
          </AchInner>
        </AchIconOuter>
      </AchData>
    </AchCard>
  );
}

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

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem;
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
