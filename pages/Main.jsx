import styled from 'styled-components';
import {
  CARD_BACKGROUND,
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_BACKGROUND_HEADER,
} from '../components/helpers/colorHelper';
import UserDropdown from '../components/UserDropdown';
import { useState } from 'react';
import User from '../components/User';
import { FacebookFilled, SettingOutlined } from '@ant-design/icons';
import {
  HiPlusCircle,
  HiQuestionMarkCircle,
  HiViewBoards,
} from 'react-icons/hi';

export default function Atom() {
  const [selected, setSelected] = useState('Jeeva');
  const [createMode, setCreateMode] = useState(false);
  return (
    <Container>
      <Header>
        <UserDropdown selected={selected} setSelected={setSelected} />
        <SettingsIcon>
          {createMode && (
            <HiViewBoards
              style={{ opacity: 0.75 }}
              onClick={() => {
                setCreateMode((old) => !old);
              }}
            />
          )}
          {!createMode && (
            <HiPlusCircle
              style={{ opacity: 0.75 }}
              onClick={() => {
                setCreateMode((old) => !old);
              }}
            />
          )}
        </SettingsIcon>
      </Header>
      <Content>
        {
          <User
            createMode={createMode}
            setCreateMode={setCreateMode}
            user={selected}
          />
        }
      </Content>
    </Container>
  );
}

const SettingsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0rem;
  margin-left: 2rem;
  font-size: 1.3rem;
  color: #fefefe;

  &:active {
    color: ${COLOR_ACCENT};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-height: 8vh;
  min-height: 8vh;
  background-color: ${COLOR_BACKGROUND_HEADER};
  padding: 1rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 70vh;
  max-height: 70vh;
  padding: 1rem;
  background-color: ${COLOR_BACKGROUND};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${COLOR_BACKGROUND};
`;
