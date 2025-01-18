import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Select, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LongPress from './LongPress';
import { COLOR_ACCENT } from './helpers/colorHelper';
import { CATEGORY_OPTIONS } from './helpers/constantHelper';

export default function JeevaHabits() {
  const [habits, setHabits] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editModeId, setEditModeId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const info = (message) => {
    messageApi.info('Hello, Ant Design!');
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  const deleteHabit = () => {
    setDeleteLoading(true);
    axios
      .delete(`/api/jeevareward/${editModeId}`)
      .then((response) => {
        success('Habit delete !');
        setDeleteLoading(false);
        refreshHabits();
      })
      .catch((err) => {
        error('Unable to add Habit !');
        setDeleteLoading(false);
        refreshHabits();
      });
  };

  const updateHabit = () => {
    setEditLoading(true);
    axios
      .put(`/api/jeevareward/${editModeId}`, {
        title: newTitle,
        reward: newReward,
        category: newCategory,
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
          const { title, _id, reward, category } = habit;
          const isEditActive = _id === editModeId;
          return (
            <LongPress
              onLongPress={() => {
                setEditModeId(_id);
                setNewReward(reward);
                setNewTitle(title);
                setNewCategory(category);
              }}
            >
              <Card
                size="small"
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

                      <Select
                        value={newCategory}
                        style={{
                          width: '100%',
                          height: '45px',
                          marginTop: '1rem',
                          textAlign: 'left',
                        }}
                        onChange={(option) => setNewCategory(option)}
                        options={CATEGORY_OPTIONS}
                      />

                      <ButtonContainer>
                        <Button
                          color="primary"
                          variant="solid"
                          loading={deleteLoading}
                          style={{
                            width: '30%',
                            marginTop: '1rem',
                            padding: '1.25rem 1rem',
                            marginRight: '1rem',
                          }}
                          onClick={() => {
                            deleteHabit();
                          }}
                        >
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button
                          color="primary"
                          variant="solid"
                          loading={editLoading}
                          style={{
                            width: '70%',
                            marginTop: '1rem',
                            padding: '1.25rem 1rem',
                          }}
                          onClick={() => {
                            updateHabit();
                          }}
                        >
                          {editLoading ? 'Saving...' : 'Save'}
                        </Button>
                      </ButtonContainer>
                    </EditWrapper>
                  )}
                  {!isEditActive && <Name>{title}</Name>}
                  {!isEditActive && <Category>{category}</Category>}
                  {!isEditActive && <Reward>{reward} Rs</Reward>}
                </Wrapper>
              </Card>
            </LongPress>
          );
        })}
    </Container>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

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
  flex: 1;
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
  min-height: 80vh;
  max-height: 80vh;
  overflow: scroll;
  width: 98%;
`;
