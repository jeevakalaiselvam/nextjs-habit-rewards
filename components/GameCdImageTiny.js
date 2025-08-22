import styled from "styled-components";

export default function GameCdImageTiny({ cover, scale = 1, onClick }) {
  return <CdInnerImage scale={scale} cover={cover} onClick={onClick} />;
}

const BASE_WIDTH = 150;
const BASE_HEIGHT = 187.5;
const BASE_INNER_WIDTH = 200;
const BASE_INNER_HEIGHT = 100;
const BASE_TOP = 25;
const BASE_LEFT = 0.5625;
const BASE_TOP_C = 8;
const BASE_LEFT_C = 10;

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: ${(props) => props.scale * BASE_WIDTH}px;
  height: ${(props) => props.scale * BASE_HEIGHT}px;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  margin: 1rem;
`;

const CdInnerImage = styled.div`
  width: ${(props) => 300}px;
  height: ${(props) => 150}px;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 99;
  background-position: center center;
`;
