import styled from 'styled-components';
import { COLOR_BACKGROUND } from './helpers/colorHelper';
import { Radio, Select } from 'antd';
import { useState } from 'react';

export default function UserDropdown({ selected, setSelected }) {
  return (
    <Container>
      <Select
        style={{
          width: '200px',
        }}
        value={selected}
        options={[
          {
            value: 'jeeva',
            label: 'Jeeva',
          },
          {
            value: 'aswathy',
            label: 'Aswathy',
          },
          {
            value: 'mom',
            label: 'Mom',
          },
          {
            value: 'dad',
            label: 'Dad',
          },
        ]}
        onChange={(e) => setSelected(e)}
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
