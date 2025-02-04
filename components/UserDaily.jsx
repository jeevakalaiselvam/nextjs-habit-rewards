import { Button, Card, message, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLOR_ACCENT } from './helpers/colorHelper';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import LongPress from './LongPress';
import {
  getHabitApiKeyForUser,
  getRewardApiKeyForUser,
} from './helpers/apiHelper';

export default function UserHabitLog({ currentDate, user, setTodayAmount }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [habitLogsLoading, setHabitLogsLoading] = useState(false);
  const [habitLogs, setHabitLogs] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [habits, setHabits] = useState([]);
  const [selectedToDelete, setSelectedToDelete] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

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
      .get(`/api/${getRewardApiKeyForUser(user)}?user=${user}`)
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

  const todayIdentifier = moment(new Date(currentDate)).format('YYYY-MM-DD');

  const deleteHabit = () => {
    setDeleting(true);
    axios
      .delete(
        `/api/${getHabitApiKeyForUser(user)}/${selectedToDelete}?user=${user}`
      )
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

  const todayHabits = habitLogs?.filter((habitLog) => {
    const habit = habits?.find((h) => h?._id == habitLog?.habitId);
    const dateFromTime = habitLog?.time;
    const isHabitPartOfToday = dateFromTime == todayIdentifier;
    return isHabitPartOfToday;
  });

  useEffect(() => {
    const todayHabitRewards = todayHabits?.reduce((acc, innerHabit) => {
      const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
      return acc + innerHabit?.count * habit?.reward;
    }, 0);

    setTodayAmount(todayHabitRewards);
  }, [todayHabits]);

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
      {!habitLogs?.length > 0 && <NoData>No Habit Logs</NoData>}
      {!habitLogsLoading &&
        !habitsLoading &&
        habitLogs
          ?.filter((habitLog) => {
            const habit = habits?.find((h) => h?._id == habitLog?.habitId);
            const dateFromTime = habitLog?.time;
            const isHabitPartOfToday = dateFromTime == todayIdentifier;
            return isHabitPartOfToday;
          })
          ?.map((habitLog) => {
            const habit = habits?.find((h) => h?._id == habitLog?.habitId);

            return (
              <LongPress
                onLongPress={() => {
                  setSelectedToDelete(habitLog?._id);
                  setDeleteMode(true);
                }}
              >
                <Card
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                  }}
                >
                  <Wrapper>
                    {!deleteMode && <Name>{habit?.title}</Name>}
                    {!deleteMode && <Category>{habit?.category}</Category>}
                    {!deleteMode && (
                      <Reward>{habitLog?.count * habit?.reward} Rs</Reward>
                    )}
                    {deleteMode && <Name>{habit?.title}</Name>}
                    {deleteMode && (
                      <Delete
                        onClick={() => {
                          deleteHabit();
                        }}
                      >
                        <Button color="danger" variant="solid">
                          Delete
                        </Button>
                      </Delete>
                    )}
                  </Wrapper>
                </Card>
              </LongPress>
            );
          })}
    </Container>
  );
}

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #fefefe;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  min-height: 70vh;
  max-height: 70vh;
  overflow: scroll;
  width: 103%;
`;
