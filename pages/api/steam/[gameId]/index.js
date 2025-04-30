import {
  FETCH_ALL_ACHIEVEMENTS_GLOBAL,
  FETCH_ALL_ACHIEVEMENTS_SCHEMA,
} from "../../../../components/helpers/urlHelper";

const axios = require("axios");

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      let finalGamesResponse = {};
      const { gameId } = req.query;

      finalGamesResponse = {
        id: gameId,
      };

      //Testing Limit
      // finalGamesResponse = finalGamesResponse.slice(0, 5);

      //Get All Achievements Schema for All Games
      const schemeAchievement = await fetch(
        FETCH_ALL_ACHIEVEMENTS_SCHEMA(gameId)
      );
      const schemeResponse = await schemeAchievement?.json();
      finalGamesResponse = {
        ...finalGamesResponse,
        name: schemeResponse.game?.gameName,
        version: schemeResponse.game?.gameVersion,
        achievements:
          schemeResponse.game?.availableGameStats?.achievements || [],
      };

      //Combine Global Achievement Status
      const globalAchievementsResponse = await fetch(
        FETCH_ALL_ACHIEVEMENTS_GLOBAL(gameId)
      );
      const globalAchievementsData = await globalAchievementsResponse.json();
      const globalAchievements =
        globalAchievementsData.achievementpercentages.achievements;
      let newAchievements = finalGamesResponse?.achievements?.map(
        (achievement) => {
          const achievementFound = globalAchievements.find(
            (achievementInner) => {
              return achievementInner.name === achievement?.name;
            }
          );
          const newAchievement = {
            ...achievement,
            percentage: achievementFound.percent,
          };
          return newAchievement;
        }
      );
      finalGamesResponse = {
        ...finalGamesResponse,
        achievements: newAchievements,
      };
      //Get all Games and Refresh data in File
      res.status(200).json({ status: "success", data: finalGamesResponse });
    } catch (error) {
      console.error(error);
      //Get all Games and Refresh data in File
      res.status(500).json({ status: "error", error: error });
    }
  }
};

export default handler;
