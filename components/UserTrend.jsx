import { Card, message, Spin } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import {
  getHabitApiKeyForUser,
  getRewardApiKeyForUser,
} from './helpers/apiHelper';
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { COLOR_ACCENT } from './helpers/colorHelper';

export default function UserTrend({ setActiveItem, currentDate, user }) {
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [habitLoading, setHabitLoading] = useState(false);
  const [habitLogsLoading, setHabitLogsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const info = (message) => {
    messageApi.info(message);
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  const refreshHabits = () => {
    setHabitLoading(true);
    axios
      .get(`/api/${getRewardApiKeyForUser(user)}?user=${user}`)
      .then((response) => {
        setHabits(response?.data);
        refreshHabitLogs();
        success('Success');
        setHabitLoading(false);
      })
      .catch((err) => {
        error('Error');
        setHabitLoading(false);
        refreshHabitLogs();
      });
  };

  const refreshHabitLogs = () => {
    setHabitLogsLoading(true);
    axios
      .get(`/api/${getHabitApiKeyForUser(user)}?user=${user}`)
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
  }, [currentDate, user]);

  const getDatesForCurrentMonth = () => {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    // Start from the first day of the month
    let date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      date.setDate(date.getDate() + 1); // Move to the next day
    }

    return dates;
  };

  const getDatesForCurrentYear = () => {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();

    // Start from the first day of the year
    let date = new Date(year, 0, 1); // January is 0-indexed

    while (date.getFullYear() === year) {
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      date.setDate(date.getDate() + 1); // Move to the next day
    }

    return dates;
  };

  const getDatesForLastSixMonths = () => {
    const dates = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const targetDate = new Date(currentYear, currentMonth - monthOffset, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      // Generate dates for the target month
      let date = new Date(targetYear, targetMonth, 1);
      while (date.getMonth() === targetMonth) {
        dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        date.setDate(date.getDate() + 1); // Move to the next day
      }
    }

    return dates.reverse(); // Reverse to keep the order chronological
  };

  const getCurrentMonthName = () => {
    const now = new Date();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[now.getMonth()]; // getMonth() returns 0-indexed month
  };

  const allHabitDates = habitLogs?.map((habit) => habit?.time);

  return (
    <Container>
      {(habitLogsLoading || habitLoading) && (
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
      {!habitLogsLoading &&
        !habitLoading &&
        habits?.map((habit) => {
          return (
            <Card style={{ width: '100%', marginTop: '.5rem' }}>
              <StreakContainer>
                <Title>
                  <span>{habit?.title}</span>
                  <span style={{ opacity: 0.5 }}>{getCurrentMonthName()}</span>
                </Title>
                <DateWrapper>
                  {getDatesForCurrentMonth()?.map((date) => {
                    const isPresent = allHabitDates?.includes(date);
                    console.log({ allHabitDates, date });
                    return (
                      <DateBox>
                        <InnerBox isPresent={isPresent}>
                          {date?.split('-')?.[2]}
                        </InnerBox>
                      </DateBox>
                    );
                  })}
                </DateWrapper>
              </StreakContainer>
            </Card>
          );
        })}
    </Container>
  );
}

const DateBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const InnerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5vw;
  margin: 4px;
  height: 5vw;
  color: ${(props) => (props.isPresent ? '#465e77' : '#575757')};
  background-color: ${(props) => (props.isPresent ? COLOR_ACCENT : '#333')};
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 1rem 0rem;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  opacity: 0.75;
`;

const StreakContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 70vh;
  max-height: 70vh;
  overflow: scroll;
  width: 100%;
`;
