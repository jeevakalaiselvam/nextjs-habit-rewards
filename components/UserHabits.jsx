import {
  CheckCircleFilled,
  FacebookFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Input,
  message,
  Modal,
  Select,
  Spin,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LongPress from './LongPress';
import {
  CARD_BACKGROUND,
  COLOR_ACCENT,
  COLOR_ACCENT_DARK,
  COLOR_BACKGROUND,
  COLOR_SUCCESS,
} from './helpers/colorHelper';
import { CATEGORY_OPTIONS, MULTI_OPTIONS } from './helpers/constantHelper';
import Counter from './Counter';
import moment from 'moment/moment';
import { HiPlusCircle } from 'react-icons/hi';
import {
  getHabitApiKeyForUser,
  getHabitApiKeyForUserBulk,
  getRewardApiKeyForUser,
} from './helpers/apiHelper';
import RewardCount from './RewardCount';

export default function UserHabits({
  setActiveItem,
  currentDate,
  user,
  setTodayAmount,
}) {
  const [habits, setHabits] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [habitButtonLoading, setHabitButtonLoading] = useState(false);
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
  const [showAll, setShowAll] = useState(false);
  const [habitLogs, setHabitLogs] = useState([]);
  const [draftHabits, setDraftHabits] = useState([]);
  const [selectedFilter, setSelectedFitler] = useState(
    CATEGORY_OPTIONS?.[0]?.id
  );

  const info = (message) => {
    messageApi.info('Hello, Ant Design!');
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  useEffect(() => {
    let categoryForUsers = CATEGORY_OPTIONS?.filter((category) => {
      const { id, value } = category;
      const habitsForCategory = habits?.filter((habit) => {
        return habit?.category == id;
      });
      return habitsForCategory?.length > 0;
    });

    const allCatOptions = categoryForUsers?.map((item) => item?.value);

    if (!allCatOptions?.includes(selectedFilter)) {
      setSelectedFitler(categoryForUsers?.[0]?.id);
    }
  }, [user, habits]);

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
    if (
      newTitle?.length > 0 &&
      newReward?.length > 0 &&
      newCategory?.length > 0 &&
      newMulti?.length > 0
    ) {
      setEditLoading(true);
      axios
        .put(
          `/api/${getRewardApiKeyForUser(user)}/${editModeId}?user=${user}`,
          {
            title: newTitle,
            reward: newReward,
            category: newCategory,
            multi: newMulti,
          }
        )
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
    } else {
      info('Details missing !');
    }
  };

  const refreshHabits = () => {
    setLoading(true);
    setEditModeId('');
    setHabitLogsLoading(true);
    axios
      .get(`/api/${getRewardApiKeyForUser(user)}?user=${user}`)
      .then((response) => {
        let newHabits = response?.data;
        setHabits(newHabits);

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
    setHabitButtonLoading(false);
    setDraftHabits([]);
    refreshHabits();
    refreshHabitLogs();
  }, [user, currentDate, showLogCountModal]);

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

  const saveHabitLogToDraft = ({ _id }) => {
    setDraftHabits((old) => [
      ...old,
      {
        time: currentDate,
        habitId: _id,
        count: newCount,
      },
    ]);
    console.log(draftHabits, _id);
  };

  const saveAllHabitsInBulk = () => {
    setHabitButtonLoading(true);
    axios
      .post(`/api/${getHabitApiKeyForUserBulk(user)}?user=${user}`, {
        habits: draftHabits,
      })
      .then((response) => {
        success('Habits added !');
        setModalSaving(false);
        setHabitButtonLoading(false);
        setShowCountModal(false);
        refreshHabits();
        refreshHabitLogs();
      })
      .catch((err) => {
        console.log(err);
        error('Unable to add Habits !');
        setModalSaving(false);
        setShowCountModal(false);
        setHabitButtonLoading(false);
        setDraftHabits([]);
        refreshHabits();
        refreshHabitLogs();
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

  const habitLoggedCountToday = {};
  const habitDraftCount = {};
  const todayAlreadyPresentIds = todayHabits?.map((habit) => {
    if (!habitLoggedCountToday?.[habit?.habitId]) {
      habitLoggedCountToday[habit?.habitId] = 1;
    } else {
      habitLoggedCountToday[habit?.habitId] += 1;
    }
    return habit?.habitId;
  });

  const currentAddedDrafts = draftHabits?.map((habit) => {
    if (!habitDraftCount?.[habit?.habitId]) {
      habitDraftCount[habit?.habitId] = 1;
    } else {
      habitDraftCount[habit?.habitId] += 1;
    }
    return habit?.habitId;
  });

  let filteredHabits = habits?.filter((habit) => {
    return (
      habit?.category == selectedFilter || (showAll && habit?.type == 'NEW1')
    );
  });

  filteredHabits = filteredHabits.sort((habit1, habit2) =>
    habit1?.title?.toLowerCase().localeCompare(habit2?.title?.toLowerCase())
  );

  const todayHabitRewards = todayHabits?.reduce((acc, innerHabit) => {
    const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
    return acc + innerHabit?.count * habit?.reward;
  }, 0);

  useEffect(() => {
    const todayHabitRewards = todayHabits?.reduce((acc, innerHabit) => {
      const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
      return acc + innerHabit?.count * habit?.reward;
    }, 0);

    const draftHabitRewards = draftHabits?.reduce((acc, innerHabit) => {
      const habit = habits?.find((h) => h?._id == innerHabit?.habitId);
      return acc + innerHabit?.count * habit?.reward;
    }, 0);

    let total = todayHabitRewards + draftHabitRewards;
    setTodayAmount(total);
  }, [todayHabits, draftHabits]);

  return (
    <Container>
      {(loading || habitLogsLoading) && (
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
          <CounterContainer>
            <Counter
              habit={selectedHabit}
              newCount={newCount}
              setNewCount={setNewCount}
            />
          </CounterContainer>
        </Modal>
      )}
      {!loading && !habitLogsLoading && (
        <CatNameContainer>
          {showAll ? 'All Habits' : selectedFilter}
          <RewardContainer>
            <Checkbox
              checked={showAll}
              onChange={() => {
                setShowAll((old) => !old);
              }}
              title="Show All"
            >
              Show All{' '}
            </Checkbox>
          </RewardContainer>
        </CatNameContainer>
      )}

      <FilterContainer>
        {!loading &&
          !habitLogsLoading &&
          filteredHabits?.length > 0 &&
          filteredHabits?.map((habit) => {
            const { title, _id, reward, category, multi } = habit;
            const isEditActive = _id === editModeId;
            const countToday = habitLoggedCountToday?.[_id];
            const draftCount = habitDraftCount?.[_id];
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
                      (habit?.multi !== 'Multi' || true)
                        ? 0.5
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
                      {!isEditActive && <Count>{countToday}</Count>}
                      {!isEditActive && <Name>{title}</Name>}
                      {!isEditActive && (
                        <CategoryReward>
                          <Reward>{reward} Rs</Reward>
                        </CategoryReward>
                      )}
                    </Wrapper>
                    {<DraftCount>{showAll ? draftCount : ''}</DraftCount>}
                    {!isEditActive && (
                      <AddWrapper>
                        <Add
                          onClick={() => {
                            if (!showAll) {
                              setSelectedHabit(habit);
                              setShowCountModal(true);
                            } else {
                              console.log(_id);
                              saveHabitLogToDraft(habit);
                            }
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

      {(filteredHabits?.length > 0 || true) && !showAll && (
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
            >
              {CATEGORY_OPTIONS?.filter((category) => {
                const { id, value } = category;
                const habitsForCategory = habits?.filter((habit) => {
                  return habit?.category == id;
                });
                return habitsForCategory?.length > 0;
              })?.map((category) => {
                const { id, value } = category;
                const habitsForCategory = habits?.filter((habit) => {
                  return habit?.category == id && habit?.type == 'NEW1';
                });
                return (
                  <Option value={value}>
                    <OptionContainer>
                      <OptionName>{value}</OptionName>
                      <OptionCount> {habitsForCategory?.length}</OptionCount>
                    </OptionContainer>
                  </Option>
                );
              })}
            </Select>
          )}
        </SelectContainer>
      )}
      {filteredHabits?.length > 0 && showAll && (
        <SelectContainer>
          <Button
            loading={habitButtonLoading}
            type="primary"
            color="primary"
            style={{ width: '100%' }}
            onClick={() => {
              saveAllHabitsInBulk();
            }}
          >
            SAVE HABITS
          </Button>
        </SelectContainer>
      )}
    </Container>
  );
}

const DraftCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${COLOR_ACCENT_DARK};
  min-width: 20px;
  background-color: ${COLOR_ACCENT};
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  color: #fefefe;
`;

const CatNameContainer = styled.div`
  color: #fefefe;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  opacity: 0.5;
  padding: 0.5rem 0rem 0.25rem 0rem;
`;

const RewardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding: 0.25rem 1rem 0.25rem 1rem;
`;

const CategoryName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex: 1;
  padding: 0.5rem 0.25rem 0.25rem 0.5rem;
  color: #fefefe;
  position: relative;
`;

const OptionCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 0rem 1rem;
`;

const OptionName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0rem 1rem;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

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
  min-height: 60vh;
  max-height: 60vh;
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
  justify-content: center;
  padding: 0rem 8px 0rem 8px;
  flex: 1;
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  opacity: 0.25;
`;

const CategoryReward = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100px;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR_ACCENT};
  width: 75px;
`;

const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR_SUCCESS};
  width: 20px;
  background-color: ${COLOR_BACKGROUND};
  border-radius: 4px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 78vh;
  max-height: 78vh;
  overflow: hidden;
  width: 102%;
`;
