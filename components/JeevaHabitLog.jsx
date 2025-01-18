import { Button, Card, message, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLOR_ACCENT } from './helpers/colorHelper';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import LongPress from './LongPress';

export default function JeevaHabitLog() {
  const [messageApi, contextHolder] = message.useMessage();
  const [habitLogs, setHabitLogs] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    axios
      .get('/api/jeevareward')
      .then((response) => {
        setHabits(response?.data);
        refreshHabitLogs();
        success('Success');
      })
      .catch((err) => {
        error('Error');
        refreshHabitLogs();
      });
  };

  const refreshHabitLogs = () => {
    setLoading(true);
    axios
      .get('/api/jeevahabit')
      .then((response) => {
        setHabitLogs(response?.data);
        setLoading(false);
        success('Success');
      })
      .catch((err) => {
        error('Error');
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshHabits();
    refreshHabitLogs();
  }, []);

  const todayIdentifier = moment(moment().utc().toISOString()).format(
    'YYYY-MM-DD'
  );

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

  return (
    <Container>
      {loading && (
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
      {habitLogs
        ?.filter((habitLog) => {
          const habit = habits?.find((h) => h?._id == habitLog?.habitId);
          const dateFromTime = moment(habitLog?.time)
            .utc()
            .format('YYYY-MM-DD');
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
  width: 100%;
`;
