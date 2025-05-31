import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  COLOR_ACCENT,
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
import { Dropdown, message, Popconfirm, Progress, Space, Spin } from 'antd';
import { FaCaretDown, FaGlobe, FaIcons, FaPlus, FaRupeeSign, FaTrophy } from 'react-icons/fa';
import { LuIndianRupee } from 'react-icons/lu';
import {
  Battlefield2042,
  Feature,
  formatIndianMoney,
  GAMES_ARRAY,
  getTimeFormattedForAch,
  Habit,
  HABIT_ARRAY,
  ICON_MAPPER,
  LEARN_ARRAY,
  MONEY_TRACKER,
  TROPHY_PLACEHOLDER,
  Work,
  WORK_ARRAY,
} from '../helpers/gameHelper';
import { TbGoGame, TbRefresh } from 'react-icons/tb';
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
  HiViewBoards,
} from 'react-icons/hi';
import { LoadingOutlined } from '@ant-design/icons';

const SECTION_MONEY = 'SECTION_MONEY';
const SECTION_WORK = 'Work';
const SECTION_HABIT = 'Habit';
const SECTION_GAMES = 'Games';
const SECTION_ICONS = 'Icons';
const SECTION_GAMES_ALL = 'Games All';
const SECTION_GAME = 'Game';

