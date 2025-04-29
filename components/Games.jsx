import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGames } from "../store/gameSlice";
import styled from "styled-components";
import Select from "react-select";
import { HEADER_IMAGE } from "./helpers/urlHelper";
import { Progress } from "antd";
import { FaTrophy } from "react-icons/fa";

export default function Home() {
  const dispatch = useDispatch();
  const { habittracker } = useSelector((state) => state);
  const { games } = habittracker;

  const [selectedGame, setSelectedGame] = useState(games?.[0]?.id);

  const refreshGames = () => {
    console.log("CALLING GAMES");
    dispatch(fetchAllGames());
  };

  const darkThemeStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#2c2f33",
      borderColor: "#555",
      color: "#fff",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2c2f33",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444" : "#2c2f33",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#bbb",
    }),
  };

  useEffect(() => {
    refreshGames();
  }, []);

  const options = [
    ...games?.map((game) => {
      return {
        ...game,
        value: game?.id,
        label: `${game?.name} ${game?.completed}/${game?.total}`,
      };
    }),
  ];

  const returnGame = ({ name, id, completed, total }) => (
    <GameContainer>
      <ImageContainer image={HEADER_IMAGE(id)}></ImageContainer>
      <Data>
        <Name>{name}</Name>
        <Status>
          <TrophyIcon>
            <FaTrophy />
          </TrophyIcon>
          <TrophyData>
            {completed} / {total}
          </TrophyData>
        </Status>
      </Data>
    </GameContainer>
  );

  const NoDropdownIndicator = () => null;

  return (
    <Container>
      <TopContainer>{games?.map((game) => returnGame(game))}</TopContainer>
    </Container>
  );
}

const TrophyData = styled.div`
  font-size: 1rem;
`;

const TrophyIcon = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  font-size: 0.9rem;
  margin-right: 0.25rem;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  width: 100%;
  flex: 1;
`;

const Status = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: center;
  transform: translateY(2px);
  flex: 1;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  background-color: #1f2125;
  padding: 0rem 0.25rem;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  width: 150px;
  height: 70px;
  background: ${(props) => `url(${props?.image})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const Data = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: center;
  flex: 1;
  flex-direction: column;
  height: 80px;
  padding: 0.25rem 0.25rem;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  min-width: 100%;
  padding: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 60vh;
  max-height: 60vh;
`;
