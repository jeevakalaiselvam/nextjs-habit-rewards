import styled from 'styled-components';

export default function UserTrend() {
  const data = [
    { date: '11-02-2025', value: 2000 },
    { date: '12-02-2025', value: 1500 },
    { date: '13-02-2025', value: 3000 },
  ];

  return <Container></Container>;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 70vh;
  max-height: 70vh;
`;
