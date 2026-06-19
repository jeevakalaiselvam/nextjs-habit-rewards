import styled from "styled-components";
import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GOLD2,
  COLOR_GREEN2,
  COLOR_PLATINUM,
  COLOR_SILVER2,
  COLOR_UNLOCKED_DARK,
} from "../helpers/colorHelper";
import { useEffect, useState } from "react";
import { HEADER_IMAGE, STEAM_STORE_URL } from "../helpers/urlHelper";
import {
  calculateLevelForAchs,
  calculateRankForCompletion,
  getAchsBasedOnRarity,
  scaleCompletion,
} from "../helpers/trophyHelper";
import GoldIconS from "./GoldIconS";
import SilverIconS from "./SilverIconS";
import BronzeIconS from "./BronzeIconS";
import PlatinumIconS from "./PlatinumIconS";
import GoldIcon from "./GoldIcon";
import SilverIcon from "./SilverIcon";
import BronzeIcon from "./BronzeIcon";
import PlatinumIcon from "./PlatinumIcon";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Popover, Row, Spin } from "antd";
import {
  formatDate,
  formatDate1,
  formatDate2,
  formatDate3,
  timeAgoInGame,
} from "../helpers/dateHelper";
import StatInformation from "./StatInformation";
import LevelProgressChart from "./LevelProgressChart";
import MultiProgressChart from "./MultiProgressChart";
import BarProgressChart from "./BarProgressChart";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import EditGameForm from "./EditGameForm";

/* ── colour tokens ── */
/* profile-page (light — matches game detail page) */
const D_BG = "#ebebeb";
const D_PANEL = "#ffffff";
const D_HDR = "#336291";
const D_ROW_ALT = "#f5f5f7";
const D_BORDER = "#dde0e5";
const D_TEXT = "#333333";
const D_MUTED = "#666666";
const D_LINK = "#4486c6";
const D_TRACK = "#d0d4da";
const D_FILL = "#4487c5";

/* game-detail page (light) */
const L_BG = "#ebebeb";
const L_PANEL = "#ffffff";
const L_ROW_ALT = "#f5f5f7";
const L_BORDER = "#dde0e5";
const L_TEXT = "#333333";
const L_MUTED = "#666666";
const L_LINK = "#4486c6";
const L_HDR_BG = "#336291";
const L_HDR_TEXT = "#ffffff";
const L_FILTER = "#4487c5";
const L_EARNED = "#f0fff4";
const L_TRACK = "#d0d4da";
const L_FILL = "#4487c5";

