import React from "react";
import styled from "styled-components";

export default function IconCount({
  icon,
  count,
  color,
  size,
  iconSize,
  textSize,
  onClick,
  translateY,
  translateX,
  tTranslateY,
}) {
  return (
    <Container translateY={translateY} translateX={translateX}>
      <span
        style={{
          color: color,
          fontSize: size ? size : iconSize,
          marginRight: ".5rem",
        }}
        onClick={onClick}
      >
        {icon}
      </span>
      <span
        style={{
          color: color,
          fontSize: size ? size : textSize,
          transform: tTranslateY
            ? `translateY(${tTranslateY})`
            : `translateY(-.15rem)`,
        }}
      >
        {count}
      </span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) =>
    `translateY("${props?.translateY}") translateX("${props?.translateX}")`};
`;
