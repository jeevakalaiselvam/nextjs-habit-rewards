import styled from 'styled-components';
import { COLOR_UNLOCKED, COLOR_UNLOCKED_DARK } from '../helpers/colorHelper';
import { useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';

export default function ACH_CARD_PLATINUM({ index, ach, onDelete }) {
  return (
    <AchCard
      color={index % 2 == 0 ? '#F9F9F9' : '#F5F5F7'}
      achieved={ach?.achieved}
    >
      {ach?.color != 'Platinum' && (
        <AchIconOuter achieved={ach?.achieved}>
          <AchIcon
            icon={ach?.img}
            onClick={() => {
              if (window !== 'undefined') {
                if (ach?.achieved == 0) {
                  const searchQuery = `${
                    ach?.displayName
                  } achievement ${encodeURIComponent(ach?.gameName)} `;
                  window.open(`https://www.google.com/search?q=${searchQuery}`);
                }
              }
            }}
          ></AchIcon>
        </AchIconOuter>
      )}

      <AchData>
        <AchTitle>{ach?.title}</AchTitle>
        <AchDesc>
          {ach?.description?.replace('Hidden achievement: ', '')}
        </AchDesc>
      </AchData>

      <Seperator padding={'.25rem'} />
      {ach?.color != 'Platinum' && (
        <AchRarity>
          <span style={{ fontSize: '1rem' }}>{ach?.globalPct}</span>
          <span style={{ fontSize: '.6rem' }}>{'UNKNOWN'}</span>
        </AchRarity>
      )}

      {ach?.color == 'Platinum' && (
        <AchRarity>
          <span style={{ fontSize: '.7rem' }}>PLATINUM</span>
        </AchRarity>
      )}

      <AchTrophy
        onClick={() => {
          onDelete(ach);
        }}
      >
        <MdDelete />
      </AchTrophy>
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

const AchTitle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  color: #4486c6;
  justify-content: flex-start;
  flex: 2;
  font-size: 0.8rem;
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
  font-size: 0.7rem;
`;

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${(props) =>
    props.achieved ? COLOR_UNLOCKED_DARK : '#00000000'};
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
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
  transform: translate(0.25rem, 0.25rem);
  font-size: 1.5rem;
  transform: translateY(-0.25rem);
  color: #333;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
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
