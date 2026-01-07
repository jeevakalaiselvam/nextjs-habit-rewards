import styled from 'styled-components';
import { HEADER_IMAGE } from '../helpers/urlHelper';
import { Popover, Progress } from 'antd';
import ACH_CARD from './ACH_CARD';

export default function GAMES_MAIN({
  sortedGames,
  setSelectedGame,
  setSelectedMode,
  setGameData,
  setTabActive,
  setShowEditModal,
}) {
  //Comment
  return (
    <Games>
      {sortedGames?.map((game, index) => {
        let total = 0;
        let completed = 0;

        game?.achievements?.forEach((ach) => {
          total++;
          if (ach?.achieved == 1 || ach?.achievedByLearning) {
            completed++;
          }
        });

        let completion = (completed / total) * 100;
        let allUnlocked = game?.achievements
          ?.filter((ach) => ach?.achieved == 1 || ach?.achievedByLearning)
          ?.sort((ach1, ach2) => +ach2?.unlocktime - +ach1?.unlocktime);

        return (
          <GameContainer
            color={index % 2 == 0 ? '#F9F9F9' : '#F5F5F7'}
            onClick={() => {
              setSelectedGame(game?.id);
              setSelectedMode('GAME');
              setTabActive('GAME');
            }}
          >
            <GameImage url={HEADER_IMAGE(game?.id)}></GameImage>
            <BottomInner>
              <Top>
                <TLeft>
                  {game?.name?.length > 40
                    ? game?.name?.slice(0, 40) + '...'
                    : game?.name}
                </TLeft>
                <TRight
                  onClick={() => {
                    setShowEditModal(true);
                    setGameData(() => game);
                  }}
                >
                  {completed}/{total}
                </TRight>
              </Top>
              <Bottom>
                <Progress
                  percent={completion}
                  showInfo={false}
                  trailColor="#3C3F49"
                  strokeColor={'#199FFF'}
                />
              </Bottom>
              <BBottom>
                {allUnlocked?.slice(0, 10).map((ach, index) => {
                  let desc1 = ach?.hiddenDesc;
                  let desc2 = ach?.description;
                  let desc3 = ach?.hiddenDesc?.split(
                    'Hidden achievement:'
                  )?.[1];

                  if (index < 9) {
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
                            longer={'600'}
                          />
                        }
                        title=""
                        styles={{
                          content: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                          },
                          body: {
                            padding: 0, // Removes default internal spacing
                          },
                        }}
                      >
                        <AchIconOuter>
                          <AchIcon icon={ach?.icon}></AchIcon>
                        </AchIconOuter>
                      </Popover>
                    );
                  } else {
                    return <AchCounter>+{allUnlocked?.length - 10}</AchCounter>;
                  }
                })}
              </BBottom>
            </BottomInner>
          </GameContainer>
        );
      })}
    </Games>
  );
}

const AchIconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  position: relative;
  z-index: 2;
  overflow: hidden;
`;

const AchCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 46px;
  z-index: 2;
  margin: 2px;
  font-size: 1rem;
  border-radius: 2px;
  transform: translateY(1px);
  background: #2e3238;
`;

const AchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${(props) => `url(${props?.icon})`};
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  margin: 2px;
  position: absolute;
  top: calc(50%);
  left: calc(50%);
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const TLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  grid-area: label;
  font-weight: 500;
  font-size: 0.8rem;
  margin-right: 8px;
  color: inherit;
  letter-spacing: 0.03em;
`;

const TRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.8rem;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 6px 0 0 4px;
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
  padding-left: 2px;
`;

const BottomInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  background-color: #16202d;
  width: 490px;
  color: #b8bcbf;
  padding: 2px 4px;
`;

const GameImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 490px;
  height: 180px;
  margin: 0px 4px 0px 4px;
  background-image: ${(props) => `url(${props.url})`};
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #111923;
  color: #333;
  padding: 4px 0px;
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
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  color: #fefefe;
  font-size: 0.9rem;
  flex-wrap: wrap;
  max-height: 100vh;
  overflow: scroll;
  background-color: #111923;
`;
