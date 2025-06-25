import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_ACH,
  COLOR_BLACK1,
  COLOR_BLACK2,
  COLOR_BLUE_DARK,
  COLOR_GREEN,
  COLOR_WHITE,
  generateDarkTextColorForLightBg,
} from "../helpers/colorHelper";
import GameCard from "../components/GameCard";
import IconCount from "../components/IconCount";
import {
  TbArrowLeft,
  TbBinaryTree2Filled,
  TbFileCheck,
  TbLayoutGridFilled,
  TbRefresh,
} from "react-icons/tb";
import { FaTrophy } from "react-icons/fa";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TiPlus } from "react-icons/ti";
import { Input, message, Modal, Radio, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { getOperatorIconFor } from "../siege/operatorHelper";
import { LoadingOutlined } from "@ant-design/icons";
import { RiSwordFill } from "react-icons/ri";
import { PiCastleTurretFill } from "react-icons/pi";

export default function MainGames() {
  const router = useRouter();
  const key = "rainbow_six_siege";

  const [randomChallenge, setRandomChallenge] = useState({});
  const [selectedTab, setSelectedTab] = useState("Attacker");
  const [challengeCompleteLoading, setChallengeCompleteLoading] =
    useState(false);
  const [challengeCreateLoading, setChallengeCreateLoading] = useState(false);
  const [allChallengeLoading, setAllChallengeLoading] = useState(false);
  const [allChallengeCompletedLoading, setAllChallengeCompletedLoading] =
    useState(false);
  const [allChallenges, setAllChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showModalNewAch, setShowModalNewAch] = useState(false);
  const [newAch, setNewAch] = useState({
    name: "rainbow_six_siege",
    title: "",
    description: "",
    type: "Attacker",
  });

  const refreshAllCompletedChallenges = () => {
    setAllChallengeCompletedLoading(true);
    setCompletedChallenges((_) => []);
    try {
      axios.get("/api/rainbow_six_siege_completed").then((response) => {
        setCompletedChallenges([]);
        setCompletedChallenges(response?.data);
        setAllChallengeCompletedLoading(false);
      });
    } catch (e) {
      message.info("Error refreshing Challenges !");
      setAllChallengeCompletedLoading(false);
    }
  };

  const refreshAllChallenges = () => {
    setAllChallengeLoading(true);
    setAllChallenges((_) => []);
    try {
      axios.get("/api/rainbow_six_siege_all").then((response) => {
        setAllChallenges([]);
        setAllChallenges(response?.data);
        setAllChallengeLoading(false);
      });
    } catch (e) {
      console.error(e);
      message.info("Error refreshing Challenges !");
      setAllChallengeLoading(false);
    }
  };

  const createChallenge = () => {
    setChallengeCreateLoading(true);
    try {
      axios
        .post("/api/rainbow_six_siege_all", { ...newAch })
        .then((response) => {
          setShowModalNewAch(false);
          refreshAllChallenges();
          refreshAllCompletedChallenges();
          setNewAch({
            name: "rainbow_six_siege",
            title: "",
            description: "",
            type: "Attacker",
          });
        });
    } catch (e) {
      console.error(e);
      message.info("Error saving Challenge !");
      setChallengeCreateLoading(false);
    }
  };

  const completeChallenge = (challenge) => {
    setChallengeCompleteLoading(true);
    try {
      axios
        .post("/api/rainbow_six_siege_completed", {
          ...challenge,
          unlocked: new Date(),
        })
        .then((response) => {
          setChallengeCompleteLoading(false);
          refreshAllChallenges();
          refreshAllCompletedChallenges();
        });
    } catch (e) {
      console.error(e);
      message.info("Error saving Challenge !");
      setChallengeCompleteLoading(false);
    }
  };

  useEffect(() => {
    refreshAllChallenges();
    refreshAllCompletedChallenges();
  }, []);

  function get1RandomChallenges() {
    let filteredForType = allChallenges?.filter(
      (challenge) => challenge?.type == (selectedTab ?? "Attacker")
    );
    const shuffled = [...filteredForType].sort(() => 0.5 - Math.random());
    let challenge = shuffled.slice(0, 1)?.[0];

    return challenge;
  }

  const options = [
    { label: "Attacker", value: "Attacker" },
    { label: "Defender", value: "Defender" },
  ];

  const changeRandomChallenge = () => {
    let challenge = get1RandomChallenges();
    if (window) {
      if (selectedTab == "Attacker") {
        localStorage.setItem("ATTACKER_CHALLENGE", JSON.stringify(challenge));
        setRandomChallenge(challenge);
      } else {
        localStorage.setItem("DEFENDER_CHALLENGE", JSON.stringify(challenge));
        setRandomChallenge(challenge);
      }
    }
  };

  useEffect(() => {
    let sortedChallenges = completedChallenges?.sort(
      (ach1, ach2) => new Date(ach2) - new Date(ach1)
    );

    let sortedAttackerChallenges = sortedChallenges?.filter(
      (challenge) => challenge?.type == "Attacker"
    );
    let sortedDefenderChallenges = sortedChallenges?.filter(
      (challenge) => challenge?.type == "Defender"
    );

    let lastUnlockedAttackerChallenge = sortedAttackerChallenges?.[0];
    let lastUnlockedDefenderChallenge = sortedDefenderChallenges?.[0];

    let attackerChallengeInStorage = {};
    let defenderChallengeInStorage = {};

    if (window) {
      attackerChallengeInStorage = JSON.parse(
        localStorage.getItem("ATTACKER_CHALLENGE") ?? {}
      );
      defenderChallengeInStorage = JSON.parse(
        localStorage.getItem("DEFENDER_CHALLENGE") ?? {}
      );
    }

    if (selectedTab == "Attacker") {
      if (attackerChallengeInStorage?.title) {
        setRandomChallenge(attackerChallengeInStorage);
      } else {
        changeRandomChallenge();
      }
    } else {
      if (defenderChallengeInStorage?.title) {
        setRandomChallenge(defenderChallengeInStorage);
      } else {
        changeRandomChallenge();
      }
    }
  }, [selectedTab, allChallenges, completedChallenges]);

  let sortedChallenges = completedChallenges?.sort(
    (ach1, ach2) => new Date(ach2) - new Date(ach1)
  );

  return (
    <Container>
      <Header>
        <HLeft>
          <IconCount
            iconSize="1.15rem"
            textSize="1.15rem"
            icon={<TbArrowLeft />}
            color={COLOR_WHITE}
            count={""}
            onClick={() => {
              router.push("/");
            }}
          />
          <span style={{ marginLeft: "0rem" }}>
            <IconCount
              iconSize="1.15rem"
              textSize="1.25rem"
              tTranslateY="-.09rem"
              icon={<FaTrophy />}
              color={COLOR_ACCENT}
              count={completedChallenges.length}
              onClick={() => {
                router.push("/");
              }}
            />
          </span>
        </HLeft>
        <HRight>
          <span style={{ marginRight: ".5rem" }}>
            <IconCount
              iconSize="1.15rem"
              textSize="1.15rem"
              icon={<TiPlus />}
              color={COLOR_WHITE}
              count={""}
              onClick={() => {
                setShowModalNewAch(true);
              }}
            />
          </span>
          <IconCount
            iconSize="1.15rem"
            textSize="1.15rem"
            icon={<TbRefresh />}
            color={COLOR_WHITE}
            count={""}
            onClick={() => {
              refreshAllChallenges();
              refreshAllCompletedChallenges();
            }}
          />
        </HRight>
      </Header>
      <Content>
        {!(allChallengeCompletedLoading || allChallengeLoading) &&
          allChallenges?.length == 0 && (
            <NoContent style={{ color: COLOR_WHITE }}>No Challenges</NoContent>
          )}
        {showModalNewAch && (
          <Modal
            title="Create Challenge"
            closable={{ "aria-label": "Custom Close Button" }}
            open={showModalNewAch}
            onOk={() => {
              createChallenge();
            }}
            onCancel={() => {
              setShowModalNewAch(false);
            }}
          >
            <CreateForm>
              <FormLabel>Type</FormLabel>
              <FormInput>
                <Radio.Group
                  options={options}
                  onChange={(e) => {
                    setNewAch((_) => ({ ..._, type: e?.target?.value }));
                  }}
                  value={newAch?.type}
                />
              </FormInput>
              <FormLabel>Title</FormLabel>
              <FormInput>
                <Input
                  placeholder="Enter Title..."
                  value={newAch?.title ?? ""}
                  onChange={(e) => {
                    setNewAch((_) => ({ ..._, title: e?.target?.value }));
                  }}
                />
              </FormInput>
              <FormLabel>Description</FormLabel>
              <FormInput>
                <TextArea
                  value={newAch?.description ?? ""}
                  onChange={(e) => {
                    setNewAch((_) => ({
                      ..._,
                      description: e?.target?.value,
                    }));
                  }}
                  placeholder="Enter Description.."
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </FormInput>
            </CreateForm>
          </Modal>
        )}

        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <TitleRecent2>Next Challenge</TitleRecent2>
        )}
        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <TopContent>
            <ChallengeOuterContainer>
              <ChallengeContainer>
                <IconOuter>
                  <Icon
                    icon={getOperatorIconFor(randomChallenge?.title)}
                  ></Icon>
                </IconOuter>
                <Data>
                  <Title>{randomChallenge?.title}</Title>
                  <Description>{randomChallenge?.description}</Description>
                </Data>
              </ChallengeContainer>
              <Actions>
                <ActionComplete
                  onClick={() => {
                    changeRandomChallenge();
                  }}
                >
                  <NextButton>
                    <TitleForNext>NEXT</TitleForNext>
                  </NextButton>
                </ActionComplete>
                <ActionComplete
                  onClick={() => {
                    completeChallenge(randomChallenge);
                  }}
                >
                  <CompletionButton>
                    <TitleForCompletion>COMPLETE</TitleForCompletion>
                  </CompletionButton>
                </ActionComplete>
              </Actions>
            </ChallengeOuterContainer>
          </TopContent>
        )}
        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <TitleRecent>Completed Challenges</TitleRecent>
        )}
        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <BottomContent>
            {sortedChallenges?.map((challenge, index) => {
              return (
                <ChallengeOuterContainer>
                  <ChallengeContainer>
                    <IconOuter>
                      <Icon icon={getOperatorIconFor(challenge?.title)}></Icon>
                    </IconOuter>
                    <Data>
                      <Title>{challenge?.title}</Title>
                      <Description>{challenge?.description}</Description>
                    </Data>
                    <RightTag>
                      <InnerRightTag>
                        <span
                          style={{
                            fontSize: "1rem",
                            transform: "translateY(0.5px)",
                          }}
                        >
                          {completedChallenges?.length - index}
                        </span>
                        <span
                          style={{
                            fontSize: ".8rem",
                            transform: "translateY(1px)",
                          }}
                        >
                          <FaTrophy />
                        </span>
                      </InnerRightTag>
                    </RightTag>
                  </ChallengeContainer>
                </ChallengeOuterContainer>
              );
            })}
          </BottomContent>
        )}
        {(allChallengeCompletedLoading || allChallengeLoading) && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        )}
      </Content>
      <VeryBottom>
        <BottomItem
          active={selectedTab == "Attacker"}
          onClick={() => setSelectedTab("Attacker")}
        >
          <BIcon>
            <RiSwordFill />
          </BIcon>
          <BTitle>Attacker</BTitle>
        </BottomItem>
        <BottomItem
          active={selectedTab == "Defender"}
          onClick={() => setSelectedTab("Defender")}
        >
          <BIcon>
            <PiCastleTurretFill />
          </BIcon>
          <BTitle>Defender</BTitle>
        </BottomItem>
      </VeryBottom>
    </Container>
  );
}

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  color: ${(props) => (props.active ? COLOR_ACCENT : COLOR_WHITE)};
  transform: translateY(-0.5rem);
