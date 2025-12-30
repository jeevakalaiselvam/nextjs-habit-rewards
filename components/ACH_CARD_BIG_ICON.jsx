import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import PlatinumIcon from './PlatinumIcon';
import { formatDate1, formatDate2 } from '../helpers/dateHelper';
import PlatinumIconS from './PlatinumIconS';
import GoldIconS from './GoldIconS';
import SilverIconS from './SilverIconS';
import BronzeIconS from './BronzeIconS';
import { COLOR_UNLOCKED, COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { actionAddAchToKanban } from '../store/actions/games.actions';
import { useSelector } from 'react-redux';
import { Popover } from 'antd';

export default function ACH_CARD_BIG_ICON({
  index,
  desc1,
  desc2,
  desc3,
  ach,
  lane,
}) {
  const dispatch = useDispatch();
  const { kanbanObj } = useSelector((s) => s.kanban);

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
  return (
    <AchCard
      ref={drag}
      color={index % 2 == 0 ? '#F9F9F9' : '#F5F5F7'}
      achieved={ach?.achieved}
    >
      <AchIconOuter achieved={ach?.achieved}>
        <AchIcon
          icon={ach?.achieved == '1' ? ach?.icon : ach?.icon}
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

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  content: '';
  height: 40px;
  background: #000000;
  opacity: 0.25;
  width: 1px;
  margin: ${(props) => (props.padding ? `0rem ${props.padding}` : `0rem 1rem`)};
  top: calc(50% - 20px);
`;

const Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100px;
  color: #579428;
`;

const UnlockedT1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
`;

const UnlockedT2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  padding-top: 0.25rem;
`;

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #4486c6;
  justify-content: flex-start;
  flex: 2;
  font-size: 1rem;
  width: 100%;
`;

const AchDesc = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.5rem;
  flex: 2;
  width: 100%;
  opacity: 0.75;
  font-size: 0.9rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : '#00000000'};
`;

const AchIconOuterPlatinum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : '#00000000'};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const AchData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 60px;
`;

const AchRarity = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-start;
  flex-direction: column;
`;

const AchTrophy = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 50px;
  transform: translate(0.25rem, 0.25rem) scale(1.5);
`;

const AchCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #333;
  width: 100%;
  background-color: ${(props) =>
    props.achieved ? COLOR_UNLOCKED : props.color};
  border: 1px solid #eee;
  cursor: pointer;

  &:hover {
    border: 1px solid #d3d3d3;
  }
`;
