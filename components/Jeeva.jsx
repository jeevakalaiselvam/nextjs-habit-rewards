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

export default function Jeeva() {
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
      <OptionContainer>
        <Radio.Group
          size="large"
          value={activeItem}
          onChange={(e) => {
            setActiveItem(e.target.value);
          }}
        >
          <Radio.Button value="calendar">Calendar</Radio.Button>
          <Radio.Button value="habitlog">Habit Log</Radio.Button>
          <Radio.Button value="habits">Habits</Radio.Button>
          <Radio.Button value="createhabit">Create</Radio.Button>
        </Radio.Group>
      </OptionContainer>
      <SelectedContainer>
        {activeItem == 'calendar' && <JeevaCalendar />}
        {activeItem == 'createhabit' && (
          <JeevaCreate setActiveItem={setActiveItem} />
        )}
        {activeItem == 'habits' && (
          <JeevaHabits
            setActiveItem={setActiveItem}
            currentDate={currentDate}
          />
        )}
        {activeItem == 'habitlog' && (
          <JeevaHabitLog
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
  max-height: 92vh;
  min-height: 92vh;
`;
