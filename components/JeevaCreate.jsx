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
import { CATEGORY_OPTIONS } from './helpers/constantHelper';

export default function JeevaCreate({ setActiveItem, setCreateMode }) {
  const [name, setName] = useState('');
  const [reward, setReward] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS?.[0]?.id);
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
    setLoading(true);
    axios
      .post('/api/jeevareward', {
        title: name,
        reward: reward,
        category: category,
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
  };

  return (
    <Container>
      {contextHolder}
      <Input
        addonAfter={<HiExclamationCircle />}
        placeholder="Enter Habits"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', marginTop: '1rem' }}
      />
      <Input
        addonAfter={<HiExclamationCircle />}
        placeholder="Enter Reward"
        type="number"
        value={reward}
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
      <Button
        variant="solid"
        color="primary"
        style={{
          width: '100%',
          marginTop: '1rem',
          padding: '1.25rem 1rem',
        }}
        onClick={() => {
          saveHabit();
        }}
      >
        Save Habit
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 2rem;
  min-height: 80vh;
  max-height: 80vh;
`;
