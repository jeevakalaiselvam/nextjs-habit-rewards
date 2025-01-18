import { Calendar } from 'antd';
import styled from 'styled-components';

export default function UserCalendar() {
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
  margin-top: 1rem;
`;
