import { Calendar, Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import JeevaCalendar from './JeevaCalendar';
import JeevaCreate from './JeevaCreate';
import JeevaHabits from './JeevaHabits';

export default function Jeeva() {
  const [activeItem, setActiveItem] = useState('calendar');

  return (
    <Container>
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
        {activeItem == 'habits' && <JeevaHabits />}
      </SelectedContainer>
    </Container>
  );
}

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
