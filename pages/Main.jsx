import styled from 'styled-components';
import {
  CARD_BACKGROUND,
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_BACKGROUND_HEADER,
} from '../components/helpers/colorHelper';
import UserDropdown from '../components/UserDropdown';
import { useEffect, useState } from 'react';
import User from '../components/User';
import { FacebookFilled, SettingOutlined } from '@ant-design/icons';
import {
  HiPlusCircle,
  HiQuestionMarkCircle,
  HiViewBoards,
} from 'react-icons/hi';
import Title from 'antd/es/skeleton/Title';
import { Input, message } from 'antd';

export default function Atom() {
  const [selected, setSelected] = useState('Jeeva');
  const [createMode, setCreateMode] = useState(false);
  const [pin, setPin] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const allValidPints = ['4104', '3333', '0000'];

  const info = (message) => {
    messageApi.info(message);
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  useEffect(() => {
    setPin('');
  }, []);

  useEffect(() => {
    if (pin?.length == 4 && !allValidPints?.includes(pin)) {
      error('Not a valid pin !');
    }
  }, [pin]);

  if (pin?.length > 0 && allValidPints?.includes(pin)) {
    return (
      <Container>
        <Header>
          <UserDropdown
            selected={selected}
            setSelected={setSelected}
            pin={pin}
          />
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
  } else {
    return (
      <PinContainer>
        {contextHolder}
        <PINInner>
          <PINText>PIN</PINText>
          <Input.OTP
            length={4}
            mask="🔒"
            inputMode="numeric"
            onInput={(e) => {
              setPin(e?.join(''));
            }}
            style={{
              '--input-width': '100px', // Increase input width
              '--input-height': '50px', // Optional: Adjust height proportionally
              '--input-border-radius': '8px', // Optional: Add rounded corners
              '--input-spacing': '10px', // Space between inputs
            }}
          />
        </PINInner>
      </PinContainer>
    );
  }
}
const PINInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  transform: translateY(-5rem);
`;

const PINText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-size: 1.5rem;
`;

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

const PinContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${COLOR_BACKGROUND};
  color: #fefefe;
`;
