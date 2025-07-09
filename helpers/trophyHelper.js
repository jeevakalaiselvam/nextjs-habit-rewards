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
