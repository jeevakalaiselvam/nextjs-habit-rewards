import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_BLACK1,
  COLOR_BLUE_DARK,
  COLOR_GREEN,
} from "../helpers/colorHelper";
import GameCard from "../components/GameCard";
import IconCount from "../components/IconCount";
import { TbBinaryTree2Filled, TbLayoutGridFilled } from "react-icons/tb";
import { FaTrophy } from "react-icons/fa";
import { useRouter } from "next/router";

export default function all_games() {
  const games = [
    {
      id: 1,
      title: "Rainbow Six Siege",
      key: "rainbow_six_siege",
      image:
        "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/359550/header.jpg?t=1741824174",
    },
  ];

  return (
    <Container>
      <Header>
        <HLeft>
          <IconCount
            translateY="1rem"
            iconSize="1.15rem"
            textSize="1.25rem"
            icon={<FaTrophy />}
            color={COLOR_ACCENT}
            count={games?.length}
          />
        </HLeft>
        <HRight></HRight>
      </Header>
      <Content>
        {games?.map((game) => {
          return <GameCard game={game} />;
        })}
      </Content>
    </Container>
  );
}

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const HRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 60px;
  background-color: ${COLOR_BLUE_DARK};
  color: ${COLOR_ACCENT};
  padding: 0rem 1rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  width: 100%;
  overflow: scroll;
  min-height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  background-color: ${COLOR_BLACK1};
  padding: 1rem 0.5rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
`;
