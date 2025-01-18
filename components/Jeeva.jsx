import { Button, Calendar, Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import JeevaCalendar from './JeevaCalendar';
import JeevaCreate from './JeevaCreate';
import JeevaHabits from './JeevaHabits';
import JeevaHabitLog from './JeevaHabitLog';
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from 'react-icons/hi';
import moment from 'moment';
import JeevaHabitRewards from './JeevaHabitRewards';
import { COLOR_BACKGROUND } from './helpers/colorHelper';

export default function Jeeva({ createMode, setCreateMode }) {
  const [activeItem, setActiveItem] = useState('habitlog');
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

  return (
    <Container>
      <DateLeftRight>
        <Left
          onClick={() => {
            let newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(moment(new Date(newDate)).format('YYYY-MM-DD'));
          }}
        >
          <Button color="primary" variant="solid">
            <HiOutlineArrowNarrowLeft />
          </Button>
        </Left>
        <Middle>{currentDate}</Middle>
        <Right
          onClick={() => {
            let newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(moment(new Date(newDate)).format('YYYY-MM-DD'));
          }}
        >
          <Button color="primary" variant="solid">
            <HiOutlineArrowNarrowRight />
          </Button>
        </Right>
      </DateLeftRight>
      {!createMode && (
        <OptionContainer>
          <Radio.Group
            size="large"
            value={activeItem}
            style={{ width: '102%' }}
            onChange={(e) => {
              setActiveItem(e.target.value);
              setCreateMode(false);
            }}
          >
            <Radio.Button
              value="rewards"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Rewards
            </Radio.Button>
            <Radio.Button
              value="habitlog"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Daily
            </Radio.Button>
            <Radio.Button
              value="habits"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Habits
            </Radio.Button>
            <Radio.Button
              value="payout"
              style={{ width: '25%', textAlign: 'center' }}
            >
              Payout
            </Radio.Button>
          </Radio.Group>
        </OptionContainer>
      )}
      <SelectedContainer>
        {createMode && <JeevaCreate setActiveItem={setActiveItem} />}
        {activeItem == 'calendar' && !createMode && <JeevaCalendar />}
        {activeItem == 'habits' && !createMode && (
          <JeevaHabits
            setActiveItem={setActiveItem}
            currentDate={currentDate}
          />
        )}
        {activeItem == 'habitlog' && !createMode && (
          <JeevaHabitLog
            setActiveItem={setActiveItem}
            currentDate={currentDate}
          />
        )}
        {activeItem == 'rewards' && !createMode && (
          <JeevaHabitRewards
            setActiveItem={setActiveItem}
            currentDate={currentDate}
          />
        )}
      </SelectedContainer>
    </Container>
  );
}

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateLeftRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110%;
  color: #fefefe;
  padding: 0.25rem 1rem 1rem 1rem;
`;

const OptionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const SelectedContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 90vh;
  max-height: 90vh;
  background-color: ${COLOR_BACKGROUND};
`;
