import styled from "styled-components";
import {
  COLOR_ACCENT,
  COLOR_ACH,
  COLOR_BLACK1,
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

export default function MainGames() {
  const router = useRouter();
  const key = "rainbow_six_siege";

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
        .post("/api/rainbow_six_siege_completed", { ...challenge })
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
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 1);
  }

  const options = [
    { label: "Attacker", value: "Attacker" },
    { label: "Defender", value: "Defender" },
  ];

  return (
    <Container>
      <Header>
        <HLeft>
          <IconCount
            iconSize="1.15rem"
            textSize="1.15rem"
            icon={<TbArrowLeft />}
            color={COLOR_WHITE}
            count={"Trophies"}
            onClick={() => {
              router.push("/");
            }}
          />
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
          <TopContent>
            {get1RandomChallenges()?.map((challenge) => {
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
                  </ChallengeContainer>
                  <Actions>
                    <ActionComplete
                      onClick={() => {
                        completeChallenge(challenge);
                      }}
                    >
                      {challengeCompleteLoading ? (
                        <CompletionButton>
                          <TitleForCompletion>MARKING...</TitleForCompletion>
                        </CompletionButton>
                      ) : (
                        <CompletionButton>
                          <TitleForCompletion>MARK COMPLETE</TitleForCompletion>
                        </CompletionButton>
                      )}
                    </ActionComplete>
                  </Actions>
                </ChallengeOuterContainer>
              );
            })}
          </TopContent>
        )}
        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <TitleRecent>Completed Challenges</TitleRecent>
        )}
        {!allChallengeLoading && !allChallengeCompletedLoading && (
          <BottomContent>
            {completedChallenges?.map((challenge, index) => {
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
    </Container>
  );
}

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

const NoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 10vh;
`;

const CompletionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconForCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleForCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
`;

const ActionComplete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 1rem 0.5rem;
  margin-left: 0.25rem;
  background-color: ${COLOR_GREEN};
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
  margin-top: 1rem;
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
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: 0.25rem;
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
