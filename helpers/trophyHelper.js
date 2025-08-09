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

export const COMPLETION_FACTOR = 0.5;

export const calculatePSLevelAndProgress = (platinum, gold, silver, bronze) => {
  // Trophy points
  const platinumPoints = 300;
  const goldPoints = 90;
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
  let level = 1;
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

export const calculateRankForCompletion = (completion) => {
  if (completion == 100) {
    return { color: COLOR_RANK_S, rank: "S" };
  }
  if (completion < 100 && completion >= 90) {
    return { color: COLOR_RANK_A, rank: "A" };
  }
  if (completion < 90 && completion >= 80) {
    return { color: COLOR_RANK_B, rank: "B" };
  }
  if (completion < 80 && completion >= 70) {
    return { color: COLOR_RANK_C, rank: "C" };
  }
  if (completion < 70 && completion >= 50) {
    return { color: COLOR_RANK_D, rank: "D" };
  }
  if (completion < 50 && completion >= 20) {
    return { color: COLOR_RANK_E, rank: "E" };
  }
  if (completion < 20 && completion >= 0) {
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

  let allAchs = [];
  games?.forEach((game) => {
    game?.achievements?.forEach((ach) => {
      if (ach?.achieved == 1) {
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
  });
  return { ultrarare, veryrare, rare, uncommon, common };
};
