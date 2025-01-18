import { Button, Calendar, Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import UserCalendar from './UserCalendar';
import UserCreate from './UserCreate';
import UserHabits from './UserHabits';
import UserHabitLog from './UserHabitLog';
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from 'react-icons/hi';
import moment from 'moment';
import UserHabitRewards from './UserHabitRewards';
import { COLOR_BACKGROUND } from './helpers/colorHelper';
import UserTrend from './UserTrend';

export default function User({ createMode, setCreateMode, user }) {
  const [activeItem, setActiveItem] = useState('habitlog');
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );

  const formattedDate = currentDate.split('-').reverse().join('-');

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
        <Middle>{formattedDate}</Middle>
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
              value="history"
              style={{ width: '25%', textAlign: 'center' }}
            >
              History
            </Radio.Button>
          </Radio.Group>
        </OptionContainer>
      )}
      <SelectedContainer>
        {createMode && (
          <UserCreate
            setActiveItem={setActiveItem}
            setCreateMode={setCreateMode}
            user={user}
          />
        )}
        {activeItem == 'calendar' && !createMode && (
          <UserCalendar user={user} />
        )}
        {activeItem == 'habits' && !createMode && (
          <UserHabits
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
          />
        )}
        {activeItem == 'habitlog' && !createMode && (
          <UserHabitLog
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
          />
        )}
        {activeItem == 'rewards' && !createMode && (
          <UserHabitRewards
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
          />
        )}
        {activeItem == 'history' && !createMode && (
          <UserTrend
            setActiveItem={setActiveItem}
            currentDate={currentDate}
            user={user}
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
  min-height: 70vh;
  max-height: 70vh;
  background-color: ${COLOR_BACKGROUND};
`;
