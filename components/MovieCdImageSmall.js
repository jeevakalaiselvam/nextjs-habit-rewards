import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { TbSettingsFilled } from "react-icons/tb";
import { COLOR_ACCENT, COLOR_BLUE_DARK } from "../helpers/colorHelper";
import EditGameForm from "./EditGameForm";
import { useState } from "react";

export default function MovieCdImageSmall({ cover, scale = 1, onClick }) {
  return (
    <CdImage scale={scale} draggable onClick={onClick}>
      <CdInnerImage scale={scale} cover={cover} />
    </CdImage>
  );
}

const BASE_WIDTH = 150;
const BASE_HEIGHT = 187.5;
const BASE_INNER_WIDTH = 144;
const BASE_INNER_HEIGHT = 168;
const BASE_TOP = 16;
const BASE_LEFT = 0;

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: ${(props) => props.scale * BASE_WIDTH}px;
  height: ${(props) => props.scale * BASE_HEIGHT}px;
  background: url("/icons/blueray.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  margin: 1rem;
`;

const CdInnerImage = styled.div`
  width: ${(props) => props.scale * BASE_INNER_WIDTH}px;
  height: ${(props) => props.scale * BASE_INNER_HEIGHT}px;
  position: absolute;
  top: ${(props) => props.scale * BASE_TOP}px;
  left: ${(props) => props.scale * BASE_LEFT}px;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;
