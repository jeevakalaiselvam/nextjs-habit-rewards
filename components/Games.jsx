import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllGames, selectGame } from "../store/gameSlice";
import styled from "styled-components";
import Select from "react-select";
import { HEADER_IMAGE } from "./helpers/urlHelper";
import { Progress, Spin } from "antd";
import { FaTrophy } from "react-icons/fa";
import { LoadingOutlined } from "@ant-design/icons";
import GameCompletion from "./GameCompletion";

export default function Games({ setActiveTab }) {
  const dispatch = useDispatch();
  const { habittracker } = useSelector((state) => state);
  const { games, loading } = habittracker;

  const refreshGames = () => {
    dispatch(fetchAllGames());
  };

  useEffect(() => {
    refreshGames();
  }, []);

  const returnGame = ({ name, id, completed, completion, total }) => (
    <GameContainer
      onClick={() => {
        dispatch(selectGame(id));
        setActiveTab(1);
      }}
    >
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
        <Progress percent={completion} />
      </Data>
    </GameContainer>
  );

  if (loading)
    return (
      <Container>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Container>
    );
  else
    return (
      <Container>
        {/* <GameCompletion games={games} /> */}
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
  padding-left: 0.25rem;
`;

const Status = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: center;
  transform: translateY(2px);
  flex: 1;
  padding-left: 0.25rem;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: center;
  background-color: #1f2125;
  padding: 0rem 0.25rem;
  width: 100%;
  margin-bottom: 0.5rem;
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
  padding: 1rem 0.5rem;
  flex-direction: column;
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
