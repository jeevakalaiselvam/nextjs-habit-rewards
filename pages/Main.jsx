import styled from 'styled-components';
import {
  CARD_BACKGROUND,
  COLOR_ACCENT,
  COLOR_BACKGROUND,
  COLOR_BACKGROUND_HEADER,
  COLOR_SUCCESS,
} from '../components/helpers/colorHelper';
import UserDropdown from '../components/UserDropdown';
import { useEffect, useRef, useState } from 'react';
import User from '../components/User';
import { FacebookFilled, SettingOutlined } from '@ant-design/icons';
import {
  HiLogout,
  HiPlusCircle,
  HiQuestionMarkCircle,
  HiViewBoards,
} from 'react-icons/hi';
import Title from 'antd/es/skeleton/Title';
import { Input, message } from 'antd';

export default function Atom() {
  const [selected, setSelected] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const [todayAmount, setTodayAmount] = useState('');
  const [pin, setPin] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const innerRef = useRef();

  const allValidPints = ['4104', '3333', '0000'];

  const jeevaOptions = [
    {
      value: 'Jeeva',
      label: 'Jeeva',
    },
    {
      value: 'Aswathy',
      label: 'Aswathy',
    },
    {
      value: 'Mom',
      label: 'Mom',
    },
    {
      value: 'Dad',
      label: 'Dad',
    },
  ];

  const vikramOptions = [
    {
      value: 'Vikram',
      label: 'Vikram',
    },
  ];

  const guestOptions = [
    {
      value: 'Guest',
      label: 'Guest',
    },
  ];

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
    console.log('PIN CHANGED');
    if (pin?.length == 4 && !allValidPints?.includes(pin)) {
      error('Not a valid pin !');
    } else {
      if (pin === '4104') {
        setUserOptions(jeevaOptions);
        setSelected(jeevaOptions?.[0]?.value);
      } else if (pin === '3333') {
        setUserOptions(vikramOptions);
        setSelected(vikramOptions?.[0]?.value);
      } else if (pin === '0000') {
        setUserOptions(guestOptions);
        setSelected(guestOptions?.[0]?.value);
      }
    }
  }, [pin]);

  useEffect(() => {
    innerRef?.current?.focus();
  }, [innerRef]);

  if (pin?.length > 0 && allValidPints?.includes(pin)) {
    return (
      <Container>
        <Header>
          <UserDropdown
            selected={selected}
            setSelected={setSelected}
            pin={pin}
            userOptions={userOptions}
            setUserOptions={setUserOptions}
          />
          <SettingsIcon>
            {<TodayAmount>Rs {todayAmount ?? 0}</TodayAmount>}
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
                style={{ opacity: 0.75, marginRight: '1rem' }}
                onClick={() => {
                  setCreateMode((old) => !old);
                }}
              />
            )}
            {!createMode && (
              <HiLogout
                style={{ opacity: 0.75 }}
                onClick={() => {
                  setPin('');
                  setSelected('');
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
              setTodayAmount={setTodayAmount}
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
            ref={innerRef}
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

const TodayAmount = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: center;
  color: ${COLOR_SUCCESS};
`;

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
