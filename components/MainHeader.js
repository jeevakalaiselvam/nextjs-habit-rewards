import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
import { FaTrophy } from "react-icons/fa";
import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GOLD2,
  COLOR_PLATINUM,
  COLOR_SILVER,
  COLOR_WHITE,
} from "../helpers/colorHelper";
import PlatinumIcon from "./PlatinumIcon";
import GoldIcon from "./GoldIcon";
import SilverIcon from "./SilverIcon";
import BronzeIcon from "./BronzeIcon";
import WhiteTrophy from "./WhiteTrophy";
import { calculatePSLevelAndProgress } from "../helpers/trophyHelper";
import LevelIcon from "./LevelIcon";
import GameCdImage from "./GameCdImage";

export default function MainHeader({
  games,
  gamesLoading,
  refreshData,
  setTabActive,
  tabActive,
}) {
  let image =
    "https://4kwallpapers.com/images/wallpapers/hogwarts-legacy-winter-1920x1200-20034.jpeg";

  let completed = 0;
  let allCompletion = 0;
  let unearned = 0;
  let platinumA = 0;
  let goldA = 0;
  let silverA = 0;
  let bronzeA = 0;
  let platinum = 0;
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  let total = 0;

  games?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 0) {
        unearned++;
        if (ach?.color == "Platinum") {
          platinumA++;
        }
        if (ach?.color == "Gold") {
          goldA++;
        }
        if (ach?.color == "Silver") {
          silverA++;
        }
        if (ach?.color == "Bronze") {
          bronzeA++;
        }
      } else {
        if (ach?.color == "Platinum") {
          platinum++;
          total++;
        }
        if (ach?.color == "Gold") {
          gold++;
          total++;
        }
        if (ach?.color == "Silver") {
          silver++;
          total++;
        }
        if (ach?.color == "Bronze") {
          bronze++;
          total++;
        }
      }
    });

    let exceptPlatinum = game?.achievements?.filter(
      (item) => item?.color !== "Platinum"
    );

    let completed = exceptPlatinum?.filter(
      (item) => item?.achieved == 1
    )?.length;
    let completion = (completed == 0 ? 0 : (completed / total) * 100)?.toFixed(
      2
    );
    allCompletion = allCompletion + completion;
    if (total == completed) {
      completed = completed + 1;
    }
  });

  let averageCompletion =
    allCompletion == 0 ? 0 : allCompletion / games?.length;

  let { progressPercent, level, xpForNextLevel, remainingXP } =
    calculatePSLevelAndProgress(platinum, gold, silver, bronze);

  return (
    <Container background={image}>
      <MainWrapper>
        <HeaderInner>
          <HeaderName>
            <Country></Country>
            <NameSection>
              <Name>N7ShadowX</Name>
              <Subtext>Love to collect trophies!</Subtext>
            </NameSection>
          </HeaderName>
          {!gamesLoading && (
            <HeaderProfileLevel>
              <LevelIconWrapper>
                <LevelIcon />
              </LevelIconWrapper>
              <LevelData
                style={{ transform: "translateY(-.5rem)" }}
                onClick={() => {
                  refreshData();
                }}
              >
                <LevelData1>{level}</LevelData1>
                <LevelData2 color={COLOR_GOLD + "55"}>
                  <LevelInner
                    color={COLOR_GOLD}
                    percent={progressPercent}
                  ></LevelInner>
                  <span
                    style={{
                      fontSize: ".65rem",
                      transform: "translateY(.9rem)",
                    }}
                  >
                    {remainingXP} XP
                  </span>
                </LevelData2>
              </LevelData>
            </HeaderProfileLevel>
          )}
          <HeaderCounts>
            <Section color={COLOR_WHITE}>
              <Top onClick={() => {}}>
                <span
                  style={{
                    transform: "translateY(-2.5px)",
                    marginRight: ".25rem",
                  }}
                >
                  <WhiteTrophy />
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                  {total}
                </span>
              </Top>
            </Section>
            <Section color={COLOR_PLATINUM}>
              <Top>
                <span
                  style={{
                    transform: "translateY(-2.5px)",
                    marginRight: ".25rem",
                  }}
                >
                  <PlatinumIcon />
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                  {platinum}
                </span>
              </Top>
            </Section>
            <Section color={COLOR_GOLD}>
              <Top>
                <span
                  style={{
                    transform: "translateY(-2.5px)",
                    marginRight: ".25rem",
                  }}
                >
                  <GoldIcon />
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                  {gold}
                </span>
              </Top>
            </Section>
            <Section color={COLOR_SILVER}>
              <Top>
                <span
                  style={{
                    transform: "translateY(-2.5px)",
                    marginRight: ".25rem",
                  }}
                >
                  <SilverIcon />
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                  {silver}
                </span>
              </Top>
            </Section>
            <Section color={COLOR_BRONZE}>
              <Top>
                <span
                  style={{
                    transform: "translateY(-2.5px)",
                    marginRight: ".25rem",
                  }}
                >
                  <BronzeIcon />
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: " bolder" }}>
                  {bronze}
                </span>
              </Top>
            </Section>
          </HeaderCounts>
        </HeaderInner>
      </MainWrapper>
      <Overlay></Overlay>
    </Container>
  );
}

const LevelIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
`;

const LevelData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
`;

const LevelData1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR_GOLD2};
  font-size: 1.5rem;
`;

const LevelInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4px;
  width: 40px;
  border-radius: 2px;
  background-color: ${(props) => props.color};
  position: absolute;
  left: 0;
  width: ${(props) => `${props.percent}%`};
`;

const LevelData2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4px;
  width: 40px;
  margin-top: 4px;
  border-radius: 2px;
  background-color: ${(props) => props.color};
  position: relative;
`;

const HeaderProfileLevel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;
`;

const HeaderCounts = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 1rem;
  flex: 1;
  color: ${(props) => props.color};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 300;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: bold;
`;

const BottomStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 1rem 1rem 2.5rem 1rem;
  bottom: 0;
  width: 1400px;
`;

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  z-index: 1;
  transform: translateX(-50%);
`;

const Country = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("https://avatars.fastly.steamstatic.com/2d570b928b0e4b353c1a92ef43e534ee623e92ed_full.jpg");
  width: 50px;
  height: 50px;
  background-size: cover;
  margin-right: 0.5rem;
  cursor: pointer;
`;

const NameSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Name = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25rem;
  font-size: 1.1rem;
`;

const Subtext = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8rem;
  opacity: 0.95;
  padding: 0.25rem;
`;

const HeaderName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 4px solid #989898;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const GameCDCollection = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 125px;
  flex-wrap: wrap;
  max-width: 1400px;
  overflow: scroll;
  z-index: 100;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 125px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.65);
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 125px;
  background: ${(props) => `url(${props.background})`};
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  background-color: #292b2d;
`;
