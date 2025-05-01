import {
  FETCH_ALL_ACHIEVEMENTS_GLOBAL,
  FETCH_ALL_ACHIEVEMENTS_SCHEMA,
  FETCH_ALL_GAMES,
  STEAM_ALL_ACHIEVEMENTS_PLAYER,
} from "../../../components/helpers/urlHelper";

const axios = require("axios");

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      let finalGamesResponse = [];

      let gameIds = req.body?.gameIds;
      finalGamesResponse = gameIds?.map((game) => ({ id: game }));

      //Get All Achievements Schema for All Games
      finalGamesResponse = await Promise.all(
        finalGamesResponse?.map(async (game) => {
          try {
            console.log("CALLING", FETCH_ALL_ACHIEVEMENTS_SCHEMA(game?.id));
            const schemeAchievement = await axios.get(
              FETCH_ALL_ACHIEVEMENTS_SCHEMA(game?.id)
            );
            const schemeResponse = schemeAchievement.data;
            const newGame = {
              ...game,
              name: schemeResponse.game?.gameName,
              version: schemeResponse.game?.gameVersion,
              achievements:
                schemeResponse.game?.availableGameStats?.achievements || [],
            };
            return newGame;
          } catch (e) {
            return {};
          }
        })
      );

      //Combine Global Achievement Status
      finalGamesResponse = await Promise.all(
        finalGamesResponse?.map(async (game) => {
          try {
            console.log("CALLING", FETCH_ALL_ACHIEVEMENTS_GLOBAL(game?.id));
            const globalAchievementsResponse = await axios.get(
              FETCH_ALL_ACHIEVEMENTS_GLOBAL(game?.id)
            );
            const globalAchievementsData = globalAchievementsResponse.data;
            const globalAchievements =
              globalAchievementsData.achievementpercentages.achievements;
            let newAchievements = game?.achievements?.map((achievement) => {
              const achievementFound = globalAchievements?.find(
                (achievementInner) => {
                  return achievementInner.name === achievement?.name;
                }
              );
              const newAchievement = {
                ...achievement,
                percentage: achievementFound?.percent || 0,
              };
              return newAchievement;
            });
            const newGame = {
              ...game,
              achievements: newAchievements,
            };
            return newGame;
          } catch (e) {
            return {};
          }
        })
      );

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
