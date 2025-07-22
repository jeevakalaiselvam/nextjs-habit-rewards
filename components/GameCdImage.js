import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { TbSettingsFilled } from "react-icons/tb";
import { COLOR_ACCENT, COLOR_BLUE_DARK } from "../helpers/colorHelper";
import EditGameForm from "./EditGameForm";
import { useState } from "react";

export default function GameCdImage({ game }) {
  return (
    <CdImage>
      <CdInnerImage cover={game?.cover}></CdInnerImage>
    </CdImage>
  );
}

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100px;
  height: 126px;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const CdInnerImage = styled.div`
  width: 97px;
  height: 105px;
  position: absolute;
  top: 20px;
  left: 1px;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;
