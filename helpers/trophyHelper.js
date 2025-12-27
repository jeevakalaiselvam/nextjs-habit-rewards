import {
  COLOR_GREEN,
  COLOR_RANK_A,
  COLOR_RANK_B,
  COLOR_RANK_C,
  COLOR_RANK_D,
  COLOR_RANK_E,
  COLOR_RANK_F,
  COLOR_RANK_S,
} from "./colorHelper";
import { formatDate1, formatDate3 } from "./dateHelper";

const trophyPoints = {
  bronze: 15,
  silver: 30,
  gold: 90,
  platinum: 300,
};

export const calculatePSLevelAndProgress = (platinum, gold, silver, bronze) => {
  // Trophy points
  const platinumPoints = 300;
  const goldPoints = 30;
  const silverPoints = 30;
  const bronzePoints = 15;

  // Calculate total XP
  const totalXP =
    platinum * platinumPoints +
    gold * goldPoints +
    silver * silverPoints +
    bronze * bronzePoints;

  // Level bands and XP per level
  const bands = [
    { startLevel: 1, endLevel: 99, xpPerLevel: 60 },
    { startLevel: 100, endLevel: 199, xpPerLevel: 90 },
    { startLevel: 200, endLevel: 299, xpPerLevel: 450 },
    { startLevel: 300, endLevel: 399, xpPerLevel: 900 },
    { startLevel: 400, endLevel: 499, xpPerLevel: 1350 },
    { startLevel: 500, endLevel: 599, xpPerLevel: 1800 },
    { startLevel: 600, endLevel: 699, xpPerLevel: 2250 },
    { startLevel: 700, endLevel: 799, xpPerLevel: 2700 },
    { startLevel: 800, endLevel: 899, xpPerLevel: 3150 },
    { startLevel: 900, endLevel: 999, xpPerLevel: 3600 },
  ];

  let accumulatedXP = 0;
  let level = 0;
  let xpIntoLevel = 0;
  let xpForNextLevel = bands[0].xpPerLevel;
  let foundBand = false;

  for (const band of bands) {
    const levelsInBand = band.endLevel - band.startLevel + 1;
    const bandXP = levelsInBand * band.xpPerLevel;

    if (totalXP < accumulatedXP + bandXP) {
      // Player is in this band
      const xpInBand = totalXP - accumulatedXP;
      const levelsPassed = Math.floor(xpInBand / band.xpPerLevel);
      level = band.startLevel + levelsPassed;

      xpIntoLevel = xpInBand % band.xpPerLevel;
      xpForNextLevel = band.xpPerLevel;

      foundBand = true;
      break;
    } else {
      accumulatedXP += bandXP;
    }
  }

  if (!foundBand) {
    // Total XP exceeds all defined bands
    level = 999;
    xpIntoLevel = 0;
    xpForNextLevel = null;
  }

  // Special case for zero XP → level 1
  if (totalXP === 0) {
    level = 1;
    xpIntoLevel = 0;
    xpForNextLevel = bands[0].xpPerLevel;
  }

  const progressPercent = xpForNextLevel
    ? Math.min((xpIntoLevel / xpForNextLevel) * 100, 100)
    : 100;

  const remainingXP =
    xpForNextLevel !== null ? xpForNextLevel - xpIntoLevel : null;

  return {
    totalXP,
    level,
    progressPercent: parseFloat(progressPercent.toFixed(2)),
    xpIntoLevel,
    xpForNextLevel,
    remainingXP,
  };
};

export const calculateLevelForAchs = (games) => {
  // Flatten and filter all unlocked achievements
  const allAchievements = games
    .flatMap((game) =>
      game.achievements.map((ach) => ({ ...ach, gameId: game.id }))
    )
    .filter((ach) => ach?.achieved == 1 && ach.unlocktime)
    .sort((a, b) => a.unlocktime - b.unlocktime); // UNIX timestamp

  let platinum = 0,
    gold = 0,
    silver = 0,
    bronze = 0;
  let previousLevel = 0;
  const levelAchs = [];

  for (const ach of allAchievements) {
    if (ach.color === "Bronze") bronze++;
    else if (ach.color === "Silver") silver++;
    else if (ach.color === "Gold") gold++;
    else if (ach.color === "Platinum") platinum++;

    const { level, totalXP } = calculatePSLevelAndProgress(
      platinum,
      gold,
      silver,
      bronze
    );

    if (level > previousLevel) {
      levelAchs.push({
        ...ach,
        levelReached: level,
        totalXP,
      });
      previousLevel = level;
    }
  }

  // --- Prepare empty maps ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyMap = {};
  const hourlyMap = Array.from({ length: 24 }, (_, i) => ({
    date: `${i}:00`,
    count: 0,
  }));
  const weekdayMap = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  const monthlyMap = {};

  // Initialize last 45 days in dailyMap
  for (let i = 45; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - (i - 1));
    const key = formatDate3(date); // YYYY-MM-DD
    dailyMap[key] = {
      Bronze: 0,
      Silver: 0,
      Gold: 0,
      Platinum: 0,
    };
  }

  // Process all achievements
  allAchievements.forEach((ach) => {
    const unlockDate = new Date(ach.unlocktime * 1000);
    const dateKey = formatDate3(unlockDate);
    const hour = unlockDate.getHours();
    const weekday = unlockDate.toLocaleDateString("en-US", {
      weekday: "short",
    }); // e.g., Mon

    // Daily trophy type count
    if (dailyMap[dateKey] && ach.color in dailyMap[dateKey]) {
      dailyMap[dateKey][ach.color]++;
    }

    // Hourly unlocks
    if (hourlyMap[hour]) {
      hourlyMap[hour].count++;
    }

    // Weekly unlocks
    if (weekdayMap[weekday] !== undefined) {
      weekdayMap[weekday]++;
    }

    // Monthly unlocks
    const monthKey = `${unlockDate.toLocaleString("en-US", {
      month: "short",
    })}-${String(unlockDate.getFullYear()).slice(-2)}`; // e.g., "Jul-25"
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = 0;
    monthlyMap[monthKey]++;
  });

  // Format final outputs
  const dailyUnlocks = Object.entries(dailyMap).map(([date, types]) => ({
    date,
    ...types,
    count: types.Bronze + types.Silver + types.Gold + types.Platinum,
  }));

  const dailyTypeBreakdown = Object.entries(dailyMap).map(([date, types]) => ({
    date,
    ...types,
  }));

  const monthlyUnlocks = Object.entries(monthlyMap).map(([month, count]) => ({
    date: month,
    count,
  }));

  const weeklyUnlocks = Object.entries(weekdayMap).map(([day, count]) => ({
    date: day,
    count,
  }));

  return {
    levelAchs,
    dailyUnlocks,
    dailyTypeBreakdown,
    monthlyUnlocks,
    hourlyUnlocks: hourlyMap,
    weeklyUnlocks,
  };
};

