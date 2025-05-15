import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE,
  COLOR_GREEN,
  COLOR_GREY,
  COLOR_WHITE,
  generateDarkTextColorForLightBg,
} from '../helpers/colorHelper';
import { Dropdown, Space } from 'antd';
import { FaCaretDown, FaGlobe, FaRupeeSign } from 'react-icons/fa';
import { GAMES_ARRAY, HABIT_ARRAY, WORK_ARRAY } from '../helpers/gameHelper';
import axios from 'axios';

const SECTION_MONEY = 'SECTION_MONEY';
const SECTION_GAMES = 'SECTION_GAMES';

export default function Main() {
  const [achievements, setAchievements] = useState([]);
  const [selected, setSelected] = useState(SECTION_MONEY);
  const [showModal, setShowModal] = useState(true);
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
    setFormValues((old) => ({ ...old, name: String(e.key) }));

    console.log(formValues);
    if (formValues?.type == 'Habit') {
      setFormValues((old) => ({ ...old, title: String(e.key) }));
    }
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
    try {
      axios.get('/api/jeevaachievement').then((response) => {
        setAchievements(response?.data);
      });
    } catch (e) {}
  };

  const saveData = () => {
    try {
      axios
        .post('/api/jeevaachievement', { ...formValues })
        .then((response) => {
          refreshAchievements();
        });
    } catch (e) {}
  };

  useEffect(() => {
    refreshAchievements();
  }, []);

  return (
    <Container>
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
                        fontSize: '1rem',
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
                          fontSize: '1rem',
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
                          fontSize: '1rem',
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
                          fontSize: '1rem',
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
            <ButtonSmall onClick={() => setShowModal(false)}>
              CANCEL
            </ButtonSmall>
            <ButtonSmall onClick={() => saveData()}>SAVE</ButtonSmall>
          </ModalBottom>
        </ModalContainer>
      )}
      <Middle showModal={showModal}>
        <Sections>
          <Section
            color={selected == SECTION_MONEY ? COLOR_BLUE : COLOR_WHITE}
            onClick={() => {
              setSelected(SECTION_MONEY);
            }}
          >
            {selected == SECTION_MONEY && <Dot></Dot>}
            Money
          </Section>
          <Section
            color={selected == SECTION_GAMES ? COLOR_BLUE : COLOR_WHITE}
            onClick={() => {
              setSelected(SECTION_GAMES);
            }}
          >
            {selected == SECTION_GAMES && <Dot></Dot>}
            Games
          </Section>
        </Sections>
      </Middle>
      <Bottom>
        <Button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Achievement
        </Button>
      </Bottom>
    </Container>
  );
}

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
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${COLOR_BLUE};
  padding: 1rem 0rem;
  font-size: 1.15rem;
`;

const Form = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: flex-start;
  overflow: scroll;
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
  margin: 1rem;
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
  background-color: ${COLOR_GREEN};
  color: ${generateDarkTextColorForLightBg(COLOR_GREEN)};

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
  padding: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
  color: ${(props) => props.color};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 0px;
  background-color: blue;
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

const Bottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100px;
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
