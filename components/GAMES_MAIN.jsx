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
          if (ach?.achievedByLearning || ach?.achieved == 1) {
            completed++;
          }
        });

        let completion = (completed / total) * 100;
        let allUnlocked = game?.achievements
          ?.filter((ach) => ach?.achievedByLearning || ach?.achieved == 1)
          ?.sort((ach1, ach2) => +ach2?.unlocktime - +ach1?.unlocktime);

        let amountToShow = 7;

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
              {false && (
                <Top>
                  <TLeft>
                    {completed}/{total}
                  </TLeft>
                  <TRight
                    onClick={() => {
                      setShowEditModal(true);
                      setGameData(() => game);
                    }}
                  >
                    {completion.toFixed(2)}%
                  </TRight>
                </Top>
              )}
              {false && (
                <Bottom>
                  <Progress
                    style={{ margin: '-4px' }}
                    percent={completion}
                    showInfo={false}
                    trailColor="#3C3F49"
                    strokeColor={'#199FFF'}
                  />
                </Bottom>
              )}
              <BBottom>
                {allUnlocked?.length >= amountToShow &&
                  allUnlocked?.slice(0, amountToShow).map((ach, index) => {
                    let desc1 = ach?.hiddenDesc;
                    let desc2 = ach?.description;
                    let desc3 = ach?.hiddenDesc?.split(
                      'Hidden achievement:'
                    )?.[1];

                    if (index < amountToShow) {
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
                            <AchInner>
                              <AchIcon
                                achieved={ach?.achieved}
                                icon={ach?.icon}
                                onClick={() => {
                                  const query = encodeURIComponent(
                                    `${ach?.displayName} achievement ${ach?.gameName}`
                                  );
                                  window.open(
                                    `https://www.google.com/search?q=${query}`,
                                    '_blank'
                                  );
                                }}
                              />
                            </AchInner>
                          </AchIconOuter>
                        </Popover>
                      );
                    }
                  })}
                {allUnlocked?.length < amountToShow &&
                  [
                    ...allUnlocked,
                    ...new Array(amountToShow - allUnlocked?.length).fill(1),
                  ].map((ach, index) => {
                    let desc1 = ach?.hiddenDesc;
                    let desc2 = ach?.description;
                    let desc3 = ach?.hiddenDesc?.split(
                      'Hidden achievement:'
                    )?.[1];

                    if (index < allUnlocked?.length - 1) {
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
                            <AchInner>
                              <AchIcon
                                achieved={ach?.achieved}
                                icon={ach?.icon}
                                onClick={() => {
                                  const query = encodeURIComponent(
                                    `${ach?.displayName} achievement ${ach?.gameName}`
                                  );
                                  window.open(
                                    `https://www.google.com/search?q=${query}`,
                                    '_blank'
                                  );
                                }}
                              />
                            </AchInner>
                          </AchIconOuter>
                        </Popover>
                      );
                    } else {
                      return (
                        <AchIconOuter>
                          <AchInner>
                            <AchCounter>{index == 8 && '+0'}</AchCounter>
                          </AchInner>
                        </AchIconOuter>
                      );
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

const BBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  min-height: 32px;
  margin-top: 4px;
  margin-bottom: 2px;
`;

const AchCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  z-index: 2;
  font-size: 1.25rem;
  transform: translateY(-2px);
`;

const AchInner = styled.div`
  padding: 3px;
  border-radius: 3px;
  overflow: hidden;
  line-height: 1em;
  position: relative;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0.14) 0,
    hsla(0, 0%, 100%, 0)
  );
`;

const AchIconOuter = styled.div`
  margin: 0 3px 7px;
  height: 64px;
  -webkit-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  position: relative;
  background: none;
  border-left: 1px solid transparent;
  border-top: 1px solid transparent;
  border-color: hsla(0, 0%, 96.1%, 0.3) transparent transparent
    hsla(0, 0%, 96.1%, 0.3);
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;

  &:hover {
    border-top: 1px solid transparent;
    border-color: #fefefe77;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
  }
`;

const AchIcon = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 56px;
  height: 56px;
  -webkit-box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  box-shadow: 5px 5px 22px -2px rgba(0, 0, 0, 0.5);
  background: ${(props) => `url(${props?.icon})`} center/contain no-repeat;
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
  padding: 2px 2px 0 2px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  padding: 2px 4px 0px 2px;
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
