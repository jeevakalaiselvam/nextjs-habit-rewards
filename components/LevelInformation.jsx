import styled from "styled-components";

export default function LevelInformation({ games, platinumData }) {
  return (
    <Container>
      <MainBox>
        <Profile></Profile>
      </MainBox>
    </Container>
  );
}

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
