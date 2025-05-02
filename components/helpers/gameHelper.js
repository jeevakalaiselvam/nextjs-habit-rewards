export const GAME_UNLOCK_TYPE_TODAY = "GAME_UNLOCK_TYPE_TODAY";
export const GAME_UNLOCK_TYPE_WEEK = "GAME_UNLOCK_TYPE_WEEK";
export const GAME_UNLOCK_TYPE_MONTH = "GAME_UNLOCK_TYPE_MONTH";
export const GAME_UNLOCK_TYPE_ALL = "GAME_UNLOCK_TYPE_ALL";

export const getaUnlockedAchievementsByType = (
  games,
  type,
  onlyForLevel = false,
  ignoredGames = []
) => {
  let achievements = [];

  let gamesToCalculate = games;

  if (ignoredGames?.length > 0) {
    gamesToCalculate = games?.filter((game) =>
      ignoredGames?.includes(game?.id)
    );
  }

  gamesToCalculate?.forEach((game) => {
    game?.achievements?.forEach((ach, index) => {
      if (onlyForLevel) {
        if (
          game?.completion == COMPLETION_TARGET ||
          IS_PINNED(ignoredGames, game?.id)
        ) {
          achievements.push({
            ...ach,
            gameName: game?.name,
            gameId: game?.id,
          });
        }
      } else {
        achievements.push({
          ...ach,
          gameName: game?.name,
          gameId: game?.id,
        });
      }
    });
  });

  achievements
    ?.filter((achievement) => achievement?.achieved == 1)
    ?.sort((ach1, ach2) => ach2.unlocktime - ach1.unlocktime)
    ?.map((ach, index) => ({ ...ach, index: index }));

  let newAchievements = [];
  if (achievements) {
    if (type == GAME_UNLOCK_TYPE_TODAY) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate());
      let timeUTC;
      timeUTC = date.getTime() / 1000;

      newAchievements = achievements.filter(
        (achievement) =>
          (achievement?.achieved == 1 || achievement?.xp) &&
          achievement?.unlocktime > timeUTC
      );
    }

    if (type == GAME_UNLOCK_TYPE_WEEK) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - 7);
      let timeUTC;
      timeUTC = date.getTime() / 1000;

      newAchievements = achievements.filter(
        (achievement) =>
          achievement?.achieved == 1 && achievement?.unlocktime > timeUTC
      );
    }

    if (type == GAME_UNLOCK_TYPE_MONTH) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - 7);
      let timeUTC;
      timeUTC = date.getTime() / 1000;

      newAchievements = achievements.filter(
        (achievement) =>
          achievement?.achieved == 1 && achievement?.unlocktime > timeUTC
      );
    }

    if (type == GAME_UNLOCK_TYPE_ALL) {
      newAchievements = achievements.filter(
        (achievement) => achievement?.achieved == 1
      );
    }
  }

  return newAchievements.sort(
    (ach1, ach2) => ach2.unlocktime - ach1.unlocktime
  );
};