export default function Main() {
  const [showRecentAchUnlock, setShowRecentAchUnlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selected, setSelected] = useState(SECTION_GAMES);
  const [showModal, setShowModal] = useState(false);
  const [showModalGames, setShowModalGame] = useState(false);
  const [selectedAchToEdit, setSelectedAchToEdit] = useState({});
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedOverviewAchGame, setSelectedOverviewAchGame] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [formValues, setFormValues] = useState({
    type: 'Games',
    name: '',
    gameValue: '',
    title: '',
    description: '',
    date: new Date(),
  });

  const [formValuesGame, setFormValuesGame] = useState({
    name: '',
    url: '',
  });

  const itemsGame = [
    {
      key: '22',
      label: <div style={{ width: '100%' }}>All Games</div>,
      disabled: true,
    },
    ...games?.map(inner => inner?.name)?.map((game) => {
      return {
        key: game,
        label: game,
        extra: `⌘${game?.[0]?.toUpperCase()}`,
      };
    }),
  ];

  const clearFormData = () => {
    setFormValuesGame(old => ({
      name: '',
      url: '',
    }))
    setFormValues(old => ({
      type: 'Games',
      name: '',
      gameValue: '',
      title: '',
      description: '',
      date: new Date(),
    }))
  }

  const handleItemClickName = (e) => {
    setFormValues((old) => ({
      ...old,
      name: String(e.key),
      value: String(e.key)?.toLowerCase()?.split(" ")?.join("_"),
      title: '',
      description: '',
    }));

    setFormValues((old) => ({ ...old, title: String(e.key) }));
  };

  const menuTypeGame = {
    items: itemsGame,
    onClick: handleItemClickName,
  };


  const refreshAchievements = () => {
    setLoading(true);
    setAchievements((old) => []);
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

  const refreshGames = () => {
    setLoading(true);
    setGames((old) => []);
    try {
      axios.get('/api/jeevagame').then((response) => {
        setGames([]);
        setGames(response?.data);
        setLoading(false);
      });
    } catch (e) {
      message.info('Error refreshing Achievement !');
      setLoading(false);
    }
  };

  const saveGame = () => {
    setLoading(true);
    try {
      axios
        .post('/api/jeevagame', { ...formValuesGame })
        .then((response) => {
          setShowModalGame(false);
          refreshGames();
        });
    } catch (e) {
      message.info('Error saving Achievement !');
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

  const editAchievement = () => {
    setLoading(true);
    try {
      axios
        .put(`/api/jeevaachievement/${selectedAchToEdit?._id}?value=${selectedAchToEdit?.name?.toLowerCase()?.split(" ")?.join("_")}`, { ...selectedAchToEdit })
        .then((response) => {
          setShowModalEdit(false);
          setShowRecentAchUnlock(true);
          refreshAchievements();
        });
    } catch (e) {
      message.info('Error saving Achievement !');
      console.error(e)
      setLoading(false);
    }
  };

  const deleteAchievement = (ach) => {
    console.log(ach)
    setLoading(true);
    try {
      axios.delete(`/api/jeevaachievement/${ach?._id}?value=${ach?.name?.toLowerCase()?.split(" ")?.join("_")}`).then((response) => {
        refreshAchievements();
      });
    } catch (e) {
      message.info('Error deleting Achievement !');
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAchievements();
    refreshGames();
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


  achToShow = achToShow?.map(ach => {
    return { ...ach, url: games?.find(game => game?.name == ach?.name)?.url ?? TROPHY_PLACEHOLDER }
  })

  let lastAch = achToShow?.[0];


  let moneyAchievement = [];

  achievements?.forEach((ach) => {
    let isMoneyRelated = ach?.type == Work || ach?.type == Habit;
    moneyAchievement.push(ach);
  });


  let isLongAchievementsActive =
    selected == SECTION_GAMES ||
    selected == SECTION_HABIT ||
    selected == SECTION_WORK;

  let isOverviewMode = selected == SECTION_MONEY;
  let isGamesMode = selected == SECTION_GAMES;

  let isGameIconsActive = selected == SECTION_ICONS;

  let finalSelectedOverviewAch = selectedOverviewAchGame ?? achievements?.[0];
  let isfinalMoneyRelated =
    finalSelectedOverviewAch?.type == Work ||
    finalSelectedOverviewAch?.type == Habit;

  let onlyGameAchs = achToShow
  let finalSelectedOverviewGameAch =
    selectedOverviewAchGame ?? onlyGameAchs?.[0];

  let allGames = achToShow?.map(ach => {
    return { name: ach?.name, url: ach?.url }
  })

  allGames = new Set([...allGames])

  let totalXP = achievements?.reduce((acc, ach) => acc + 100, 0)
  let currentLevel = Math.floor(totalXP / 1000)
  let nextLevel = Math.floor(totalXP / 1000) + 1
  let completionForNext = ((totalXP) / (nextLevel * 1000)) * 100;

  allGames = [...allGames]

  let achsForGame = achievements?.filter(ach => ach?.name == selectedGame)

  let urlsForGame = {}
  let achAllForGame = {}

  achievements.forEach(ach => {
    if (!achAllForGame?.[ach?.name]) {
      achAllForGame[ach?.name] = []
      achAllForGame[ach?.name].push(ach)
    } else {
      achAllForGame[ach?.name].push(ach)
    }
  })

  games.forEach(game => {
    if (!urlsForGame?.[game?.name]) {
      urlsForGame[game?.name] = game?.url
    }
  })

  console.log({ achsForGame, urlsForGame })


  return (
    <Container>
      <Header>
        <HLeft>
          <span style={{ fontSize: '1.3rem', marginRight: '.5rem', color: COLOR_ACCENT }}>
            <HiLibrary />
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              transform: 'translateY(-2px)',
              marginRight: '1rem', color: COLOR_ACCENT
            }}
          >
            {games?.length}
          </span>
          <span style={{ fontSize: '1.1rem', marginRight: '.5rem' }}>
            <FaTrophy />
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              transform: 'translateY(-2px)',
              marginRight: '.25rem',
            }}
          >
            {achToShow?.length}
          </span>
        </HLeft>
        <HRight>
          <AddIcon
            onClick={() => {
              clearFormData()
              setShowModal(true);
            }}
          >
            <span><HiOutlinePlusSm /></span>
          </AddIcon> <AddIconRefresh
            onClick={() => {
              refreshAchievements();
            }}
          >
            <span style={{ marginLeft: '1rem' }}><TbRefresh /></span>
          </AddIconRefresh>
        </HRight>
      </Header>
      {showModalGames && (
        <ModalContainerGame>
          <ModalContent>
            <Form>
              <Title>Add Game</Title>
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={formValuesGame?.name}
                  onChange={(e) => {
                    setFormValuesGame((old) => ({
                      ...old,
                      name: String(e.target.value),
                      value: String(e.target.value)?.toLowerCase()?.split(" ")?.join("_"),
                    }));
                  }}
                />
              </RowInput>
              <Row>
                <SubTitle>URL</SubTitle>
              </Row>
              <RowInputDescription>
                <input
                  value={formValues?.url}
                  type="text"
                  onChange={(e) => {
                    setFormValuesGame((old) => ({
                      ...old,
                      url: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall onClick={() => setShowModalGame(false)} color={COLOR_RED}>
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => saveGame()} color={COLOR_GREEN}>
              SAVE
            </ButtonSmall>
          </ModalBottom>
        </ModalContainerGame>
      )}
      {showModal && (
        <ModalContainer>
          <ModalContent>
            <Form>
              <Title>Add Achievement</Title>
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
                <span style={{ marginLeft: '1rem', opacity: .5 }} onClick={() => {
                  setShowModalGame(true)
                  setShowModal(false)
                }}><FaPlus /></span>
              </Row>
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
      {showModalEdit && (
        <ModalContainer>
          <ModalContent>
            <Form>
              <Title>Edit Achievement</Title>
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
                      {selectedAchToEdit?.name}
                    </span>
                    <Caret>
                      <FaCaretDown />
                    </Caret>
                  </Space>
                </Dropdown>
              </Row>
              <Row>
                <SubTitle>Name</SubTitle>
              </Row>
              <RowInput>
                <input
                  type="text"
                  value={selectedAchToEdit?.title}
                  onChange={(e) => {
                    setSelectedAchToEdit((old) => ({
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
                  value={selectedAchToEdit?.description}
                  type="text"
                  onChange={(e) => {
                    setSelectedAchToEdit((old) => ({
                      ...old,
                      description: String(e.target.value),
                    }));
                  }}
                />
              </RowInputDescription>
            </Form>
          </ModalContent>
          <ModalBottom>
            <ButtonSmall onClick={() => setShowModalEdit(false)} color={COLOR_RED}>
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => editAchievement()} color={COLOR_GREEN}>
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
              isLongAchievementsActive && <NoData>No Games</NoData>}
            {achToShow?.length > 0 && (selected == "RECENT") &&
              achToShow?.map((ach, index) => {
                let isMoneyRelated = ach?.type == Work || ach?.type == Habit;
                return (
                  <A1Container>
                    <Popconfirm
                      title="Delete Achievement"
                      description="Are you sure to delete this task?"
                      onConfirm={() => {
                        deleteAchievement(ach);
                      }}
                      onCancel={() => { }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <A1Icon icon={ach?.url ?? TROPHY_PLACEHOLDER}></A1Icon>
                    </Popconfirm>
                    <A1Right>
                      <A1Title>{ach?.title}</A1Title>
                      <A1Desc>{ach?.description}</A1Desc>
                      {/* <A1Unlocked>{getTimeFormattedForAch(ach?.unlocked)}</A1Unlocked> */}
                    </A1Right>
                    <Tag onClick={() => {
                      setSelectedAchToEdit(ach)
                      setShowModalEdit(true)
                    }}>
                      <InnerTagMoney>
                        <span
                          style={{
                            transform: 'translateY(1px)',
                            fontSize: '.9rem',
                          }}
                        >
                          <FaTrophy />{' '}
                        </span>
                        <span style={{ marginLeft: '.25rem' }}>
                          {achToShow?.length - index}</span>
                      </InnerTagMoney>
                    </Tag>
                  </A1Container>
                );
              })}
            {games?.length > 0 && (selected == "GAMES") &&
              games?.map((ach, index) => {
                return (
                  <A1Container onClick={() => {
                    setSelectedGame(ach?.name)
                    setSelected("GAME")
                  }}>
                    {/* <Name>GAME</Name> */}
                    <A1Icon icon={urlsForGame[ach?.name] ?? TROPHY_PLACEHOLDER}></A1Icon>
                    <A1Right>
                      <A1Title>{ach?.name}</A1Title>
                      <A1Desc>{`Played ${ach?.name}`}</A1Desc>
                    </A1Right>
                    <Tag forGame={true} onClick={() => {
                      setSelectedAchToEdit(ach)
                      setShowModalEdit(true)
                    }}>
                      <InnerTagMoney>
                        <span
                          style={{
                            transform: 'translateY(1px)',
                            fontSize: '1rem',
                          }}
                        >
                          <FaTrophy />{' '}
                        </span>
                        <span style={{ marginLeft: '.25rem' }}>
                          {achAllForGame?.[ach?.name]?.length ?? 0}</span>
                      </InnerTagMoney>
                    </Tag>
                  </A1Container>
                );
              })}
            {achsForGame?.length > 0 && (selected == "GAME") && selectedGame?.length > 0 &&
              achsForGame?.map((ach, index) => {
                return (
                  <A1Container>
                    <A1Icon icon={urlsForGame[ach?.name] ?? TROPHY_PLACEHOLDER}></A1Icon>
                    <A1Right>
                      <A1Title>{ach?.title}</A1Title>
                      <A1Desc>{ach?.description}</A1Desc>
                    </A1Right>
                    <Tag onClick={() => {
                      setSelectedAchToEdit(ach)
                      setShowModalEdit(true)
                    }}>
                      <InnerTagMoney>
                        <span
                          style={{
                            transform: 'translateY(1px)',
                            fontSize: '.9rem',
                          }}
                        >
                          <FaTrophy />{' '}
                        </span>
                        <span style={{ marginLeft: '.25rem' }}>
                          {achsForGame?.length - index}</span>
                      </InnerTagMoney>
                    </Tag>
                  </A1Container>
                );
              })}
            {achsForGame?.length == 0 && (selected == "GAME") && selectedGame?.length > 0 &&
              <NoData>No Achievements</NoData>}
            {!selectedGame && (selected == "GAME") && <NoData>No Game Selected</NoData>}
            {isGameIconsActive && (
              <OverviewMode>
                <RecentItemsGame>
                  <RecentInner>
                    {onlyGameAchs?.map((ach, index) => {
                      return (
                        <AchSmallContainer>
                          <AchSmall
                            image={
                              ach?.url?.length > 0
                                ? ach?.url
                                : TROPHY_PLACEHOLDER
                            }
                            onClick={() => {
                              setSelectedOverviewAchGame(ach);
                            }}
                          >
                          </AchSmall>
                          <InnerCount>
                            <span>{onlyGameAchs?.length - index}</span>
                            <span
                              style={{
                                fontSize: '.8rem',
                                marginLeft: '.25rem',
                                transform: 'translateY(1px)',
                              }}
                            >
                              <FaTrophy />
                            </span>
                          </InnerCount>
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
                          finalSelectedOverviewGameAch?.url ?? TROPHY_PLACEHOLDER
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
                            <span style={{ fontSize: '.9rem' }}>RECENT</span>
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
                onConfirm={() => { }}
                onCancel={() => { }}
                okText="Yes"
                cancelText="No"
              >
                <A1Icon icon={urlsForGame[lastAch6?.name] ?? TROPHY_PLACEHOLDER}></A1Icon>
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
      </Middle>
      <BottomProgress>
        <BLeft>
          <span style={{ marginRight: '.25rem' }}><FaTrophy /></span>
          <span>{currentLevel}</span>
        </BLeft>
        <BMiddle>
          <Progress percent={completionForNext} showInfo={false} />
        </BMiddle>
        <BRight>
          <span style={{ marginRight: '.25rem' }}><FaTrophy /></span>
          <span>{nextLevel}</span></BRight>
      </BottomProgress>
      <Bottom>
        <BottomItem active={selected == "GAMES"} onClick={() => { setSelected("GAMES") }}>
          <span><MdVideogameAsset /></span>
          <span style={{ fontWeight: 'bold', fontSize: '.8rem' }}>GAMES</span>
        </BottomItem>
        <BottomItem active={selected == "GAME"} onClick={() => { setSelected("GAME") }}>
          <span><MdVideogameAsset /></span>
          <span style={{ fontWeight: 'bold', fontSize: '.8rem' }}>GAME</span>
        </BottomItem>
        <BottomItem active={selected == "RECENT"} onClick={() => { setSelected("RECENT") }}>
          <span><HiViewBoards /></span>
          <span style={{ fontWeight: 'bold', fontSize: '.8rem' }}>RECENT</span>
        </BottomItem>
      </Bottom>
    </Container>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  position: absolute;
  left: 0;
  bottom: 50%;
  width: 70px;
  height: 20px;
  transform: translate(-25%,50%) rotate(-90deg);
  font-size: .8rem;
  background-color: ${COLOR_GREEN};
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN)};
  `


const BottomItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  transform: translateY(.25rem);
  color: ${props => props.active ? COLOR_ACCENT : ""};
  `

const BLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  `

const BMiddle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  `

const BRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  `


const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  max-height: 82vh;
  overflow:scroll;
  flex: 1;
  opacity: ${(props) => (props.showModal ? '0' : '1')};
`;


const BottomProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: ${COLOR_ACH};
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR_GREEN};
  transform: translateX(-1rem);
`;

const Change = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 1.25rem;
  color: ${COLOR_GREEN};
  transform: translateX(-1rem);
  animation: slideUp 0.5s linear forwards;
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

const MoneyChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  background-color: ${COLOR_BLACK1};
  flex-direction: column;
`;

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
  background-position: center;
  position: relative;
  cursor: pointer;
`;

const InnerCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-height: 65vh;
  min-height: 65vh;
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
`;

const InnerTagMoney = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transform: rotate(-90deg) translateX(-0.1rem);
  width: 25px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.forGame ? COLOR_ACCENT : COLOR_GREEN};
  color: ${(props) => props.forGame ? generateDarkTextColorForLightBg(COLOR_ACCENT) : generateDarkTextColorForLightBg(COLOR_GREEN)};
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
  padding: 1rem;
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
  width: 140px;
  height: 70px;
  background: ${(props) => `url('${props.icon}')`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
  opacity: 0.7;
  font-size: 0.8rem;
  flex: 3;
`;

const A1Unlocked = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0rem 1rem;
  opacity: 0.25;
  font-size: 0.8rem;
  flex: 3;
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

  & input {
    outline: none;
    border: none;
    width: 100%;
    height: 35px;
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

const ModalContainerGame = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  left: 50%;
  width: 90%;
  top: 45%;
  z-index: 3;
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
  cursor: pointer;

  &:hover {
    color: ${(props) => COLOR_BLUE_LIGHT};
  }
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
  justify-content: center;
  width: 100%;
  padding: 1rem 1rem 3rem 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 60px;
  padding: 1rem;
  background-color: ${COLOR_BLUE_DARK};
`;

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  color: ${COLOR_GREEN};
`;

const HCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  flex: 2;
  color: ${COLOR_ACCENT};
`;


const HRight = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
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
