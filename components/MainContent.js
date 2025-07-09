import styled from "styled-components";
import { COLOR_ACCENT } from "../helpers/colorHelper";
import { useState } from "react";

export default function MainContent({ games }) {
  const [selected, setSelected] = useState("PROFILE");
  const [active, setActive] = useState("PROFILE");

  return (
    <Container>
      <FirstRow>
        <FRLeft>OBSIDIANLOGAN'S PROFILE</FRLeft>
        <FRRight>
          <TabLink
            onClick={() => setSelected("PROFILE")}
            active={selected == "PROFILE"}
            onMouseEnter={() => setActive("PROFILE")}
            onMouseLeave={() => setActive("")}
          >
            PROFILE
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("TROPHY LOG")}
            active={selected == "TROPHY LOG"}
            onMouseEnter={() => setActive("TROPHY LOG")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY LOG
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("TROPHY ADVISOR")}
            active={selected == "TROPHY ADVISOR"}
            onMouseEnter={() => setActive("TROPHY ADVISOR")}
            onMouseLeave={() => setActive("")}
          >
            TROPHY ADVISOR
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("STATS")}
            active={selected == "STATS"}
            onMouseEnter={() => setActive("STATS")}
            onMouseLeave={() => setActive("")}
          >
            STATS
          </TabLink>
        </FRRight>
        <FRRight>
          <TabLink
            onClick={() => setSelected("LEVEL HISTORY")}
            active={selected == "LEVEL HISTORY"}
            onMouseEnter={() => setActive("LEVEL HISTORY")}
            onMouseLeave={() => setActive("")}
          >
            LEVEL HISTORY
          </TabLink>
        </FRRight>
      </FirstRow>
    </Container>
  );
}

const LinkActive = styled.div`
  position: absolute;
  width: 40px;
  height: 1px;
  bottom: -0.25rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${COLOR_ACCENT};
`;

const TabLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 0.8rem;
  margin-right: 1rem;
  padding-bottom: 0.25rem;
  font-weight: ${(props) => (props.active ? "bold" : "300")};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${COLOR_ACCENT}` : `2px solid #00000000`};
`;

const FRLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const FRRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7e7e7;
  padding: 1rem;
  width: 100%;
  color: #44484b;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 1400px;
  min-height: 40vh;
  max-height: 40vh;
  background-color: #f7f7f7;
  border-radius: 4px;
  transform: translateY(-2rem);
`;
