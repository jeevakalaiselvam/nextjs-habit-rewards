import { Calendar } from 'antd';
import styled from 'styled-components';

export default function JeevaCalendar() {
  return (
    <Container>
      <Calendar onPanelChange={() => {}} fullscreen={false} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
`;
