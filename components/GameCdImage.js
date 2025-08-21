import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { TbSettingsFilled } from "react-icons/tb";
import { COLOR_ACCENT, COLOR_BLUE_DARK } from "../helpers/colorHelper";
import EditGameForm from "./EditGameForm";
import { useState } from "react";

export default function GameCdImage({ game, onClick }) {
  return (
    <CdImage>
      <CdInnerImage cover={game?.image} onClick={onClick}></CdInnerImage>
    </CdImage>
  );
}

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 200px;
  height: 250px;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  margin: 8px;
`;

const CdInnerImage = styled.div`
  width: 194px; /* scaled down from 388px by 25% */
  height: 210px; /* scaled down from 420px by 25% */
  position: absolute;
  top: 38px; /* scaled down from 76px by 25% */
  left: 0.75px; /* scaled down from 1px by 25% */
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;
