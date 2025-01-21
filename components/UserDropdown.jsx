import styled from 'styled-components';
import { COLOR_BACKGROUND } from './helpers/colorHelper';
import { Radio, Select } from 'antd';
import { useState } from 'react';

export default function UserDropdown({ selected, setSelected, pin }) {
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

  let userOptions = guestOptions;

  if (pin == '4104') {
    userOptions = jeevaOptions;
  } else if (pin == '3333') {
    userOptions = vikramOptions;
  } else if (pin == '0000') {
    userOptions = guestOptions;
  }

  return (
    <Container>
      <Select
        style={{
          width: '200px',
        }}
        value={selected}
        options={userOptions}
        onChange={(e) => {
          setSelected(e);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;

  & select {
    width: 100%;
  }

  & option {
    background-color: ${COLOR_BACKGROUND};
    color: #fefefe;
    font-size: 2rem;
  }
`;
