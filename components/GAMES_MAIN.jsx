import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { Popover, Progress } from "antd";
import ACH_CARD from "./ACH_CARD";

export default function GAMES_MAIN({
  sortedGames,
  setSelectedGame,
  setSelectedMode,
  setGameData,
  setTabActive,
  setShowEditModal,
}) {
  return (
    <Games>
      <Games2Line>
        {sortedGames?.map((game, index) => {
          let total = 0;
          let completed = 0;

          game?.achievements?.forEach((ach) => {
            total++;
            if (ach?.achieved == 1 || ach?.achievedByLearning) {
              completed++;
            }
          });

          let allUnlocked = game?.achievements
            ?.filter((ach) => ach?.achieved == 1)
            ?.sort((ach1, ach2) => +ach2?.unlocktime - +ach1?.unlocktime);

          return (
            <GameContainer
              color={index % 2 == 0 ? "#F9F9F9" : "#F5F5F7"}
              onClick={() => {
                setSelectedGame(game?.id);
                setSelectedMode("GAME");
                setTabActive("GAME");
              }}
            >
              <GameImage url={HEADER_IMAGE(game?.id)}></GameImage>
              <BottomInner>
                <Top>
                  <TLeft>ACHIEVEMENTS</TLeft>
                  <TRight
                    onClick={() => {
                      setShowEditModal(true);
                      setGameData(() => game);
                    }}
                  >
                    {game?.completed}/{game?.total}
                  </TRight>
                </Top>
                <Bottom>
                  <Progress
                    percent={game?.completion}
                    showInfo={false}
                    trailColor="#3C3F49"
                    strokeColor={"#199FFF"}
                  />
                </Bottom>
                <BBottom>
                  {allUnlocked?.slice(0, 11).map((ach, index) => {
                    let desc1 = ach?.hiddenDesc;
                    let desc2 = ach?.description;
                    let desc3 = ach?.hiddenDesc?.split(
                      "Hidden achievement:"
                    )?.[1];

                    if (index != 10) {
                      return (
                        <Popover
                          placement="bottom"
                          content={
                            <ACH_CARD
                              ach={ach}
                              desc1={desc1}
                              desc2={desc2}
                              desc3={desc3}
                              index={index}
                              hideCompletion
                              longer={"500"}
                            />
                          }
                          title=""
                          styles={{
                            content: {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                            body: {
                              padding: 0, // Removes default internal spacing
                            },
                          }}
                        >
                          <AchIcon icon={ach?.icon}></AchIcon>
                        </Popover>
                      );
                    } else {
                      return (
                        <AchCounter>+{allUnlocked?.length - 10}</AchCounter>
                      );
                    }
                  })}
                </BBottom>
              </BottomInner>
            </GameContainer>
          );
        })}
      </Games2Line>
    </Games>
  );
}
const AchCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  z-index: 2;
  margin: 2px;
  font-size: 0.75rem;
  background: #2e3238;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  margin: 2px;
`;

const TLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  grid-area: label;
  font-weight: 700;
  font-size: 0.75rem;
  margin-right: 8px;
  color: inherit;
  letter-spacing: 0.03em;
`;

const TRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2px 0 0 0;
`;

const BBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 32px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const BottomInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  background-color: #16202d;
  width: 400px;
  color: #b8bcbf;
  padding: 2px 4px;
`;

const GameImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 400px;
  height: 187.5px;
  background-image: ${(props) => `url(${props.url})`};
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #111923;
  color: #333;
  padding: 4px;
  flex-direction: column;
  cursor: pointer;
`;

const Games2Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  background-color: #111923;
`;

const Games = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 98%;
  color: #fefefe;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  background-color: #111923;
`;