export const calculateRankForCompletion = (completion) => {
  if (completion < 100 && completion >= 75) {
    return { color: COLOR_RANK_S, rank: "S" };
  }
  if (completion < 75 && completion >= 60) {
    return { color: COLOR_RANK_A, rank: "A" };
  }
  if (completion < 60 && completion >= 40) {
    return { color: COLOR_RANK_B, rank: "B" };
  }
  if (completion < 40 && completion >= 20) {
    return { color: COLOR_RANK_C, rank: "C" };
  }
  if (completion < 20 && completion >= 10) {
    return { color: COLOR_RANK_D, rank: "D" };
  }
  if (completion < 10 && completion >= 5) {
    return { color: COLOR_RANK_E, rank: "E" };
  }
  if (completion < 5 && completion >= 0) {
    return { color: COLOR_RANK_F, rank: "F" };
  }
  return { color: COLOR_RANK_F, rank: "F" };
};

export const getAchsBasedOnRarity = (games) => {
  let ultrarare = [],
    veryrare = [],
    rare = [],
    uncommon = [],
    common = [];

  let avg_80_100 = 0,
    avg_60_80 = 0,
    avg_40_60 = 0,
    avg_20_40 = 0,
    avg_0_20 = 0;

  let srank = 0,
    arank = 0,
    brank = 0,
    crank = 0,
    drank = 0,
    erank = 0,
    frank = 0;

  let completedAchs = [];

  let totalRarity = 0;
  let averageRarity = 0;
  let totalCompletion = 0;
  let averationCompletion = 0;
  let averageRank = "";

  let allAchs = [];
  games?.forEach((game) => {
    let completion = 0;
    let total = 0;
    let completed = 0;

    game?.achievements?.forEach((ach) => {
      total++;
      if (ach?.achieved == 1) {
        completed++;
        completedAchs.push(ach);
        totalRarity = totalRarity + Number(ach?.percentage);
        if (ach?.label == "Uncommon") {
          uncommon.push(ach);
        }
        if (ach?.label == "Common") {
          common.push(ach);
        }
        if (ach?.label == "Rare") {
          rare.push(ach);
        }
        if (ach?.label == "Very Rare") {
          veryrare.push(ach);
        }
        if (ach?.label == "Ultra Rare") {
          ultrarare.push(ach);
        }
      }
    });

    if (completed == 0) {
      completion = 0;
    } else {
      completion = ((completed / total) * 100)?.toFixed(2);
    }

    if (completion == 100) {
      srank++;
    }
    if (completion < 100 && completion >= 90) {
      arank++;
    }
    if (completion < 90 && completion >= 80) {
      brank++;
    }
    if (completion < 80 && completion >= 70) {
      crank++;
    }
    if (completion < 70 && completion >= 50) {
      drank++;
    }
    if (completion < 50 && completion >= 20) {
      erank++;
    }
    if (completion < 20 && completion >= 0) {
      frank++;
    }

    totalCompletion += completion;

    if (completion > 0 && completion < 20) {
      avg_0_20++;
    } else if (completion >= 20 && completion < 40) {
      avg_20_40++;
    } else if (completion >= 40 && completion < 60) {
      avg_40_60++;
    } else if (completion >= 60 && completion < 80) {
      avg_60_80++;
    } else if (completion >= 80 && completion <= 100) {
      avg_80_100++;
    }
  });

  averageRarity = totalRarity / completedAchs?.length;
  averationCompletion = totalCompletion / games?.length;

  if (averationCompletion == 100) {
    averageRank = "S";
  }
  if (averationCompletion < 100 && averationCompletion >= 90) {
    averageRank = "A";
  }
  if (averationCompletion < 90 && averationCompletion >= 80) {
    averageRank = "B";
  }
  if (averationCompletion < 80 && averationCompletion >= 70) {
    averageRank = "C";
  }
  if (averationCompletion < 70 && averationCompletion >= 50) {
    averageRank = "D";
  }
  if (averationCompletion < 50 && averationCompletion >= 20) {
    averageRank = "E";
  }
  if (averationCompletion < 20 && averationCompletion >= 0) {
    averageRank = "F";
  }

  return {
    ultrarare,
    veryrare,
    rare,
    uncommon,
    common,
    averageRarity: averageRarity?.toFixed(1),
    averationCompletion: averationCompletion?.toFixed(1),
    avg_80_100,
    avg_60_80,
    avg_40_60,
    avg_20_40,
    avg_0_20,
    srank,
    arank,
    brank,
    crank,
    drank,
    erank,
    frank,
    averageRank,
  };
};
