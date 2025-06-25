import { useRouter } from "next/router";
import styled from "styled-components";

export default function GameCard({ game }) {
  const router = useRouter();
  const { id, title, key, image } = game;
  return (
    <Container
      image={image}
      onClick={() => {
        router.push(game?.key);
      }}
    >
      <Name>{title}</Name>
    </Container>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 0.5rem;
  color: #fefefe;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 130px;
  background: ${(props) => `url(${props?.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
`;
