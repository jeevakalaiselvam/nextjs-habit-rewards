import { Button, Card, message, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLOR_ACCENT } from './helpers/colorHelper';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import LongPress from './LongPress';

export default function JeevaHabitRewards({ currentDate }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [habitLogs, setHabitLogs] = useState([]);
  const [habitLogsLoading, setHabitLogsLoading] = useState(false);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [habits, setHabits] = useState([]);
  const [selectedToDelete, setSelectedToDelete] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDaily, setShowDaily] = useState(false);

  const info = (message) => {
    messageApi.info('Hello, Ant Design!');
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  const refreshHabits = () => {
    setHabitsLoading(true);
    axios
      .get('/api/jeevareward')
      .then((response) => {
        setHabits(response?.data);
        refreshHabitLogs();
        success('Success');
        setHabitsLoading(false);
      })
      .catch((err) => {
        error('Error');
        setHabitsLoading(false);
        refreshHabitLogs();
      });
  };

  const refreshHabitLogs = () => {
    setHabitLogsLoading(true);
    axios
      .get('/api/jeevahabit')
      .then((response) => {
        setHabitLogs(response?.data);
        setHabitLogsLoading(false);
        success('Success');
      })
      .catch((err) => {
        error('Error');
        setHabitLogsLoading(false);
      });
  };

  useEffect(() => {
    refreshHabits();
    refreshHabitLogs();
  }, [currentDate]);

  const deleteHabit = () => {
    setDeleting(true);
    axios
      .delete(`/api/jeevahabit/${selectedToDelete}`)
      .then((response) => {
        success('Habit deleted !');
        setDeleting(false);
        setDeleteMode(false);
        refreshHabitLogs();
      })
      .catch((err) => {
        error('Unable to delete Habit !');
        setDeleting(false);
        setDeleteMode(false);
        refreshHabitLogs();
      });
  };

  const todayIdentifier = moment(new Date(currentDate)).format('YYYY-MM-DD');
  const monthIdentifier = moment(new Date(currentDate))
    .format('YYYY-MM-DD')
    ?.split('-')?.[1];

  const allHabits = habitLogs;
  const allHabitsRewards = habitLogs?.reduce((acc, innerHabit) => {
    const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
    return acc + innerHabit?.count * habit?.reward;
  }, 0);

  const monthlyHabits = habitLogs?.filter((habitLog) => {
    const habit = habits?.find((h) => h?._id == habitLog?.habitId);
    const dateFromTime = habitLog?.time?.split('-')?.[1];
    const isHabitPartOfMonth = dateFromTime == monthIdentifier;
    return isHabitPartOfMonth;
  });
  const monthlyHabitRewards = monthlyHabits?.reduce((acc, innerHabit) => {
    const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
    return acc + innerHabit?.count * habit?.reward;
  }, 0);

  const todayHabits = habitLogs?.filter((habitLog) => {
    const habit = habits?.find((h) => h?._id == habitLog?.habitId);
    const dateFromTime = habitLog?.time;
    const isHabitPartOfToday = dateFromTime == todayIdentifier;
    return isHabitPartOfToday;
  });

  const todayHabitRewards = todayHabits?.reduce((acc, innerHabit) => {
    const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
    return acc + innerHabit?.count * habit?.reward;
  }, 0);

  return (
    <Container>
      {(habitLogsLoading || habitsLoading) && (
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 48,
                marginTop: '2rem',
              }}
              spin
            />
          }
        />
      )}
      {!habitLogsLoading && !habitsLoading && (
        <TotalRs>
          {showDaily && (
            <Amount onClick={() => setShowDaily((old) => !old)}>
              <Info>Today Reward</Info>
              <Data>{todayHabitRewards} Rs</Data>
            </Amount>
          )}
          {!showDaily && (
            <Amount onClick={() => setShowDaily((old) => !old)}>
              <Info>Monthly Reward</Info>
              <Data>{monthlyHabitRewards} Rs</Data>
            </Amount>
          )}
          <Payout>
            <Button
              variant="solid"
              color="primary"
              style={{ width: '100%', fontSize: '1.5rem', padding: '2rem' }}
              onClick={() => {
                if (window) {
                  window.location.href = 'gpay://';
                }
              }}
            >
              PAYOUT
            </Button>
          </Payout>
        </TotalRs>
      )}
    </Container>
  );
}

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: 0.25;
  padding: 0rem 1rem 1rem 1rem;
  font-size: 2rem;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  padding: 2rem;
  justify-content: center;
  width: 100%;
`;

const Amount = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-height: 40vh;
  max-height: 40vh;
  width: 100%;
`;

const Payout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const TotalRs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${COLOR_ACCENT};
  padding: 4rem 1rem 1rem 1rem;
  flex-direction: column;
  font-size: 5rem;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Delete = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  opacity: 0.25;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${COLOR_ACCENT};
  width: 50px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 70vh;
  max-height: 70vh;
  overflow: scroll;
`;