`;

const BIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const VeryBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  background-color: ${COLOR_BLUE_DARK};
`;

const InnerRightTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
  color: ${generateDarkTextColorForLightBg(COLOR_ACCENT)};
`;

const RightTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 70px;
  background-color: ${COLOR_ACCENT};
`;

const TitleRecent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #fefefe;
  opacity: 0.5;
  margin-left: 0.75rem;
  padding: 0.5rem 0rem;
  font-size: 0.9rem;
`;

const TitleRecent2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #fefefe;
  opacity: 0.5;
  margin-left: 0.75rem;
  padding: 0.5rem 0rem;
  transform: translateY(-0.25rem);
  font-size: 0.9rem;
`;

const NoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 10vh;
`;

const NoContent1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const NextButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CompletionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const IconForCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleForNext = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.75rem 0.5rem;
  background-color: ${COLOR_ACCENT};
`;

const TitleForCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.75rem 0.5rem;
  background-color: ${COLOR_GREEN};
`;

const ActionComplete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;

  &:active {
    transform: translate(0px, 4px);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: 0.25rem;
`;

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
  padding: 0.25rem;
  max-height: 70vh;
  overflow: scroll;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex: 1;
  font-size: 0.9rem;
  padding: 0 0.25rem;
`;

const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.85rem;
  width: 100%;
  flex: 2;
  padding: 0.25rem;
  opacity: 0.5;
`;

const IconOuter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  z-index: 1;
  background: #000000;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80px;
  z-index: 2;
  background: ${(props) => `url(${props.icon})`};
  background-repeat: no-repeat;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  color: #fefefe;
  margin-left: 0.5rem;
  height: 70px;
`;

const ChallengeOuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`;

const ChallengeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${COLOR_ACH};
`;

const FormInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const FormLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const CreateForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

const HLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const HRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  min-height: calc(100vh - 60px - 75px);
  max-height: calc(100vh - 60px - 75px);
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
