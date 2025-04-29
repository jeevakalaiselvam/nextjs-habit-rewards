import styled from "styled-components";
import { generateDarkTextColorForLightBg } from "./helpers/colorHelper";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function MoneySaved({ games }) {
  const saved = games?.reduce((acc, game) => {
    if (Number(game?.SAVED ?? 0) < 0) {
      return acc + Number(game?.SAVED ?? 0);
    } else {
      return 0;
    }
  }, 0);

  console.log(saved);
  const spent = games?.reduce((acc, game) => {
    if (Number(game?.SAVED ?? 0) > 0) {
      return acc + Number(game?.SAVED ?? 0);
    } else {
      return 0;
    }
  }, 0);

  return (
    <Container>
      <Left>
        <SubTitleL>SAVED</SubTitleL>
        <MainTitle>
          <span style={{ fontSize: "1.5rem", transform: "translateY(2px)" }}>
            <FaIndianRupeeSign />
          </span>
          {saved}
        </MainTitle>
      </Left>
      <Right>
        <SubTitleR>SPENT</SubTitleR>
        <MainTitle>
          <span style={{ fontSize: "1.5rem", transform: "translateY(2px)" }}>
            <FaIndianRupeeSign />
          </span>
          {spent}
        </MainTitle>
      </Right>
    </Container>
  );
}

const MainTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  transform: translate(-6px, -2px);
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Amount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  background-color: #04b488;
`;

const SubTitleL = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${generateDarkTextColorForLightBg("#04b488", 50)};
  padding: 0.25rem;
  font-size: 1.5rem;
  font-size: 1rem;
`;

const SubTitleR = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${generateDarkTextColorForLightBg("#fe6662", 50)};
  padding: 0.25rem;
  font-size: 1.5rem;
  font-size: 1rem;
  transform: translateX(2px);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  background-color: #fe6662;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;
