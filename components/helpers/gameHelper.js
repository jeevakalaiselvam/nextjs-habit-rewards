import {
  GAME_UNLOCK_TYPE_ALL,
  GAME_UNLOCK_TYPE_MONTH,
  GAME_UNLOCK_TYPE_TODAY,
  GAME_UNLOCK_TYPE_WEEK,
} from "./constantHelper";

export const getaUnlockedAchievementsByType = (games, type) => {
  let achievements = [];

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
