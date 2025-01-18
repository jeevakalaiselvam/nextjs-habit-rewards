import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LongPress from './LongPress';
import { COLOR_ACCENT } from './helpers/colorHelper';

export default function JeevaHabits() {
  const [habits, setHabits] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editModeId, setEditModeId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('');

  const info = (message) => {
    messageApi.info('Hello, Ant Design!');
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  const updateHabit = () => {
    setEditLoading(true);
    axios
      .put(`/api/jeevareward/${editModeId}`, {
        title: newTitle,
        reward: newReward,
      })
      .then((response) => {
        success('Habit updated !');
        setEditLoading(false);
        refreshHabits();
      })
      .catch((err) => {
        error('Unable to add Habit !');
        setEditLoading(false);
        refreshHabits();
      });
  };

  useEffect(() => {
    refreshHabits();
  }, []);

  const refreshHabits = () => {
    setLoading(true);
    setEditModeId('');
    axios
      .get('/api/jeevareward')
      .then((response) => {
        setHabits(response?.data);
        setLoading(false);
        success('Success');
      })
      .catch((err) => {
        error('Error');
        setLoading(false);
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
      {!loading &&
        habits?.map((habit) => {
          const { title, _id, reward } = habit;
          const isEditActive = _id === editModeId;
          return (
            <LongPress
              onLongPress={() => {
                setEditModeId(_id);
                setNewReward(reward);
                setNewTitle(title);
              }}
            >
              <Card
                style={{
                  width: '100%',
                  marginTop: '1rem',
                }}
              >
                <Wrapper onPress>
                  {isEditActive && (
                    <EditWrapper>
                      <Input
                        placeholder={title}
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={{ width: '100%', marginTop: '1rem' }}
                      />

                      <Input
                        type="number"
                        value={newReward}
                        placeholder={reward}
                        onChange={(e) => setNewReward(e.target.value)}
                        style={{ width: '100%', marginTop: '1rem' }}
                      />

                      <Button
                        type="primary"
                        loading={editLoading}
                        style={{
                          width: '100%',
                          marginTop: '1rem',
                          padding: '1.25rem 1rem',
                        }}
                        onClick={() => {
                          updateHabit();
                        }}
                      >
                        Save Habit
                      </Button>
                    </EditWrapper>
                  )}
                  {!isEditActive && <Name>{title}</Name>}
                  {!isEditActive && <Reward>{reward} Rs</Reward>}
                </Wrapper>
              </Card>
            </LongPress>
          );
        })}
    </Container>
  );
}

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
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
  width: 100%;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  color: ${COLOR_ACCENT};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 80vh;
  max-height: 80vh;
  overflow: scroll;
  width: 98%;
`;
