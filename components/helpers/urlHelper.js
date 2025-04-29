export const API_KEY = "FA69F187B26B1E9BF3F1CBC186159539";

//NotRealLogan95

let PLATINUMSEEKER = "76561199850773973";

export let USER_ID = PLATINUMSEEKER;

export const FETCH_ALL_GAMES = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${USER_ID}&format=json`;

export const FETCH_ALL_ACHIEVEMENTS_SCHEMA = (gameID) =>
  `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${API_KEY}&appid=${gameID}&format=json&l=english`;

export const FETCH_ALL_ACHIEVEMENTS_GLOBAL = (gameID) =>
  `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${gameID}&format=json`;

export const STEAM_ALL_ACHIEVEMENTS_PLAYER = (gameID) =>
  `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${gameID}&key=${API_KEY}&steamid=${USER_ID}`;

export const HEADER_IMAGE = (gameId) => {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/header.jpg`;
};

export const API_GET_GAMES = "api/refresh";

export const STEAM_STORE_URL = (gameId) =>
  `https://store.steampowered.com/app/${gameId}`;