export default function MainContent({
  games,
  refreshData,
  setGamesLoading,
  gamesLoading,
  platinumDataLoading,
  tabActive,
  setTabActive,
  setGamesToInclude,
  gamesToInclude,
}) {
  const [selectedRarity, setSelectedRarity] = useState("COMMON");
  const [selectedMode, setSelectedMode] = useState(tabActive ?? "GAMES");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [gameData, setGameData] = useState({});
  const [gameSearch, setGameSearch] = useState("");
  const [activeAch, setActiveAch] = useState(0);
  const [gameDelayed, setGameDelayed] = useState(true);
  const [achFilter, setAchFilter] = useState("ALL"); // ALL | EARNED | UNEARNED

  /* ── sorted games ── */
  let sortedGames = [...(games ?? [])].sort((a, b) =>
    a?.name?.localeCompare(b?.name, undefined, { sensitivity: "base" }),
  );
  sortedGames = sortedGames.filter((g) =>
    g?.name?.toLowerCase()?.includes(gameSearch?.toLowerCase()),
  );

  /* ── all trophies across all games ── */
  let allUnlocked = [];
  let notUnlocked = [];
  games?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      const enriched = { ...ach, gameId: game.id, gameName: game.name };
      if (ach?.achieved == 1) allUnlocked.push(enriched);
      else notUnlocked.push(enriched);
    });
  });
  allUnlocked = allUnlocked.sort((a, b) => b?.unlocktime - a?.unlocktime);
  notUnlocked = notUnlocked.sort((a, b) => b?.percentage - a?.percentage);

  /* ── rarity buckets ── */
  const { ultrarare, veryrare, rare, uncommon, common } = getAchsBasedOnRarity(
    games ?? [],
  );

  /* ── sidebar: rarest earned ── */
  const rarestEarned = allUnlocked
    .filter((a) => a.color !== "Platinum")
    .sort((a, b) => +a.percentage - +b.percentage)
    .slice(0, 5);

  /* ── sidebar: platinum milestones ── */
  const platinumsEarned = allUnlocked
    .filter((a) => a.color === "Platinum")
    .sort((a, b) => +a.unlocktime - +b.unlocktime);

  /* ── level history ── */
  const {
    levelAchs,
    dailyUnlocks,
    monthlyUnlocks,
    dailyTypeBreakdown,
    hourlyUnlocks,
    weeklyUnlocks,
  } = calculateLevelForAchs(games ?? []);

  /* ── timers ── */
  useEffect(() => {
    const t = setInterval(
      () => setActiveAch((o) => (o < allUnlocked.length - 1 ? o + 1 : 0)),
      3000,
    );
    return () => clearInterval(t);
  }, [games]);

  useEffect(() => {
    setGameDelayed(true);
    const t = setTimeout(() => setGameDelayed(false), 600);
    return () => clearTimeout(t);
  }, [selectedGame?.id]);

  /* ── save included games ── */
  const saveIncludedGame = async () => {
    try {
      await axios.post("/api/include/include", { games: gamesToInclude });
      setSelectedMode("GAMES");
    } catch (e) {
      console.error(e);
    }
  };

  /* ── per-game counts helper ── */
  const getGameCounts = (game) => {
    let platinum = 0,
      gold = 0,
      silver = 0,
      bronze = 0,
      total = 0,
      completed = 0;
    game?.achievements?.forEach((ach) => {
      total++;
      if (ach?.achieved == 1) {
        completed++;
        if (ach.color === "Platinum") platinum++;
        else if (ach.color === "Gold") gold++;
        else if (ach.color === "Silver") silver++;
        else if (ach.color === "Bronze") bronze++;
      }
    });
    const completion =
      total === 0 ? 0 : +scaleCompletion(completed, total).toFixed(2);
    const { color, rank } = calculateRankForCompletion(completion);
    const sortedByPct = [...(game?.achievements ?? [])].sort(
      (a, b) => +b.percentage - +a.percentage,
    );
    const lastAch = sortedByPct[sortedByPct.length - 1];
    return {
      platinum,
      gold,
      silver,
      bronze,
      total,
      completed,
      completion,
      color,
      rank,
      lastAch,
    };
  };

  const descFor = (ach) => {
    const d3 = ach?.hiddenDesc?.split("Hidden achievement:")?.[1];
    return ach?.description || d3 || ach?.hiddenDesc || "";
  };

  const trophyIcon = (color, size = "S") => {
    if (size === "S") {
      if (color === "Platinum") return <PlatinumIconS />;
      if (color === "Gold") return <GoldIconS />;
      if (color === "Silver") return <SilverIconS />;
      return <BronzeIconS />;
    }
    if (color === "Platinum") return <PlatinumIcon />;
    if (color === "Gold") return <GoldIcon />;
    if (color === "Silver") return <SilverIcon />;
    return <BronzeIcon />;
  };

  const isGameDetail = selectedMode === "GAME" && selectedGame;

  /* ── game-detail computed values ── */
  let gdCounts = isGameDetail ? getGameCounts(selectedGame) : null;
  let gdAchs = isGameDetail
    ? [...(selectedGame.achievements ?? [])].sort(
        (a, b) => +b.percentage - +a.percentage,
      )
    : [];
  if (isGameDetail && achFilter === "EARNED")
    gdAchs = gdAchs.filter((a) => a.achieved == 1);
  if (isGameDetail && achFilter === "UNEARNED")
    gdAchs = gdAchs.filter((a) => a.achieved != 1);

  const gdUnlocked = isGameDetail
    ? [...(selectedGame.achievements ?? [])]
        .filter((a) => a.achieved == 1)
        .sort((a, b) => a.unlocktime - b.unlocktime)
    : [];
  const firstTrophy = gdUnlocked[0];
  const latestTrophy = gdUnlocked[gdUnlocked.length - 1];

  /* ═══════════════════════════ JSX ═══════════════════════════ */
  return (
    <Container>
      {showEditModal && (
        <EditGameForm
          games={games}
          gameData={gameData}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          refreshData={refreshData}
          setGamesLoading={setGamesLoading}
        />
      )}

      {/* ── Tab navigation bar (always shown) ── */}
      <TabBar>
        <TabBarInner>
          <ProfileLabel>
            <ProfileBadge>P</ProfileBadge>
            N7SHADOWX'S PROFILE
          </ProfileLabel>
          <TabLinks>
            {[
              { key: "GAMES", label: "PROFILE" },
              { key: "TROPHY_LOG", label: "TROPHY LOG" },
              { key: "TROPHY_ADVISOR", label: "TROPHY ADVISOR" },
              { key: "STATS", label: "STATS" },
              { key: "LEVEL_HISTORY", label: "LEVEL HISTORY" },
              { key: "SETTINGS", label: "SETTINGS" },
            ].map(({ key, label }) => (
              <TabLink
                key={key}
                active={
                  selectedMode === key ||
                  (key === "GAMES" && selectedMode === "GAME")
                }
                onClick={() => {
                  setSelectedMode(key);
                  setTabActive(key);
                  if (key !== "GAME") setSelectedGame(null);
                }}
              >
                {label}
              </TabLink>
            ))}
          </TabLinks>
        </TabBarInner>
      </TabBar>

      {/* ══════════════════════════════════════════
          GAME DETAIL PAGE
      ══════════════════════════════════════════ */}
      {isGameDetail && (
        <GameDetailPage>
          {/* Banner */}
          <GameBanner bg={HEADER_IMAGE(selectedGame.id)}>
            <BannerDim />
            <BannerStatsBar>
              <BannerStat>
                <BSNum>{gdCounts.completed}</BSNum>
                <BSLabel>TROPHIES EARNED</BSLabel>
              </BannerStat>
              <BannerStatDiv />
              <BannerStat>
                <BSNum>{gdCounts.total}</BSNum>
                <BSLabel>TOTAL TROPHIES</BSLabel>
              </BannerStat>
              <BannerStatDiv />
              <BannerStat>
                <BSNum>{gdCounts.completion}%</BSNum>
                <BSLabel>COMPLETION</BSLabel>
              </BannerStat>
              <BannerStatDiv />
              <BannerStat>
                <BSNum style={{ color: gdCounts.color }}>{gdCounts.rank}</BSNum>
                <BSLabel>RANK</BSLabel>
              </BannerStat>
            </BannerStatsBar>
          </GameBanner>

          {/* Breadcrumb + sub-tabs */}
          <GameBreadcrumbBar>
            <GameBreadcrumbInner>
              <Breadcrumb>
                <BreadLink
                  onClick={() => {
                    setSelectedGame(null);
                    setSelectedMode("GAMES");
                    setTabActive("GAMES");
                  }}
                >
                  N7SHADOWX
                </BreadLink>
                <BreadSep>›</BreadSep>
                <BreadCurrent>{selectedGame.name.toUpperCase()}</BreadCurrent>
              </Breadcrumb>
              <BreadTabs>
                <BreadTab active>TROPHIES</BreadTab>
              </BreadTabs>
            </GameBreadcrumbInner>
          </GameBreadcrumbBar>

          {/* Main layout: left content + right sidebar */}
          <GamePageLayout>
            <GamePageLeft>
              {/* Player card */}
              <PlayerCard>
                <PCLeft>
                  <PCAvatar />
                  <PCInfo>
                    <PCName>N7ShadowX</PCName>
                    <PCDate>
                      {latestTrophy
                        ? formatDate(new Date(latestTrophy.unlocktime * 1000))
                        : "Not started"}
                    </PCDate>
                  </PCInfo>
                </PCLeft>
                <PCDivider />
                <PCRank color={gdCounts.color}>{gdCounts.rank}</PCRank>
                <PCDivider />
                <PCRight>
                  <PCTrophies>
                    <PCT>
                      <PCIconWrap>
                        <PlatinumIconS />
                      </PCIconWrap>
                      <PCTNum style={{ color: COLOR_PLATINUM }}>
                        {gdCounts.platinum}
                      </PCTNum>
                    </PCT>
                    <PCT>
                      <PCIconWrap>
                        <GoldIconS />
                      </PCIconWrap>
                      <PCTNum style={{ color: COLOR_GOLD }}>
                        {gdCounts.gold}
                      </PCTNum>
                    </PCT>
                    <PCT>
                      <PCIconWrap>
                        <SilverIconS />
                      </PCIconWrap>
                      <PCTNum style={{ color: COLOR_SILVER2 }}>
                        {gdCounts.silver}
                      </PCTNum>
                    </PCT>
                    <PCT>
                      <PCIconWrap>
                        <BronzeIconS />
                      </PCIconWrap>
                      <PCTNum style={{ color: COLOR_BRONZE }}>
                        {gdCounts.bronze}
                      </PCTNum>
                    </PCT>
                  </PCTrophies>
                  <PCBarRow>
                    <PCBarTrack>
                      <PCBarFill pct={gdCounts.completion} />
                    </PCBarTrack>
                    <PCBarLabel>{gdCounts.completion}%</PCBarLabel>
                  </PCBarRow>
                </PCRight>
              </PlayerCard>

              {/* Trophy list header */}
              <TrophyListHeader>
                {selectedGame.name.toUpperCase()} TROPHIES
              </TrophyListHeader>

              {/* Filter bar */}
              <TrophyFilterBar>
                <TFilterBtn
                  active={achFilter === "ALL"}
                  onClick={() => setAchFilter("ALL")}
                >
                  TROPHIES (ALL)
                </TFilterBtn>
                <TFilterBtn
                  active={achFilter === "EARNED"}
                  onClick={() => setAchFilter("EARNED")}
                >
                  EARNED
                </TFilterBtn>
                <TFilterBtn
                  active={achFilter === "UNEARNED"}
                  onClick={() => setAchFilter("UNEARNED")}
                >
                  UNEARNED
                </TFilterBtn>
              </TrophyFilterBar>

              {/* Trophy rows */}
              {gameDelayed ? (
                <LightLoadingCenter>
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 32, color: L_FILL }}
                        spin
                      />
                    }
                  />
                </LightLoadingCenter>
              ) : (
                <TrophyList>
                  {gdAchs.map((ach, i) => {
                    const earned = ach.achieved == 1;
                    return (
                      <TrophyRow key={i} earned={earned} alt={i % 2 !== 0}>
                        <TrophyRowIcon earned={earned}>
                          <TrophyAchIcon
                            icon={ach.icon}
                            onClick={() => {
                              const q = encodeURIComponent(`${ach.displayName} achievement ${selectedGame.name}`);
                              window.open(`https://www.google.com/search?q=${q}`);
                            }}
                          />
                        </TrophyRowIcon>
                        <TrophyRowInfo>
                          <TrophyRowName>{ach.displayName}</TrophyRowName>
                          <TrophyRowDesc>{descFor(ach)}</TrophyRowDesc>
                        </TrophyRowInfo>
                        <TrophyRowRight>
                          {earned && ach.unlocktime && (
                            <EarnedDate>
                              <span>
                                {formatDate1(new Date(ach.unlocktime * 1000))}
                              </span>
                              <span
                                style={{ opacity: 0.7, fontSize: "0.68rem" }}
                              >
                                {formatDate2(new Date(ach.unlocktime * 1000))}
                              </span>
                            </EarnedDate>
                          )}
                          <RarPct>{ach.percentage}%</RarPct>
                          <RarLabel rarLabel={ach.label}>
                            {ach.label?.toUpperCase()}
                          </RarLabel>
                        </TrophyRowRight>
                        <TrophyTypeCell>
                          <span
                            style={{
                              transform: "scale(1.6)",
                              display: "block",
                            }}
                          >
                            {trophyIcon(ach.color)}
                          </span>
                        </TrophyTypeCell>
                      </TrophyRow>
                    );
                  })}
                </TrophyList>
              )}
            </GamePageLeft>

            {/* Right sidebar */}
            <GamePageRight>
              {/* Cover art */}
              <GameCoverCard>
                <GameCoverImg bg={HEADER_IMAGE(selectedGame.id)} />
                <GameCoverBody>
                  <GCRow>
                    <GCLabel>Platform</GCLabel>
                    <GCVal>PC (Steam)</GCVal>
                  </GCRow>
                  <GCDivider />
                  <GCRow>
                    <GCLabel>Trophies</GCLabel>
                    <GCTrophyRow>
                      <GCT color={COLOR_PLATINUM}>
                        <GCIconWrap>
                          <PlatinumIconS />
                        </GCIconWrap>
                        {gdCounts.platinum}
                      </GCT>
                      <GCT color={COLOR_GOLD}>
                        <GCIconWrap>
                          <GoldIconS />
                        </GCIconWrap>
                        {gdCounts.gold}
                      </GCT>
                      <GCT color={COLOR_SILVER2}>
                        <GCIconWrap>
                          <SilverIconS />
                        </GCIconWrap>
                        {gdCounts.silver}
                      </GCT>
                      <GCT color={COLOR_BRONZE}>
                        <GCIconWrap>
                          <BronzeIconS />
                        </GCIconWrap>
                        {gdCounts.bronze}
                      </GCT>
                    </GCTrophyRow>
                  </GCRow>
                  <GCDivider />
                  {firstTrophy && (
                    <GCRow>
                      <GCLabel>First Trophy</GCLabel>
                      <GCDateVal>
                        <span>
                          {formatDate1(new Date(firstTrophy.unlocktime * 1000))}
                        </span>
                        <span style={{ color: L_LINK, fontSize: "0.72rem" }}>
                          {timeAgoInGame(
                            new Date(firstTrophy.unlocktime * 1000),
                          )}
                        </span>
                      </GCDateVal>
                    </GCRow>
                  )}
                  {latestTrophy && (
                    <GCRow>
                      <GCLabel>Latest Trophy</GCLabel>
                      <GCDateVal>
                        <span>
                          {formatDate1(
                            new Date(latestTrophy.unlocktime * 1000),
                          )}
                        </span>
                        <span style={{ color: L_LINK, fontSize: "0.72rem" }}>
                          {timeAgoInGame(
                            new Date(latestTrophy.unlocktime * 1000),
                          )}
                        </span>
                      </GCDateVal>
                    </GCRow>
                  )}
                  {firstTrophy &&
                    latestTrophy &&
                    firstTrophy.unlocktime !== latestTrophy.unlocktime && (
                      <>
                        <GCDivider />
                        <GCRow>
                          <GCLabel>Gap</GCLabel>
                          <GCVal style={{ color: L_MUTED }}>
                            {timeAgoInGame(
                              new Date(firstTrophy.unlocktime * 1000),
                            )}{" "}
                            →{" "}
                            {timeAgoInGame(
                              new Date(latestTrophy.unlocktime * 1000),
                            )}
                          </GCVal>
                        </GCRow>
                      </>
                    )}
                  <GCDivider />
                  <GCRow>
                    <a
                      href={STEAM_STORE_URL(selectedGame.id)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: L_LINK, fontSize: "0.78rem" }}
                    >
                      View on Steam Store ↗
                    </a>
                  </GCRow>
                </GameCoverBody>
              </GameCoverCard>
            </GamePageRight>
          </GamePageLayout>
        </GameDetailPage>
      )}

      {/* ══════════════════════════════════════════
          PROFILE PAGE (games list + other tabs)
      ══════════════════════════════════════════ */}
      {!isGameDetail && (
        <>
          {/* Recent achievements strip */}
          <RecentAchs>
            {allUnlocked
              .slice(0, 31)
              .filter((a) => a?.color !== "Platinum")
              .map((ach, i) => (
                <Popover
                  key={i}
                  placement="top"
                  title=""
                  content={
                    <RecentAchPopover>
                      <DAchIconOuter achieved={ach?.achieved}>
                        <DAchIcon icon={ach?.icon} />
                      </DAchIconOuter>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          padding: "0 0.5rem",
                        }}
                      >
                        <div style={{ color: D_LINK, fontSize: "0.85rem" }}>
                          {ach?.displayName}
                        </div>
                        <div style={{ color: D_MUTED, fontSize: "0.72rem" }}>
                          {descFor(ach)}
                        </div>
                        {ach?.achieved == 1 && (
                          <div
                            style={{ fontSize: "0.7rem", color: COLOR_GREEN2 }}
                          >
                            {timeAgoInGame(new Date(ach?.unlocktime * 1000))} in{" "}
                            <span style={{ color: D_LINK }}>
                              {ach?.gameName}
                            </span>
                          </div>
                        )}
                      </div>
                    </RecentAchPopover>
                  }
                >
                  <RecentAchIcon achieved={ach?.achieved}>
                    <DAchIcon icon={ach?.icon} />
                  </RecentAchIcon>
                </Popover>
              ))}
          </RecentAchs>

          <MainColumns>
            <ContentArea>
              {gamesLoading && (
                <DLoadingCenter>
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 48, color: D_LINK }}
                        spin
                      />
                    }
                  />
                </DLoadingCenter>
              )}

              {/* ── GAMES list ── */}
              {!gamesLoading && selectedMode === "GAMES" && (
                <>
                  <FilterBar>
                    <SearchInput
                      placeholder="Search your games..."
                      value={gameSearch}
                      onChange={(e) => setGameSearch(e.target.value)}
                    />
                  </FilterBar>
                  <GameList>
                    {sortedGames
                      .filter((game) => {
                        const list = gamesToInclude ?? [];
                        return list.length === 0 || list.includes(game?.id);
                      })
                      .sort((a, b) => {
                        const { completion: c1 } = getGameCounts(a);
                        const { completion: c2 } = getGameCounts(b);
                        return c1 - c2;
                      })
                      .map((game, index) => {
                        const {
                          gold,
                          silver,
                          bronze,
                          total,
                          completed,
                          completion,
                          color,
                          rank,
                          lastAch,
                        } = getGameCounts(game);
                        const lastUnlocked = [...(game?.achievements ?? [])]
                          .filter((a) => a?.achieved == 1)
                          .sort((a, b) => b.unlocktime - a.unlocktime)[0];
                        const isPlatinumMissing =
                          game?.achievements?.length === 1;

                        return (
                          <GameRow
                            key={game.id}
                            alt={index % 2 !== 0}
                            onClick={() => {
                              setSelectedGame(game);
                              setSelectedMode("GAME");
                              setTabActive("GAME");
                            }}
                          >
                            <GameCover bg={game?.cover} />
                            <GameMeta>
                              <GameName>{game?.name}</GameName>
                              <GameDate>
                                {lastUnlocked
                                  ? formatDate(
                                      new Date(lastUnlocked.unlocktime * 1000),
                                    )
                                  : "Yet to start"}
                                <GameDateSep> · </GameDateSep>
                                {completed} of {total} Trophies
                              </GameDate>
                              {isPlatinumMissing &&
                                !(gamesLoading || platinumDataLoading) && (
                                  <WarningText>
                                    PLATINUM DATA MISSING
                                  </WarningText>
                                )}
                            </GameMeta>
                            <GameRowRight>
                              <PlatformBadge>PC</PlatformBadge>
                              <RankBadge rankColor={color}>{rank}</RankBadge>
                              <TrophyCounts>
                                <TCItem>
                                  <TCIconWrap>
                                    <GoldIconS />
                                  </TCIconWrap>
                                  <TCNum style={{ color: COLOR_GOLD }}>
                                    {gold}
                                  </TCNum>
                                </TCItem>
                                <TCItem>
                                  <TCIconWrap>
                                    <SilverIconS />
                                  </TCIconWrap>
                                  <TCNum style={{ color: COLOR_SILVER2 }}>
                                    {silver}
                                  </TCNum>
                                </TCItem>
                                <TCItem>
                                  <TCIconWrap>
                                    <BronzeIconS />
                                  </TCIconWrap>
                                  <TCNum style={{ color: COLOR_BRONZE }}>
                                    {bronze}
                                  </TCNum>
                                </TCItem>
                              </TrophyCounts>
                              <CompletionCol>
                                <DBarTrack>
                                  <DBarFill pct={completion} />
                                </DBarTrack>
                                <DCompPct>{completion}%</DCompPct>
                              </CompletionCol>
                            </GameRowRight>
                          </GameRow>
                        );
                      })}
                  </GameList>
                </>
              )}

              {/* ── Trophy Log ── */}
              {!gamesLoading && selectedMode === "TROPHY_LOG" && (
                <DFullList>
                  {allUnlocked.map((ach, i) => (
                    <DRow
                      key={i}
                      color={i % 2 === 0 ? D_PANEL : D_ROW_ALT}
                      achieved={ach?.achieved}
                    >
                      <DGameThumb image={HEADER_IMAGE(ach?.gameId)} />
                      <DAchIconOuter achieved={ach?.achieved}>
                        <DAchIcon
                          icon={ach?.icon}
                          onClick={() => {
                            const q = encodeURIComponent(`${ach?.displayName} achievement ${ach?.gameName ?? ""}`);
                            window.open(`https://www.google.com/search?q=${q}`);
                          }}
                        />
                      </DAchIconOuter>
                      <DAchInfo>
                        <DAchName>{ach?.displayName}</DAchName>
                        <DAchDesc>{descFor(ach)}</DAchDesc>
                      </DAchInfo>
                      <span
                        style={{
                          padding: "0 1rem",
                          color: D_MUTED,
                          fontSize: "0.8rem",
                        }}
                      >
                        #{allUnlocked.length - i}
                      </span>
                      <DVSep />
                      {ach?.achieved == 1 && (
                        <DUnlockDate>
                          <div>
                            {formatDate1(new Date(ach.unlocktime * 1000))}
                          </div>
                          <div style={{ opacity: 0.7 }}>
                            {formatDate2(new Date(ach.unlocktime * 1000))}
                          </div>
                        </DUnlockDate>
                      )}
                      <DVSep />
                      <DRarityBadge>
                        <span style={{ fontSize: "1rem" }}>
                          {ach?.percentage}%
                        </span>
                        <span style={{ fontSize: "0.65rem", color: D_MUTED }}>
                          {ach?.label?.toUpperCase()}
                        </span>
                      </DRarityBadge>
                      <DVSep />
                      <DTrophyTypeIcon>
                        {trophyIcon(ach?.color)}
                      </DTrophyTypeIcon>
                    </DRow>
                  ))}
                </DFullList>
              )}

              {/* ── Trophy Advisor ── */}
              {!gamesLoading && selectedMode === "TROPHY_ADVISOR" && (
                <DFullList>
                  {notUnlocked.map((ach, i) => (
                    <DRow
                      key={i}
                      color={i % 2 === 0 ? D_PANEL : D_ROW_ALT}
                      achieved={ach?.achieved}
                    >
                      <DGameThumb image={HEADER_IMAGE(ach?.gameId)} />
                      <DAchIconOuter achieved={ach?.achieved}>
                        <DAchIcon
                          icon={ach?.icon}
                          onClick={() => {
                            const q = encodeURIComponent(`${ach?.displayName} achievement ${ach?.gameName ?? ""}`);
                            window.open(`https://www.google.com/search?q=${q}`);
                          }}
                        />
                      </DAchIconOuter>
                      <DAchInfo>
                        <DAchName>{ach?.displayName}</DAchName>
                        <DAchDesc>{descFor(ach)}</DAchDesc>
                      </DAchInfo>
                      <span
                        style={{
                          padding: "0 1rem",
                          color: D_MUTED,
                          fontSize: "0.8rem",
                        }}
                      >
                        #{i + 1}
                      </span>
                      <DVSep />
                      <DRarityBadge>
                        <span style={{ fontSize: "1rem" }}>
                          {ach?.percentage}%
                        </span>
                        <span style={{ fontSize: "0.65rem", color: D_MUTED }}>
                          {ach?.label?.toUpperCase()}
                        </span>
                      </DRarityBadge>
                      <DVSep />
                      <DTrophyTypeIcon>
                        {trophyIcon(ach?.color)}
                      </DTrophyTypeIcon>
                    </DRow>
                  ))}
                </DFullList>
              )}

              {/* ── Level History ── */}
              {!gamesLoading && selectedMode === "LEVEL_HISTORY" && (
                <>
                  <LevelProgressChart
                    dailyUnlocks={levelAchs?.map((a) => ({
                      date: formatDate3(new Date(a?.unlocktime * 1000)),
                      Level: a?.levelReached,
                    }))}
                    size={900}
                  />
                  <DFullList>
                    {[...levelAchs].reverse().map((ach, i) => (
                      <DRow key={i} color={i % 2 === 0 ? D_PANEL : D_ROW_ALT}>
                        <DGameThumb image={HEADER_IMAGE(ach?.gameId)} />
                        <DAchIconOuter achieved={ach?.achieved}>
                          <DAchIcon icon={ach?.icon} />
                        </DAchIconOuter>
                        <DAchInfo>
                          <DAchName>{ach?.displayName}</DAchName>
                          <DAchDesc>{descFor(ach)}</DAchDesc>
                        </DAchInfo>
                        <DLevelReached>Level {ach?.levelReached}</DLevelReached>
                        <DVSep />
                        {ach?.achieved == 1 && (
                          <DUnlockDate>
                            <div>
                              {formatDate1(new Date(ach.unlocktime * 1000))}
                            </div>
                            <div style={{ opacity: 0.7 }}>
                              {formatDate2(new Date(ach.unlocktime * 1000))}
                            </div>
                          </DUnlockDate>
                        )}
                      </DRow>
                    ))}
                  </DFullList>
                </>
              )}

              {/* ── Stats ── */}
              {!gamesLoading && selectedMode === "STATS" && (
                <DStatsArea>
                  {[
                    {
                      title: "MAIN STATISTICS",
                      content: <StatInformation games={games} />,
                    },
                    {
                      title: "MONTHLY ACTIVITY",
                      content: (
                        <LevelProgressChart
                          dailyUnlocks={monthlyUnlocks}
                          size={900}
                        />
                      ),
                    },
                    {
                      title: "TROPHY PROGRESSION",
                      content: (
                        <MultiProgressChart
                          size={900}
                          dailyTypeBreakdown={dailyTypeBreakdown}
                        />
                      ),
                    },
                    {
                      title: "TROPHIES BY HOUR",
                      content: (
                        <BarProgressChart
                          dailyUnlocks={hourlyUnlocks}
                          size={900}
                        />
                      ),
                    },
                    {
                      title: "TROPHIES BY DAY",
                      content: (
                        <BarProgressChart
                          dailyUnlocks={weeklyUnlocks}
                          size={900}
                        />
                      ),
                    },
                  ].map(({ title, content }) => (
                    <DSectionPanel key={title}>
                      <DSectionHeader>{title}</DSectionHeader>
                      {content}
                    </DSectionPanel>
                  ))}
                </DStatsArea>
              )}

              {/* ── Settings ── */}
              {!gamesLoading && selectedMode === "SETTINGS" && (
                <DSectionPanel>
                  <DSectionHeader>SETTINGS</DSectionHeader>
                  <div style={{ padding: "1rem" }}>
                    <Row style={{ marginBottom: "1rem", width: "100%" }}>
                      <TextArea
                        rows={10}
                        placeholder="Enter game IDs to include (comma-separated)..."
                        value={
                          Array.isArray(gamesToInclude)
                            ? gamesToInclude.join(", ")
                            : gamesToInclude
                        }
                        onChange={(e) => setGamesToInclude(e.target.value)}
                      />
                    </Row>
                    <Row
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button type="primary" onClick={saveIncludedGame}>
                        Save
                      </Button>
                    </Row>
                  </div>
                </DSectionPanel>
              )}
            </ContentArea>

            {/* ── Dark sidebar (GAMES mode only) ── */}
            {selectedMode === "GAMES" && (
              <DSidebar>
                <DSidePanel>
                  <DSidePanelHeader>
                    <span>RAREST TROPHIES</span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      MORE
                    </span>
                  </DSidePanelHeader>
                  {rarestEarned.map((ach, i) => (
                    <DRarestRow key={i}>
                      <DRarestIcon>{trophyIcon(ach.color)}</DRarestIcon>
                      <DRarestAchImg icon={ach.icon} />
                      <DRarestInfo>
                        <DRarestName>{ach.displayName}</DRarestName>
                        <DRarestGame>{ach.gameName}</DRarestGame>
                      </DRarestInfo>
                      <DRarestPct>
                        <span>{ach.percentage}%</span>
                        <DRarLabel rl={ach.label}>
                          {ach.label?.toUpperCase()}
                        </DRarLabel>
                      </DRarestPct>
                    </DRarestRow>
                  ))}
                  {rarestEarned.length === 0 && (
                    <DEmptyState>No trophies earned yet</DEmptyState>
                  )}
                  <DRarityStrip>
                    {[
                      {
                        label: "ULTRA RARE",
                        count: ultrarare.length,
                        color: "#c0392b",
                      },
                      {
                        label: "VERY RARE",
                        count: veryrare.length,
                        color: "#e67e22",
                      },
                      { label: "RARE", count: rare.length, color: "#f39c12" },
                      {
                        label: "UNCOMMON",
                        count: uncommon.length,
                        color: "#27ae60",
                      },
                      { label: "COMMON", count: common.length, color: D_MUTED },
                    ].map(({ label, count, color }) => (
                      <DRarityStripItem key={label}>
                        <span
                          style={{
                            color,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {count}
                        </span>
                        <span
                          style={{
                            color: D_MUTED,
                            fontSize: "0.58rem",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {label}
                        </span>
                      </DRarityStripItem>
                    ))}
                  </DRarityStrip>
                </DSidePanel>

                <DSidePanel>
                  <DSidePanelHeader>
                    <span>TROPHY MILESTONES</span>
                  </DSidePanelHeader>
                  {platinumsEarned.slice(0, 5).map((ach, i) => (
                    <DMilestoneRow key={i}>
                      <DMilestoneThumb bg={HEADER_IMAGE(ach.gameId)} />
                      <DMilestoneInfo>
                        <div
                          style={{
                            color: D_TEXT,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          {ach.gameName}
                        </div>
                        <div style={{ color: D_LINK, fontSize: "0.72rem" }}>
                          {i === 0
                            ? "1st"
                            : i === 1
                              ? "2nd"
                              : i === 2
                                ? "3rd"
                                : `${i + 1}th`}{" "}
                          Platinum
                        </div>
                        <div style={{ color: D_MUTED, fontSize: "0.68rem" }}>
                          {ach.unlocktime
                            ? timeAgoInGame(new Date(ach.unlocktime * 1000))
                            : ""}
                        </div>
                      </DMilestoneInfo>
                    </DMilestoneRow>
                  ))}
                  {platinumsEarned.length === 0 && (
                    <DEmptyState>No platinums yet</DEmptyState>
                  )}
                </DSidePanel>
              </DSidebar>
            )}
          </MainColumns>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${D_BG};
  color: ${D_TEXT};
  font-family: "Nunito", sans-serif;
  font-size: 0.875rem;
`;

/* ── Tab bar ── */
const TabBar = styled.div`
  width: 100%;
  background: #336291;
  border-bottom: 1px solid #2a5278;
`;
const TabBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: stretch;
`;
const ProfileLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 700;
  padding-right: 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 0.5rem;
`;
const ProfileBadge = styled.span`
  background: #e8810a;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 2px;
`;
const TabLinks = styled.div`
  display: flex;
  align-items: stretch;
`;
const TabLink = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0.9rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.active ? "#ffffff" : "rgba(255,255,255,0.6)")};
  border-bottom: 3px solid ${(p) => (p.active ? "#ffffff" : "transparent")};
  transition:
    color 0.15s,
    border-color 0.15s;
  &:hover {
    color: #ffffff;
  }
`;

/* ── Recent achievements strip ── */
const RecentAchs = styled.div`
  width: 100%;
  background: ${D_PANEL};
  border-bottom: 1px solid ${D_BORDER};
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  gap: 0.25rem;
  overflow-x: auto;
`;
const RecentAchIcon = styled.div`
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border: 2px solid ${(p) => (p.achieved ? COLOR_UNLOCKED_DARK : D_BORDER)};
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: ${D_LINK};
  }
`;
const RecentAchPopover = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: 300px;
`;

/* ── Dark profile layout ── */
const MainColumns = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;
const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
`;
const DLoadingCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const SearchInput = styled.input`
  flex: 1;
  background: ${D_PANEL};
  border: 1px solid ${D_BORDER};
  border-radius: 3px;
  color: ${D_TEXT};
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  outline: none;
  &::placeholder {
    color: #aaa;
  }
  &:focus {
    border-color: ${D_LINK};
  }
`;

const GameList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${D_BORDER};
  border-radius: 3px;
  overflow: hidden;
  max-height: 75vh;
  overflow-y: auto;
`;
const GameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  background: ${(p) => (p.alt ? D_ROW_ALT : D_PANEL)};
  border-bottom: 1px solid ${D_BORDER};
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: #d6e9f8;
  }
  &:last-child {
    border-bottom: none;
  }
`;
const GameCover = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background: ${(p) => (p.bg ? `url(${p.bg}) center / cover` : "#d8dce0")}
    no-repeat;
  border-radius: 2px;
  border: 1px solid ${D_BORDER};
`;
const GameMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const GameName = styled.div`
  color: ${D_LINK};
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const GameDate = styled.div`
  color: ${D_MUTED};
  font-size: 0.7rem;
`;
const GameDateSep = styled.span`
  margin: 0 0.25rem;
  color: #bbb;
`;
const WarningText = styled.div`
  color: #e74c3c;
  font-size: 0.65rem;
  font-weight: 600;
  animation: blink 1.5s ease-in-out infinite;
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;
const GameRowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;
const PlatformBadge = styled.div`
  font-size: 0.62rem;
  font-weight: 700;
  padding: 3px 6px;
  border: 1px solid #bcc6d0;
  border-radius: 3px;
  color: #999;
  white-space: nowrap;
`;
const RankBadge = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 800;
  border-radius: 4px;
  background: ${(p) => p.rankColor ?? "#888"};
  color: #fff;
`;
const TrophyCounts = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 152px;
  flex-shrink: 0;
`;
const TCItem = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;
const TCIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  transform: translate(0.5rem, 0.25rem);
  line-height: 0;
`;
const TCNum = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  min-width: 18px;
  text-align: left;
`;
const CompletionCol = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
`;
const DBarTrack = styled.div`
  width: 110px;
  height: 6px;
  background: ${D_TRACK};
  border-radius: 3px;
  overflow: hidden;
`;
const DBarFill = styled.div`
  height: 100%;
  width: ${(p) => p.pct ?? 0}%;
  background: ${D_FILL};
  border-radius: 3px;
`;
const DCompPct = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${D_MUTED};
  width: 50px;
  flex-shrink: 0;
  text-align: right;
`;

/* dark lists */
const DFullList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1px;
  background: ${D_BORDER};
  border: 1px solid ${D_BORDER};
  border-radius: 3px;
  overflow: hidden;
`;
const DRow = styled.div`
  display: flex;
  align-items: center;
  background: ${(p) => p.color ?? D_PANEL};
  padding: 0.35rem 0.75rem;
  gap: 0.5rem;
  min-height: 70px;
`;
const DGameThumb = styled.div`
  width: 100px;
  height: 60px;
  flex-shrink: 0;
  background: ${(p) => (p.image ? `url(${p.image}) center/cover` : D_BG)};
`;
const DAchIconOuter = styled.div`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  background: ${(p) => (p.achieved ? "rgba(97,191,25,0.15)" : "transparent")};
  border: 1px solid ${(p) => (p.achieved ? COLOR_UNLOCKED_DARK : D_BORDER)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DAchIcon = styled.div`
  width: 46px;
  height: 46px;
  background: ${(p) =>
    p.icon ? `url(${p.icon}) center/contain no-repeat` : "none"};
  cursor: ${(p) => (p.onClick ? "pointer" : "default")};
`;
const DAchInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 0.75rem;
`;
const DAchName = styled.div`
  color: ${D_LINK};
  font-size: 0.84rem;
`;
const DAchDesc = styled.div`
  color: ${D_MUTED};
  font-size: 0.74rem;
  opacity: 0.85;
`;
const DVSep = styled.div`
  width: 1px;
  height: 34px;
  background: ${D_BORDER};
  flex-shrink: 0;
  margin: 0 0.5rem;
`;
const DUnlockDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 90px;
  color: #579428;
  font-size: 0.74rem;
`;
const DRarityBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  color: ${D_TEXT};
`;
const DTrophyTypeIcon = styled.div`
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.5);
`;
const DLevelReached = styled.div`
  padding: 0 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${COLOR_GOLD2};
`;

/* dark stats sections */
const DStatsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;
const DSectionPanel = styled.div`
  background: ${D_PANEL};
  border: 1px solid ${D_BORDER};
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
`;
const DSectionHeader = styled.div`
  background: ${D_HDR};
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

/* dark sidebar */
const DSidebar = styled.div`
  width: 290px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const DSidePanel = styled.div`
  background: ${D_PANEL};
  border: 1px solid ${D_BORDER};
  border-radius: 3px;
  overflow: hidden;
`;
const DSidePanelHeader = styled.div`
  background: ${D_HDR};
  padding: 0.55rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const DRarestRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid ${D_BORDER};
  &:last-of-type {
    border-bottom: none;
  }
`;
const DRarestIcon = styled.div`
  flex-shrink: 0;
  transform: scale(1.3);
  margin: 0 0.2rem;
`;
const DRarestAchImg = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 2px;
  background: ${(p) =>
    p.icon ? `url(${p.icon}) center/contain no-repeat` : D_BORDER};
`;
const DRarestInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
const DRarestName = styled.div`
  color: ${D_LINK};
  font-size: 0.76rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const DRarestGame = styled.div`
  color: ${D_MUTED};
  font-size: 0.66rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const DRarestPct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.76rem;
  color: ${D_TEXT};
  gap: 1px;
  flex-shrink: 0;
`;
const DRarLabel = styled.div`
  font-size: 0.58rem;
  color: ${(p) =>
    p.rl === "Ultra Rare"
      ? "#c0392b"
      : p.rl === "Very Rare"
        ? "#e67e22"
        : p.rl === "Rare"
          ? "#f39c12"
          : p.rl === "Uncommon"
            ? "#27ae60"
            : D_MUTED};
`;
const DRarityStrip = styled.div`
  display: flex;
  border-top: 1px solid ${D_BORDER};
`;
const DRarityStripItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.45rem 0.2rem;
  border-right: 1px solid ${D_BORDER};
  &:last-child {
    border-right: none;
  }
`;
const DMilestoneRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid ${D_BORDER};
  &:last-child {
    border-bottom: none;
  }
`;
const DMilestoneThumb = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  background: ${(p) => (p.bg ? `url(${p.bg}) center/cover` : D_BG)} no-repeat;
  border-radius: 2px;
  border: 1px solid ${D_BORDER};
`;
const DMilestoneInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const DEmptyState = styled.div`
  padding: 1rem 0.75rem;
  color: ${D_MUTED};
  font-size: 0.76rem;
  text-align: center;
`;

/* ════════════════════════════════════
   GAME DETAIL PAGE (light theme)
   ════════════════════════════════════ */
const GameDetailPage = styled.div`
  width: 100%;
  background: ${L_BG};
  min-height: calc(100vh - 120px);
`;

const GameBanner = styled.div`
  width: 100%;
  height: 220px;
  background: ${(p) => `url(${p.bg}) center / cover`} no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
`;
const BannerDim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 18, 28, 0.2) 0%,
    rgba(10, 18, 28, 0.85) 100%
  );
`;
const BannerStatsBar = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  gap: 0;
  background: rgba(0, 0, 0, 0.55);
`;
const BannerStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 2.5rem;
`;
const BSNum = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
`;
const BSLabel = styled.div`
  font-size: 0.6rem;
  color: #aab;
  margin-top: 1px;
`;
const BannerStatDiv = styled.div`
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
`;

const GameBreadcrumbBar = styled.div`
  background: #3a3f4b;
  border-bottom: 1px solid #2a2f3b;
`;
const GameBreadcrumbInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`;
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0;
`;
const BreadLink = styled.span`
  color: ${D_LINK};
  font-size: 0.78rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const BreadSep = styled.span`
  color: #888;
  font-size: 0.78rem;
`;
const BreadCurrent = styled.span`
  color: #ddd;
  font-size: 0.78rem;
  font-weight: 600;
`;
const BreadTabs = styled.div`
  display: flex;
`;
const BreadTab = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.85rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.active ? "#fff" : "#aaa")};
  border-bottom: 3px solid ${(p) => (p.active ? D_LINK : "transparent")};
`;

const GamePageLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;
const GamePageLeft = styled.div`
  flex: 1;
  min-width: 0;
`;
const GamePageRight = styled.div`
  width: 260px;
  flex-shrink: 0;
`;

/* player card */
const PlayerCard = styled.div`
  display: flex;
  align-items: center;
  background: ${L_PANEL};
  border: 1px solid ${L_BORDER};
  border-radius: 4px;
  margin-bottom: 0.75rem;
  overflow: hidden;
`;
const PCLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  flex-shrink: 0;
`;
const PCDivider = styled.div`
  width: 1px;
  align-self: stretch;
  background: ${L_BORDER};
  flex-shrink: 0;
`;
const PCAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: url("https://avatars.fastly.steamstatic.com/2d570b928b0e4b353c1a92ef43e534ee623e92ed_full.jpg")
    center/cover;
  border: 2px solid ${L_BORDER};
`;
const PCInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const PCName = styled.div`
  color: ${L_LINK};
  font-size: 0.9rem;
  font-weight: 800;
`;
const PCDate = styled.div`
  color: ${L_MUTED};
  font-size: 0.72rem;
`;
const PCRank = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 4px;
  background: ${(p) => p.color ?? "#888"};
  color: #fff;
  margin: 0 1rem;
`;
const PCRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
`;
const PCTrophies = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
const PCT = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const PCIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  line-height: 0;
  transform: translate(0.5rem, 0.25rem);
`;
const PCTNum = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
`;
const PCBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;
const PCBarTrack = styled.div`
  flex: 1;
  height: 7px;
  background: ${L_TRACK};
  border-radius: 4px;
  overflow: hidden;
`;
const PCBarFill = styled.div`
  height: 100%;
  width: ${(p) => p.pct}%;
  background: ${L_FILL};
  border-radius: 4px;
`;
const PCBarLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${L_MUTED};
  white-space: nowrap;
  min-width: 44px;
  text-align: right;
`;

/* trophy list */
const TrophyListHeader = styled.div`
  background: ${L_HDR_BG};
  color: ${L_HDR_TEXT};
  padding: 0.65rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
`;
const TrophyFilterBar = styled.div`
  display: flex;
  align-items: center;
  background: ${L_FILTER};
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;
const TFilterBtn = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.active ? "#fff" : "rgba(255,255,255,0.65)")};
  border-bottom: 3px solid ${(p) => (p.active ? "#fff" : "transparent")};
  &:hover {
    color: #fff;
  }
`;
const LightLoadingCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: ${L_PANEL};
`;
const TrophyList = styled.div`
  display: flex;
  flex-direction: column;
`;
const TrophyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.75rem;
  background: ${(p) => (p.earned ? L_EARNED : p.alt ? L_ROW_ALT : L_PANEL)};
  border-bottom: 1px solid ${L_BORDER};
  &:last-child {
    border-bottom: none;
  }
`;
const TrophyRowIcon = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border: 2px solid ${(p) => (p.earned ? "#5cb85c" : L_BORDER)};
  border-radius: 3px;
  overflow: hidden;
`;
const TrophyAchIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${(p) =>
    p.icon ? `url(${p.icon}) center/contain no-repeat` : "none"};
  cursor: pointer;
`;
const TrophyRowInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TrophyRowName = styled.div`
  color: ${L_LINK};
  font-size: 0.84rem;
  font-weight: 600;
`;
const TrophyRowDesc = styled.div`
  color: ${L_MUTED};
  font-size: 0.74rem;
`;
const TrophyRowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  min-width: 110px;
  flex-shrink: 0;
`;
const EarnedDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #3a843a;
  font-size: 0.74rem;
`;
const RarPct = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${L_TEXT};
`;
const RarLabel = styled.div`
  font-size: 0.62rem;
  color: ${(p) =>
    p.rarLabel === "Ultra Rare"
      ? "#c0392b"
      : p.rarLabel === "Very Rare"
        ? "#e67e22"
        : p.rarLabel === "Rare"
          ? "#e88e00"
          : p.rarLabel === "Uncommon"
            ? "#4a9a4a"
            : L_MUTED};
`;
const TrophyTypeCell = styled.div`
  width: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0.25rem);
`;

/* right sidebar (game detail — light) */
const GameCoverCard = styled.div`
  background: ${L_PANEL};
  border: 1px solid ${L_BORDER};
  border-radius: 3px;
  overflow: hidden;
`;
const GameCoverImg = styled.div`
  width: 100%;
  height: 130px;
  background: ${(p) => (p.bg ? `url(${p.bg}) center/cover` : "#ccc")} no-repeat;
`;
const GameCoverBody = styled.div`
  padding: 0.6rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const GCRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.76rem;
`;
const GCLabel = styled.div`
  color: ${L_MUTED};
  font-weight: 600;
  font-size: 0.72rem;
`;
const GCVal = styled.div`
  color: ${L_TEXT};
  font-size: 0.76rem;
`;
const GCDivider = styled.div`
  height: 1px;
  background: ${L_BORDER};
`;
const GCTrophyRow = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;
const GCIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  line-height: 0;
  transform: translate(0.25rem, 0.25rem);
`;
const GCT = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${(p) => p.color};
`;
const GCTBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  background: ${(p) => p.c};
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  flex-shrink: 0;
`;
const GCDateVal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
`;
