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

export const calculatePSLevelAndProgress = (platinum, gold, silver, bronze) => {
  const platinumPoints = 300;
  const goldPoints = 90;
  const silverPoints = 30;
  const bronzePoints = 15;

  const totalPoints =
    platinum * platinumPoints +
    gold * goldPoints +
    silver * silverPoints +
    bronze * bronzePoints;

  const levelThresholds = [
    0, 3000, 6000, 10500, 16000, 23000, 31500, 41500, 53000, 66500, 100000,
  ];

  let level = 1;
  let progress = 0;

  for (let i = 0; i < levelThresholds.length - 1; i++) {
    const currentMin = levelThresholds[i];
    const nextMin = levelThresholds[i + 1];

    if (totalPoints < nextMin) {
      level =
        i * 100 +
        Math.floor(((totalPoints - currentMin) / (nextMin - currentMin)) * 100);
      progress = ((totalPoints - currentMin) / (nextMin - currentMin)) * 100;
      break;
    }
  }

  if (totalPoints >= 100000) {
    level = 999;
    progress = 100;
  }

  return {
    totalPoints,
    level: Math.min(level, 999),
    progressPercent: Math.min(progress.toFixed(2), 100),
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
