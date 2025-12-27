import styled from "styled-components";

export default function SilverIconS() {
  return <Container></Container>;
}

const Container = styled.div`
  display: inline-block;
  background: url("/icons/sprite.png");
  background-position: 0 -40px;
  width: 23px;
  height: 20px;
  vertical-align: -3px;
  margin-right: 2px;
  background-repeat: no-repeat;
  background-size: 100px 558px;
  transform: scale(1.25);
`;
