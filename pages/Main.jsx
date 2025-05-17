import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  COLOR_ACH,
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE,
  COLOR_BLUE_DARK,
  COLOR_BLUE_LIGHT,
  COLOR_GOLD,
  COLOR_GREEN,
  COLOR_GREY,
  COLOR_PURPLE,
  COLOR_RED,
  COLOR_WHITE,
  generateDarkTextColorForLightBg,
} from '../helpers/colorHelper';
import { Dropdown, message, Popconfirm, Space, Spin } from 'antd';
import { FaCaretDown, FaGlobe, FaRupeeSign, FaTrophy } from 'react-icons/fa';
import { LuIndianRupee } from 'react-icons/lu';
import {
  Battlefield2042,
  Feature,
  GAMES_ARRAY,
  Habit,
  HABIT_ARRAY,
  ICON_MAPPER,
  MONEY_TRACKER,
  Work,
  WORK_ARRAY,
} from '../helpers/gameHelper';
import { TbRefresh } from 'react-icons/tb';
import { MdVideogameAsset } from 'react-icons/md';
import axios from 'axios';
import {
  HiHome,
  HiLibrary,
  HiMailOpen,
  HiOutlinePlusSm,
  HiPlusCircle,
  HiRefresh,
  HiShieldCheck,
} from 'react-icons/hi';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { LoadingOutlined } from '@ant-design/icons';

const SECTION_MONEY = 'SECTION_MONEY';
const SECTION_WORK = 'Work';
const SECTION_HABIT = 'Habit';
const SECTION_GAMES = 'Games';
const SECTION_ICONS = 'Icons';

