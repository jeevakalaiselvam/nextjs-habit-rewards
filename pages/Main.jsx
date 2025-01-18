import styled from 'styled-components';
import {
  CARD_BACKGROUND,
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_BACKGROUND_HEADER,
} from '../components/helpers/colorHelper';
import UserDropdown from '../components/UserDropdown';
import { useState } from 'react';
import Jeeva from '../components/Jeeva';
import { FacebookFilled, SettingOutlined } from '@ant-design/icons';

export default function Atom() {
  const [selected, setSelected] = useState('jeeva');
  return (
    <Container>
      <Header>
        <UserDropdown selected={selected} setSelected={setSelected} />
        <SettingsIcon>
          <SettingOutlined
            onClick={() => {
              setSettingsMode(true);
            }}
          />
        </SettingsIcon>
      </Header>
      <Content>{selected == 'jeeva' && <Jeeva />}</Content>
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
  max-height: 92vh;
  padding: 1rem;
  min-height: 92vh;
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
  overflow: hidden;
`;
