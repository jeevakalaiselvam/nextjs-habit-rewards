import {
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Input, Select, Space } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { CARD_BACKGROUND, COLOR_BACKGROUND } from './helpers/colorHelper';
import { HiExclamationCircle } from 'react-icons/hi';
import { Button, message } from 'antd';
import axios from 'axios';
import { CATEGORY_OPTIONS, MULTI_OPTIONS } from './helpers/constantHelper';
import { getRewardApiKeyForUser } from './helpers/apiHelper';

export default function UserCreate({ setActiveItem, setCreateMode, user }) {
  const [name, setName] = useState('');
  const [reward, setReward] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS?.[0]?.id);
  const [multi, setMulti] = useState(MULTI_OPTIONS?.[0]?.id);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const info = (message) => {
    messageApi.info(message);
  };

  const success = (message) => {
    messageApi.success(message);
  };

  const error = (message) => {
    messageApi.error(message);
  };

  const saveHabit = () => {
    if (
      name?.length > 0 &&
      reward?.length > 0 &&
      category?.length > 0 &&
      multi?.length > 0
    ) {
      setLoading(true);
      axios
        .post(`/api/${getRewardApiKeyForUser(user)}?user=${user}`, {
          title: name,
          reward: reward,
          category: category,
          multi: multi,
        })
        .then((response) => {
          success('Habit added !');
          setLoading(false);
          setActiveItem('habits');
          setCreateMode(false);
        })
        .catch((error) => {
          error('Unable to add Habit !');
          setLoading(false);
          setActiveItem('habits');
          setCreateMode(false);
        });
      setLoading(false);
    } else {
      info('Details missing !');
    }
  };

  return (
    <Container>
      {contextHolder}
      <Input
        placeholder="Enter Habit..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <Input
        placeholder="Enter Reward..."
        value={reward}
        type="tel"
        pattern="[0-9]*"
        onChange={(e) => setReward(e.target.value)}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <Select
        value={category}
        style={{
          width: '100%',
          height: '50px',
          marginTop: '1rem',
        }}
        onChange={(option) => {
          setCategory(option);
        }}
        options={CATEGORY_OPTIONS}
      />
      <Select
        value={multi}
        style={{
          width: '100%',
          height: '50px',
          marginTop: '1rem',
        }}
        onChange={(option) => {
          setMulti(option);
        }}
        options={MULTI_OPTIONS}
      />
      <ButtonContainer>
        <Button
          variant="solid"
          color="primary"
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '1.25rem 1rem',
            marginRight: '.25rem',
          }}
          onClick={() => {
            setCreateMode(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          color="primary"
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '1.25rem 1rem',
            marginLeft: '.25rem',
          }}
          onClick={() => {
            saveHabit();
          }}
        >
          Save Habit
        </Button>
      </ButtonContainer>
    </Container>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 2rem;
  min-height: 70vh;
  max-height: 70vh;
`;
