import styled from "styled-components";

export default function GameCdImage({ game, scale = 1 }) {
  const baseWidth = 100;
  const baseHeight = 126;

  const innerBaseWidth = 97;
  const innerBaseHeight = 105;

  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  const scaledInnerWidth = innerBaseWidth * scale;
  const scaledInnerHeight = innerBaseHeight * scale;

  return (
    <CdImage style={{ width: scaledWidth, height: scaledHeight }}>
      <CdInnerImage
        style={{
          width: scaledInnerWidth,
          height: scaledInnerHeight,
          top: 20 * scale,
          left: 1 * scale,
        }}
        cover={game?.cover}
      />
    </CdImage>
  );
}

const CdImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: url("/icons/cover.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const CdInnerImage = styled.div`
  position: absolute;
  background: ${(props) => `url(${props.cover})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 4px;
`;
