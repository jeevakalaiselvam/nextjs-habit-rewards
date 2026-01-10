import { LoadingOutlined } from '@ant-design/icons';
import { Popconfirm, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HEADER_IMAGE } from '../helpers/urlHelper';

export default function GAME_SETTINGS({
  gamesToInclude,
  refreshIncludedGames,
  deleteGame,
}) {
  const [gameId, setGameId] = useState('');

  const addGameToIncluded = async () => {
    try {
      const res = await axios.post('/api/include', { gameId: gameId });
      refreshIncludedGames();
    } catch (error) {
      console.error('Failed to refresh games', error);
    }
  };

  return (
    <Container>
      <Top>
        <input
          type="number"
          onChange={(e) => {
            setGameId(e.target.value);
          }}
          value={gameId}
        />
        <AddButton
          onClick={() => {
            addGameToIncluded();
          }}
        >
          Add Game
        </AddButton>
      </Top>
      <Bottom>
        {gamesToInclude?.map((game) => {
          return (
            <Popconfirm
              title="Delete the game"
              description="Are you sure to delete this game?"
              onConfirm={() => {
                deleteGame(game);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <GameImage url={HEADER_IMAGE(game)}>
                <Name></Name>
                <Id></Id>
                <Delete></Delete>
              </GameImage>
            </Popconfirm>
          );
        })}
      </Bottom>
    </Container>
  );
}

const GameImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 490px;
  height: 180px;
  margin: 0px 4px 0px 4px;
  background-image: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  cursor: pointer;
  border: 1px solid #199fff00;

  &:hover {
    border: 1px solid #199fff22;
  }
`;

const AddButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #199fff;
  font-size: 0.8rem;
  color: #fefefe;
  margin-left: 1rem;
  padding: 0rem 1rem;
  height: 26px;
  cursor: pointer;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #fefefe;
`;

const Id = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Delete = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;

  & input {
    width: 200px;
    outline: none;
    border: none;
    padding: 0.125rem 0.25rem;
    background-color: #1b2838;
    color: rgb(138, 138, 138);
    height: 26px;
    cursor: pointer;
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 100vw;
  min-height: 60vh;
  max-height: 60vh;
  padding: 1rem;
`;
