import {
  CheckCircleFilled,
  FacebookFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, message, Modal, Select, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LongPress from './LongPress';
import { COLOR_ACCENT } from './helpers/colorHelper';
import { CATEGORY_OPTIONS, MULTI_OPTIONS } from './helpers/constantHelper';
import Counter from './Counter';
import moment from 'moment/moment';
import { HiPlusCircle } from 'react-icons/hi';
import {
  getHabitApiKeyForUser,
  getRewardApiKeyForUser,
} from './helpers/apiHelper';

export default function UserHabits({ setActiveItem, currentDate, user }) {
  const [habits, setHabits] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editModeId, setEditModeId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newMulti, setNewMulti] = useState('');
  const [showLogCountModal, setShowCountModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState({});
  const [modalSaving, setModalSaving] = useState(false);
  const [newCount, setNewCount] = useState(1);
  const [habitLogsLoading, setHabitLogsLoading] = useState(false);
  const [habitLogs, setHabitLogs] = useState([]);
  const [selectedFilter, setSelectedFitler] = useState('All');

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
      .delete(`/api/${getRewardApiKeyForUser(user)}/${editModeId}?user=${user}`)
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
      .put(`/api/${getRewardApiKeyForUser(user)}/${editModeId}?user=${user}`, {
        title: newTitle,
        reward: newReward,
        category: newCategory,
        multi: newMulti,
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

  const refreshHabits = () => {
    setLoading(true);
    setEditModeId('');
    axios
      .get(`/api/${getRewardApiKeyForUser(user)}?user=${user}`)
      .then((response) => {
        setHabits(response?.data);
        refreshHabitLogs();
        success('Success');
        setLoading(false);
      })
      .catch((err) => {
        error('Error');
        setLoading(false);
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
    if (!showLogCountModal) {
      refreshHabits();
      refreshHabitLogs();
    }
  }, [currentDate, user, showLogCountModal]);

  const saveHabitLog = ({ _id }) => {
    setModalSaving(true);
    axios
      .post(`/api/${getHabitApiKeyForUser(user)}?user=${user}`, {
        time: currentDate,
        habitId: _id,
        count: newCount,
      })
      .then((response) => {
        success('Habit added !');
        setModalSaving(false);
        setShowCountModal(false);
      })
      .catch((err) => {
        console.log(err);
        error('Unable to add Habit !');
        setModalSaving(false);
        setShowCountModal(false);
      });
    setModalSaving(false);
  };

  const todayIdentifier = moment(new Date(currentDate)).format('YYYY-MM-DD');
  const todayHabits = habitLogs?.filter((habitLog) => {
    const habit = habits?.find((h) => h?._id == habitLog?.habitId);
    const dateFromTime = habitLog?.time;
    const isHabitPartOfToday = dateFromTime == todayIdentifier;
    return isHabitPartOfToday;
  });

  const todayAlreadyPresentIds = todayHabits?.map((habit) => habit?.habitId);

  const filteredHabits = habits?.filter((habit) => {
    if (selectedFilter == 'All') {
      return true;
    } else {
      return habit?.category == selectedFilter;
    }
  });

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
      {showLogCountModal && (
        <Modal
          title="Log Habit"
          open={showLogCountModal}
          okText={modalSaving ? 'Saving...' : 'Save'}
          onOk={() => {
            saveHabitLog(selectedHabit);
          }}
          onCancel={() => {
            setShowCountModal(false);
          }}
        >
          <Counter
            habit={selectedHabit}
            newCount={newCount}
            setNewCount={setNewCount}
          />
        </Modal>
      )}

      <FilterContainer>
        {!loading &&
          filteredHabits?.map((habit) => {
            const { title, _id, reward, category, multi } = habit;
            const isEditActive = _id === editModeId;
            return (
              <LongPress
                onLongPress={() => {
                  setEditModeId(_id);
                  setNewReward(reward);
                  setNewTitle(title);
                  setNewCategory(category);
                  setNewMulti(multi);
                }}
              >
                <Card
                  onClick={() => {}}
                  size="small"
                  style={{
                    width: '100%',
                    marginTop: '.5rem',
                    opacity:
                      todayAlreadyPresentIds?.includes(_id) &&
                      habit?.multi !== 'Multi'
                        ? 0.2
                        : 1,
                  }}
                >
                  <RootWrapper>
                    <Wrapper>
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

                          <Select
                            value={newMulti}
                            style={{
                              width: '100%',
                              height: '45px',
                              marginTop: '1rem',
                              textAlign: 'left',
                            }}
                            onChange={(option) => setNewMulti(option)}
                            options={MULTI_OPTIONS}
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
                    {!isEditActive && (
                      <AddWrapper>
                        <Add
                          onClick={() => {
                            setSelectedHabit(habit);
                            setShowCountModal(true);
                          }}
                        >
                          <HiPlusCircle
                            style={{ color: COLOR_ACCENT, fontSize: '1.25rem' }}
                          />
                        </Add>
                      </AddWrapper>
                    )}
                  </RootWrapper>
                </Card>
              </LongPress>
            );
          })}
      </FilterContainer>

      <SelectContainer>
        {!loading && (
          <Select
            value={selectedFilter}
            style={{
              width: '100%',
              height: '45px',
              marginTop: '1rem',
              textAlign: 'left',
            }}
            onChange={(option) => setSelectedFitler(option)}
            options={[{ id: 'All', value: 'All' }, ...CATEGORY_OPTIONS]}
          />
        )}
      </SelectContainer>
    </Container>
  );
}

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
  min-height: 62vh;
  max-height: 62vh;
`;

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

const AddWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  opacity: ${(props) => (props.isPresent ? '0.3' : 1)};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${(props) => (props.isPresent ? '0.3' : 1)};
`;

const RootWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Add = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 50px;
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
  min-height: 70vh;
  max-height: 70vh;
  overflow: scroll;
  width: 102%;
`;
