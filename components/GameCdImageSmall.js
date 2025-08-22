import styled from "styled-components";

export default function GameCdImageSmall({
  cover,
  scale = 1,
  onClick,
  onImageClick,
}) {
  return (
    <CdImage
      scale={scale}
      draggable
      onClick={(e) => {
        onClick();
      }}
    >
      <Completed scale={scale}></Completed>
      <CdInnerImage
        scale={scale}
        cover={cover}
        onClick={(e) => {
          onImageClick();
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </CdImage>
  );
}

const BASE_WIDTH = 146;
const BASE_HEIGHT = 186.75;
const BASE_INNER_WIDTH = 142;
const BASE_INNER_HEIGHT = 158;
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
  cursor: pointer;
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
  z-index: 99;
  background-position: center center;
  cursor: pointer;
`;

const Completed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: ${(props) => props.scale * BASE_TOP_C}px;
  right: ${(props) => props.scale * BASE_LEFT_C}px;
  width: 100px;
  height: 100px;
  z-index: 100;
  background: url("/icons/completed.png");
`;
