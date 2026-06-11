import styled from "styled-components";
import { HEADER_IMAGE } from "../helpers/urlHelper";
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

export default function MainHeader({
  games,
  gamesLoading,
  refreshData,
  setTabActive,
  tabActive,
  gamesToInclude,
}) {
  const bannerImage =
    "https://4kwallpapers.com/images/wallpapers/hogwarts-legacy-winter-1920x1200-20034.jpeg";

  let completed = 0;
  let allCompletion = 0;
  let unearned = 0;
  let platinum = 0;
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  let total = 0;

  const filteredGames = games?.filter((game) => {
    const list = gamesToInclude ?? [];
    return list.length === 0 || list.includes(game?.id);
  });

  filteredGames?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 0) {
        unearned++;
      } else {
        if (ach?.color === "Platinum") { platinum++; total++; }
        else if (ach?.color === "Gold") { gold++; total++; }
        else if (ach?.color === "Silver") { silver++; total++; }
        else if (ach?.color === "Bronze") { bronze++; total++; }
      }
    });

    const gameTotal = game?.achievements?.filter(a => a?.color !== "Platinum")?.length ?? 0;
    const gameDone = game?.achievements?.filter(a => a?.achieved == 1 && a?.color !== "Platinum")?.length ?? 0;
    const pct = gameTotal === 0 ? 0 : (gameDone / gameTotal) * 100;
    allCompletion += pct;
    if (gameDone >= gameTotal && gameTotal > 0) completed++;
  });

  const gamesCount = filteredGames?.length ?? 0;
  const avgCompletion = gamesCount === 0 ? 0 : (allCompletion / gamesCount).toFixed(2);

  const { progressPercent, level, remainingXP } = calculatePSLevelAndProgress(
    platinum, gold, silver, bronze
  );

  return (
    <Wrapper>
      {/* ── Profile banner ── */}
      <Banner background={bannerImage}>
        <Overlay />
        <BannerContent>
          <BannerLeft>
            <Avatar />
            <UserInfo>
              <Username>N7ShadowX</Username>
              <Tagline>Love to collect trophies!</Tagline>
            </UserInfo>
          </BannerLeft>

          <BannerCenter onClick={refreshData}>
            <LevelIcon />
            <LevelMeta>
              <LevelNum>{level}</LevelNum>
              <XPBarTrack>
                <XPBarFill percent={progressPercent} />
              </XPBarTrack>
              <XPLabel>{remainingXP} XP to next level</XPLabel>
            </LevelMeta>
          </BannerCenter>

          <BannerRight>
            <TrophyBadge color="#c8d0d8">
              <WhiteTrophy />
              <TBNum>{total}</TBNum>
            </TrophyBadge>
            <TrophyBadge color={COLOR_PLATINUM}>
              <PlatinumIcon />
              <TBNum>{platinum}</TBNum>
            </TrophyBadge>
            <TrophyBadge color={COLOR_GOLD}>
              <GoldIcon />
              <TBNum>{gold}</TBNum>
            </TrophyBadge>
            <TrophyBadge color={COLOR_SILVER}>
              <SilverIcon />
              <TBNum>{silver}</TBNum>
            </TrophyBadge>
            <TrophyBadge color={COLOR_BRONZE}>
              <BronzeIcon />
              <TBNum>{bronze}</TBNum>
            </TrophyBadge>
          </BannerRight>
        </BannerContent>
      </Banner>

      {/* ── Stats bar ── */}
      <StatsBar>
        <StatItem>
          <StatNum>{gamesCount}</StatNum>
          <StatLabel>GAMES PLAYED</StatLabel>
        </StatItem>
        <StatDiv />
        <StatItem>
          <StatNum>{completed}</StatNum>
          <StatLabel>COMPLETED GAMES</StatLabel>
        </StatItem>
        <StatDiv />
        <StatItem>
          <StatNum>{avgCompletion}%</StatNum>
          <StatLabel>COMPLETION</StatLabel>
        </StatItem>
        <StatDiv />
        <StatItem>
          <StatNum>{unearned}</StatNum>
          <StatLabel>UNEARNED TROPHIES</StatLabel>
        </StatItem>
        <StatDiv />
        <StatItem>
          <StatNum>{total}</StatNum>
          <StatLabel>TOTAL TROPHIES</StatLabel>
        </StatItem>
      </StatsBar>
    </Wrapper>
  );
}

/* ── Styled components ── */

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  width: 100%;
  min-height: 140px;
  background: ${(p) => `url(${p.background})`} center / cover no-repeat;
  position: relative;
  display: flex;
  align-items: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(14, 22, 33, 0.78);
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  gap: 1.5rem;
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: url("https://avatars.fastly.steamstatic.com/2d570b928b0e4b353c1a92ef43e534ee623e92ed_full.jpg") center / cover;
  border: 2px solid #3a5a7a;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Username = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
`;

const Tagline = styled.div`
  font-size: 0.78rem;
  color: #9aabba;
`;

const BannerCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-left: 1px solid #2e4059;
  border-right: 1px solid #2e4059;
`;

const LevelMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LevelNum = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLOR_GOLD2};
  line-height: 1;
`;

const XPBarTrack = styled.div`
  width: 100px;
  height: 5px;
  background: #2e4059;
  border-radius: 3px;
  overflow: hidden;
`;

const XPBarFill = styled.div`
  height: 100%;
  width: ${(p) => p.percent}%;
  background: ${COLOR_GOLD2};
  border-radius: 3px;
`;

const XPLabel = styled.div`
  font-size: 0.65rem;
  color: #9aabba;
`;

const BannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const TrophyBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  color: ${(p) => p.color};
`;

const TBNum = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  width: 100%;
`;

const StatsBar = styled.div`
  background: #ffffff;
  border-top: 1px solid #dde0e5;
  border-bottom: 1px solid #dde0e5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  gap: 0;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 2rem;
`;

const StatNum = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: #336291;
  line-height: 1.1;
  font-family: 'Nunito', sans-serif;
`;

const StatLabel = styled.div`
  font-size: 0.62rem;
  color: #888;
  letter-spacing: 0.06em;
  margin-top: 2px;
  text-transform: uppercase;
  font-family: 'Nunito', sans-serif;
`;

const StatDiv = styled.div`
  width: 1px;
  height: 36px;
  background: #dde0e5;
  flex-shrink: 0;
`;