export default function Main() {
  const [showRecentAchUnlock, setShowRecentAchUnlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [selected, setSelected] = useState(SECTION_ICONS);
  const [showModal, setShowModal] = useState(false);
  const [selectedOverviewAch, setSelectedOverviewAch] = useState(null);
  const [selectedOverviewAchGame, setSelectedOverviewAchGame] = useState(null);
  const [formValues, setFormValues] = useState({
    type: '',
    name: '',
    title: '',
    description: '',
    date: new Date(),
  });

  const itemsType = [
    {
      key: '11',
      label: <div style={{ width: '100%' }}>All Types</div>,
      disabled: true,
    },
    {
      key: 'Games',
      label: 'Games',
      extra: '⌘G',
    },
    {
      key: 'Work',
      label: 'Work',
      extra: '⌘G',
    },
    {
      key: 'Habit',
      label: 'Habit',
      extra: '⌘H',
    },
  ];

  const itemsGame = [
    {
      key: '22',
      label: <div style={{ width: '100%' }}>All Games</div>,
      disabled: true,
    },
    ...GAMES_ARRAY?.map((game) => {
      return {
        key: game,
        label: game,
        extra: `⌘${game?.[0]?.toUpperCase()}`,
      };
    }),
  ];

  const itemsWork = [
    {
      key: '33',
      label: <div style={{ width: '100%' }}>All Activity</div>,
      disabled: true,
    },
    ...WORK_ARRAY?.map((game) => {
      return {
        key: game,
        label: game,
        extra: `⌘${game?.[0]?.toUpperCase()}`,
      };
    }),
  ];

  const itemsHabit = [
    {
      key: '33',
      label: <div style={{ width: '100%' }}>All Habit</div>,
      disabled: true,
    },
    ...HABIT_ARRAY?.map((game) => {
      return {
        key: game,
        label: game,
        extra: `⌘${game?.[0]?.toUpperCase()}`,
      };
    }),
  ];

  const handleItemClickType = (e) => {
    setFormValues((old) => ({
      ...old,
      type: String(e.key),
      name: '',
      title: '',
      description: '',
    }));
  };

  const handleItemClickName = (e) => {
    setFormValues((old) => ({
      ...old,
      name: String(e.key),
      title: '',
      description: '',
    }));

    setFormValues((old) => ({ ...old, title: String(e.key) }));
  };

  const menuTypeType = {
    items: itemsType,
    onClick: handleItemClickType,
  };

  const menuTypeGame = {
    items: itemsGame,
    onClick: handleItemClickName,
  };

  const menuTypeWork = {
    items: itemsWork,
    onClick: handleItemClickName,
  };

  const menuTypeHabit = {
    items: itemsHabit,
    onClick: handleItemClickName,
  };

  const refreshAchievements = () => {
    setLoading(true);
    try {
      axios.get('/api/jeevaachievement').then((response) => {
        setAchievements([]);
        setAchievements(response?.data);
        setLoading(false);
      });
    } catch (e) {
      message.info('Error refreshing Achievement !');
      setLoading(false);
    }
  };

  const saveAchievement = () => {
    setLoading(true);
    try {
      axios
        .post('/api/jeevaachievement', { ...formValues })
        .then((response) => {
          setShowModal(false);
          setShowRecentAchUnlock(true);
          refreshAchievements();
        });
    } catch (e) {
      message.info('Error saving Achievement !');
      setLoading(false);
    }
  };

  const deleteAchievement = (ach) => {
    setLoading(true);
    try {
      axios.delete(`/api/jeevaachievement/${ach?._id}`).then((response) => {
        refreshAchievements();
      });
    } catch (e) {
      message.info('Error deleting Achievement !');
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAchievements();
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowRecentAchUnlock(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [achievements]);

  useEffect(() => {
    if (showRecentAchUnlock) {
      const audio = new Audio('/effect.mp3');
      audio.play();
    }
  }, [showRecentAchUnlock]);

  let achToShow = achievements
    ?.sort((ach1, ach2) => new Date(ach2?.unlocked) - new Date(ach1?.unlocked))
    ?.map((item, index) => ({ ...item, index: achievements?.length - index }));

  let lastAch = achToShow?.[achToShow?.length - 1];

  achToShow = achToShow?.filter((ach) => ach?.type == selected);

  let nonMoneyAchievement = [];
  let moneyAchievement = [];

  achievements?.forEach((ach) => {
    let isMoneyRelated = ach?.type == Work || ach?.type == Habit;
    moneyAchievement.push(ach);
  });

  let totalEarned = moneyAchievement?.reduce((acc, ach) => {
    return acc + (MONEY_TRACKER?.[ach?.name] ?? 10);
  }, 0);

  let isMoneyRelatedSectionActive =
    selected == SECTION_HABIT || selected == SECTION_WORK;

  let isLongAchievementsActive =
    selected == SECTION_GAMES ||
    selected == SECTION_HABIT ||
    selected == SECTION_WORK;

  let isOverviewMode = selected == SECTION_MONEY;

  let isGameIconsActive = selected == SECTION_ICONS;

  let finalSelectedOverviewAch = selectedOverviewAch ?? achievements?.[0];
  let isfinalMoneyRelated =
    finalSelectedOverviewAch?.type == Work ||
    finalSelectedOverviewAch?.type == Habit;

  let onlyGameAchs = achievements?.filter((ach) => ach?.type == 'Games');
  let finalSelectedOverviewGameAch = selectedOverviewAch ?? onlyGameAchs?.[0];

  return (
    <Container>
      <Header>
        {!isMoneyRelatedSectionActive && !isOverviewMode && (
          <HLeft>
            <span
              style={{
                fontSize: '1.25rem',
                transform: 'translateY(-2px)',
                marginRight: '.25rem',
              }}
            >
              {onlyGameAchs?.length}
            </span>
            <span style={{ fontSize: '1.1rem' }}>
              <FaTrophy />
            </span>
          </HLeft>
        )}
        {isOverviewMode && (
          <HLeft>
            <span
              style={{
                color: COLOR_GREEN,
                fontSize: '1.25rem',
                transform: 'translateY(-2px)',
                marginRight: '.25rem',
              }}
            >
              NotRealLogan - {achievements?.length}
            </span>
            <span style={{ fontSize: '1.1rem', color: COLOR_GREEN }}>
              <FaTrophy />
            </span>
          </HLeft>
        )}
        {isMoneyRelatedSectionActive && (
          <HLeft>
            <span style={{ fontSize: '1.1rem' }}>
              <FaIndianRupeeSign />
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                transform: 'translateY(-2px)',
                marginRight: '.25rem',
              }}
            >
              {totalEarned}
            </span>
          </HLeft>
        )}
        <HRight>
          <AddIcon
            onClick={() => {
              setShowModal(true);
            }}
          >
            <HiOutlinePlusSm />
          </AddIcon>
        </HRight>{' '}
        <HRight>
          <AddIconRefresh
            onClick={() => {
              refreshAchievements();
            }}
          >
            <TbRefresh />
          </AddIconRefresh>
        </HRight>
      </Header>
      {showModal && (
        <ModalContainer>
          <ModalContent>
            <Form>
              <Title>Add Achievement</Title>
              <Row>
                <SubTitle>Type</SubTitle>
                <Dropdown
                  trigger={['click']}
                  overlayStyle={{ minWidth: '60%' }}
                  menu={menuTypeType}
                  overlayClassName="full-width-dropdown"
                >
                  <Space>
                    <span
                      style={{
                        fontSize: '.9rem',
                        color: '#ACAEB2',
                      }}
                    >
                      {formValues?.type ? formValues?.type : 'Select Type'}
                    </span>
                    <Caret>
                      <FaCaretDown />
                    </Caret>
                  </Space>
                </Dropdown>
              </Row>
              {formValues?.type == 'Games' && (
                <Row>
                  <SubTitle>Game</SubTitle>
                  <Dropdown
                    trigger={['click']}
                    overlayStyle={{ minWidth: '60%' }}
                    menu={menuTypeGame}
                    overlayClassName="full-width-dropdown"
                  >
                    <Space>
                      <span
                        style={{
                          fontSize: '.9rem',
                          color: '#ACAEB2',
                        }}
                      >
                        {formValues?.name ? formValues?.name : 'Select Game'}
                      </span>
                      <Caret>
                        <FaCaretDown />
                      </Caret>
                    </Space>
                  </Dropdown>
                </Row>
              )}
              {formValues?.type == 'Work' && (
                <Row>
                  <SubTitle>Work</SubTitle>
                  <Dropdown
                    trigger={['click']}
                    overlayStyle={{ minWidth: '60%' }}
                    menu={menuTypeWork}
                    overlayClassName="full-width-dropdown"
                  >
                    <Space>
                      <span
                        style={{
                          fontSize: '.9rem',
                          color: '#ACAEB2',
                        }}
                      >
                        {formValues?.name ? formValues?.name : 'Select Work'}
                      </span>
                      <Caret>
                        <FaCaretDown />
                      </Caret>
                    </Space>
                  </Dropdown>
                </Row>
              )}
              {formValues?.type == 'Habit' && (
                <Row>
                  <SubTitle>Habit</SubTitle>
                  <Dropdown
                    trigger={['click']}
                    overlayStyle={{ minWidth: '60%' }}
                    menu={menuTypeHabit}
                    overlayClassName="full-width-dropdown"
                  >
                    <Space>
                      <span
                        style={{
                          fontSize: '.9rem',
                          color: '#ACAEB2',
                        }}
                      >
                        {formValues?.name ? formValues?.name : 'Select Habit'}
                      </span>
                      <Caret>
                        <FaCaretDown />
                      </Caret>
                    </Space>
                  </Dropdown>
                </Row>
              )}
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={formValues?.title}
                  onChange={(e) => {
                    setFormValues((old) => ({
                      ...old,
                      title: String(e.target.value),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>Description</SubTitle>
              </Row>
              <RowInputDescription>
                <textarea
                  value={formValues?.description}
                  type="text"
                  onChange={(e) => {
                    setFormValues((old) => ({
                      ...old,
                      description: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall onClick={() => setShowModal(false)} color={COLOR_RED}>
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => saveAchievement()} color={COLOR_GREEN}>
              SAVE
            </ButtonSmall>
          </ModalBottom>
        </ModalContainer>
      )}
      <Middle showModal={showModal}>
        {!loading && (
          <MiddleTopContainer>
            {achToShow?.length == 0 &&
              !isOverviewMode &&
              isLongAchievementsActive && <NoData>No Achievements</NoData>}
            {achToShow?.length > 0 &&
              isLongAchievementsActive &&
              !isOverviewMode &&
              achToShow?.map((ach, index) => {
                let isMoneyRelated = ach?.type == Work || ach?.type == Habit;
                return (
                  <A1Container>
                    <TagCount>
                      <InnerTag>{ach?.index}</InnerTag>
                    </TagCount>
                    <Popconfirm
                      title="Delete Achievement"
                      description="Are you sure to delete this task?"
                      onConfirm={() => {
                        deleteAchievement(ach);
                      }}
                      onCancel={() => {}}
                      okText="Yes"
                      cancelText="No"
                    >
                      <A1Icon icon={ICON_MAPPER[ach?.name]}></A1Icon>
                    </Popconfirm>
                    <A1Right>
                      <A1Title>{ach?.title}</A1Title>
                      <A1Desc>{ach?.description}</A1Desc>
                    </A1Right>
                    <Tag>
                      <InnerTagMoney>
                        <span
                          style={{
                            transform: 'translateY(1px)',
                            fontSize: '.7rem',
                          }}
                        >
                          <FaIndianRupeeSign />{' '}
                        </span>
                        {MONEY_TRACKER[ach?.name] ?? 10}
                      </InnerTagMoney>
                    </Tag>
                  </A1Container>
                );
              })}
            {isOverviewMode && (
              <OverviewMode>
                <TotalAmount>
                  <span
                    style={{
                      color: COLOR_GREEN,
                      fontSize: '4rem',
                      fontWeight: '200',
                      transform: 'translateY(4px)',
                    }}
                  >
                    <LuIndianRupee />
                  </span>

                  <span style={{ fontSize: '5rem', color: COLOR_GREEN }}>
                    {totalEarned}
                  </span>
                </TotalAmount>
                <RecentItems>
                  <RecentInner>
                    {achievements?.map((ach, index) => {
                      return (
                        <AchSmallContainer>
                          <AchSmall
                            image={ach?.url ?? ICON_MAPPER?.[ach?.name]}
                            onClick={() => {
                              setSelectedOverviewAch(ach);
                            }}
                          ></AchSmall>
                        </AchSmallContainer>
                      );
                    })}
                  </RecentInner>
                </RecentItems>
                {!showRecentAchUnlock && (
                  <RecentClick>
                    <A1ContainerMoney>
                      <A1Icon
                        icon={ICON_MAPPER[finalSelectedOverviewAch?.name]}
                      ></A1Icon>
                      <A1Right>
                        <A1Title>{finalSelectedOverviewAch?.title}</A1Title>
                        <A1Desc>{finalSelectedOverviewAch?.description}</A1Desc>
                      </A1Right>
                      <Tag>
                        {
                          <InnerTagMoney>
                            <span
                              style={{
                                transform: 'translateY(1px)',
                                fontSize: '.7rem',
                              }}
                            >
                              <FaIndianRupeeSign />
                            </span>
                            {MONEY_TRACKER[finalSelectedOverviewAch?.name] ??
                              10}
                          </InnerTagMoney>
                        }
                      </Tag>
                    </A1ContainerMoney>
                  </RecentClick>
                )}
              </OverviewMode>
            )}
            {isGameIconsActive && (
              <OverviewMode>
                <RecentItemsGame>
                  <RecentInner>
                    {onlyGameAchs?.map((ach, index) => {
                      return (
                        <AchSmallContainer>
                          <AchSmall
                            image={ach?.url ?? ICON_MAPPER?.[ach?.name]}
                            onClick={() => {
                              setSelectedOverviewAchGame(ach);
                            }}
                          >
                            <InnerCount>
                              <span>{10}</span>
                              <span
                                style={{
                                  fontSize: '.8rem',
                                  marginLeft: '.1rem',
                                  transform: 'translateY(1px)',
                                }}
                              >
                                <FaIndianRupeeSign />
                              </span>
                            </InnerCount>
                          </AchSmall>
                        </AchSmallContainer>
                      );
                    })}
                  </RecentInner>
                </RecentItemsGame>
                {!showRecentAchUnlock && (
                  <RecentClick>
                    <A1ContainerMoney>
                      <A1Icon
                        icon={
                          finalSelectedOverviewGameAch?.url ??
                          ICON_MAPPER[finalSelectedOverviewGameAch?.name]
                        }
                      ></A1Icon>
                      <A1Right>
                        <A1Title>{finalSelectedOverviewGameAch?.title}</A1Title>
                        <A1Desc>
                          {finalSelectedOverviewGameAch?.description}
                        </A1Desc>
                      </A1Right>
                      <Tag>
                        {
                          <InnerTagMoney>
                            <span
                              style={{
                                transform: 'translateY(1px)',
                                fontSize: '.7rem',
                              }}
                            >
                              <FaIndianRupeeSign />
                            </span>
                            {MONEY_TRACKER[
                              finalSelectedOverviewGameAch?.name
                            ] ?? 10}
                          </InnerTagMoney>
                        }
                      </Tag>
                    </A1ContainerMoney>
                  </RecentClick>
                )}
              </OverviewMode>
            )}
          </MiddleTopContainer>
        )}
        {loading && (
          <MiddleTopContainer>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </MiddleTopContainer>
        )}
        {showRecentAchUnlock && (
          <UnlockTrigger>
            <A1Container>
              <Popconfirm
                title="Delete Achievement"
                description="Are you sure to delete this task?"
                onConfirm={() => {}}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <A1Icon icon={ICON_MAPPER[lastAch?.name]}></A1Icon>
              </Popconfirm>

              <A1Right>
                <A1Title>{lastAch?.title}</A1Title>
                <A1Desc>{lastAch?.description}</A1Desc>
              </A1Right>
              <Tag>
                <InnerTag>DONE</InnerTag>
              </Tag>
            </A1Container>
          </UnlockTrigger>
        )}

        <Sections>
          <Section
            selected={selected == SECTION_MONEY}
            onClick={() => {
              setSelected(SECTION_MONEY);
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginLeft: '.5rem',
                marginBottom: '.25rem',
              }}
            >
              <HiLibrary />
            </span>
            <span
              style={{
                fontSize: '.75rem',
                transform: 'translateY(-1px)',
                marginLeft: '.5rem',
              }}
            >
              MONEY
            </span>
          </Section>
          <Section
            selected={selected == SECTION_WORK}
            onClick={() => {
              setSelected(SECTION_WORK);
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginLeft: '.5rem',
                marginBottom: '.25rem',
              }}
            >
              <HiMailOpen />
            </span>
            <span
              style={{
                fontSize: '.75rem',
                transform: 'translateY(-1px)',
                marginLeft: '.5rem',
              }}
            >
              WORK
            </span>
          </Section>
          <Section
            selected={selected == SECTION_HABIT}
            onClick={() => {
              setSelected(SECTION_HABIT);
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginLeft: '.5rem',
                marginBottom: '.25rem',
              }}
            >
              <HiShieldCheck />
            </span>
            <span
              style={{
                fontSize: '.75rem',
                transform: 'translateY(-1px)',
                marginLeft: '.5rem',
              }}
            >
              HABITS
            </span>
          </Section>{' '}
          <Section
            selected={selected == SECTION_GAMES}
            onClick={() => {
              setSelected(SECTION_GAMES);
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginLeft: '.5rem',
                marginBottom: '.25rem',
              }}
            >
              <MdVideogameAsset />
            </span>
            <span
              style={{
                fontSize: '.75rem',
                transform: 'translateY(-1px)',
                marginLeft: '.5rem',
              }}
            >
              GAMES
            </span>
          </Section>
          <Section
            selected={selected == SECTION_ICONS}
            onClick={() => {
              setSelected(SECTION_ICONS);
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginLeft: '.5rem',
                marginBottom: '.25rem',
              }}
            >
              <HiHome />
            </span>
            <span
              style={{
                fontSize: '.75rem',
                transform: 'translateY(-1px)',
                marginLeft: '.5rem',
              }}
            >
              ICONS
            </span>
          </Section>
        </Sections>
      </Middle>
    </Container>
  );
}

const RecentClick = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const AchSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  min-height: 70px;
  background: ${(props) => `url('${props.image}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: center;
  position: relative;
`;

const InnerCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(50%);
  width: 100%;
  background-color: ${COLOR_GREEN};
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN)};
`;

const AchSmallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.75rem;
  position: relative;
`;

const AchTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
`;

const TotalAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translateX(-1.25rem);
`;

const RecentItems = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-height: 55vh;
  min-height: 55vh;
`;

const RecentItemsGame = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-height: 65vh;
  min-height: 65vh;
`;

const RecentInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  max-height: 55vh;
  overflow: scroll;
`;
const OverviewMode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const UnlockTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  animation: slideUp 0.25s linear forwards;
  @keyframes slideUp {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const InnerTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transform: rotate(-90deg) translateX(-0.1rem);
  width: 20px;
  font-weight: bolder;
`;

const InnerTagMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transform: rotate(-90deg) translateX(-0.1rem);
  width: 20px;
  font-weight: bolder;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_GREEN};
  color: ${(props) => generateDarkTextColorForLightBg(COLOR_GREEN)};
  height: 70px;
`;

const TagCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLOR_BLUE};
  color: ${(props) => generateDarkTextColorForLightBg(COLOR_BLUE)};
  height: 70px;
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const A1Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0.25rem 0rem 0.25rem;
  background-color: ${COLOR_ACH};
`;

const A1ContainerMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0rem 0rem 0rem;
  background-color: ${COLOR_ACH};
`;

const A1Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: ${(props) => `url('${props.icon}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-origin: center;
`;

const A1Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 1rem;
  font-size: 0.9rem;
  flex: 1;
`;

const A1Desc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;
  opacity: 0.5;
  font-size: 0.8rem;
  flex: 2;
`;

const A1Right = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  height: 70px;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const RowInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;

  & input {
    outline: none;
    border: none;
    width: 100%;
    height: 40px;
    border-radius: 0px;
    opacity: 0.5;
    padding: 0.5rem 1rem;
    background-color: ${COLOR_BLACK2};
  }
`;

const RowInputDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5rem;

  & textarea {
    outline: none;
    border: none;
    width: 100%;
    height: 80px;
    border-radius: 0px;
    opacity: 0.5;
    padding: 0.5rem 1rem;
    background-color: ${COLOR_BLACK2};
  }
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  color: ${COLOR_BLUE};
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${COLOR_WHITE};
  padding: 1rem 0rem;
  font-size: 1.1rem;
`;

const Form = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: flex-start;
  overflow: scroll;
  font-size: 0.9rem;
`;

const Caret = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
`;

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ModalBottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  left: 50%;
  width: 90%;
  top: 45%;
  z-index: 2;
  transform: translate(-50%, -50%);
  background-color: ${COLOR_BLACK1};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 90%;
  border-radius: 4px;
  margin: 0rem 1rem;
  background-color: ${COLOR_BLUE};
  color: ${generateDarkTextColorForLightBg(COLOR_BLUE)};

  &:active {
    transform: translate(-2px, 2px);
  }
`;

const ButtonSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  width: 90%;
  border-radius: 4px;
  margin: 0.5rem;
  background-color: ${(props) => props.color};
  color: ${(props) => generateDarkTextColorForLightBg(props.color)};

  &:active {
    transform: translate(-2px, 2px);
  }
`;

const Dot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 4rem;
  transform: translate(-50%);
  background-color: ${COLOR_BLUE};
`;

const Sections = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 0rem 2rem 0rem;
  margin-top: 0.25rem;
  background-color: ${(props) => COLOR_BLUE_DARK};
`;

const Section = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  margin: 0rem 0rem 0.25rem 0rem;
  padding: 0rem 1rem 0.25rem 0rem;
  border-radius: 4px 4px 0px 0px;
  color: ${(props) => (props.selected ? COLOR_BLUE_LIGHT : COLOR_GREY)};
`;

const Middle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  flex: 1;
  opacity: ${(props) => (props.showModal ? '0' : '1')};
`;

const MiddleTopContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 0.1rem 0.5rem;
  flex: 1;
  opacity: ${(props) => (props.showModal ? '0' : '1')};
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 80px;
  padding: 1rem;
`;

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  color: ${COLOR_GREEN};
`;

const HRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  justify-content: flex-end;
`;

const AddIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:active {
    color: ${COLOR_BLUE};
  }
`;

const AddIconRefresh = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;

  &:active {
    color: ${COLOR_BLUE};
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  color: #fefefe;
`;
