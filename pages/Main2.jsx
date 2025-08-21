import styled from 'styled-components';
import NewProfile from '../ncomponents/NewProfile';
import { useState } from 'react';
import { FaGamepad } from 'react-icons/fa6';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { TbFolderFilled } from 'react-icons/tb';
import { GAME_GENRES, GENRES, MOVIE_GENRES } from '../helpers/catHelper';

export default function Main2() {
  const [active, setActive] = useState('GAMES');

  return (
    <Container>
      <Left>
        <NewProfile />
        <Links>
          <Link
            active={active == 'GAMES'}
            onMouseEnter={() => {
              setActive('GAMES');
            }}
            onMouseLeave={() => {
              setActive('');
            }}
            onClick={() => {
              setActive('GAMES');
            }}
          >
            <span style={{ transform: 'translateY(2px)', marginRight: '1rem' }}>
              <FaGamepad />
            </span>
            <span>Games</span>
          </Link>
        </Links>
        <Seperator></Seperator>
        <Links>
          <Link
            active={active == 'MOVIES'}
            onMouseEnter={() => {
              setActive('MOVIES');
            }}
            onMouseLeave={() => {
              setActive('');
            }}
            onClick={() => {
              setActive('MOVIES');
            }}
          >
            <span style={{ transform: 'translateY(2px)', marginRight: '1rem' }}>
              <BiSolidMoviePlay />
            </span>
            <span>Movies</span>
          </Link>
        </Links>
        <Seperator></Seperator>
        <Links>
          <Link
            active={active == 'BOOKS'}
            onMouseEnter={() => {
              setActive('BOOKS');
            }}
            onMouseLeave={() => {
              setActive('');
            }}
            onClick={() => {
              setActive('BOOKS');
            }}
          >
            <span style={{ transform: 'translateY(2px)', marginRight: '1rem' }}>
              <BiSolidMoviePlay />
            </span>
            <span>Books</span>
          </Link>
        </Links>
      </Left>
      <Right>
        <Top></Top>
        <Content></Content>
      </Right>
    </Container>
  );
}

const Seperator = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 2px;
  background-color: #373c3e;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const Link = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  color: ${(props) => (props?.active ? '#98C3CC' : '#9EB2B6')};
  background-color: ${(props) => (!props?.active ? '#060a0b00' : '#060a0b')};
  cursor: pointer;
  padding: 0.25rem 1rem;
  font-size: 0.8rem;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 200px;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #161b1e;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
  max-height: 100vh;
  background-color: #060a0b;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  color: #636c6e;
`;
