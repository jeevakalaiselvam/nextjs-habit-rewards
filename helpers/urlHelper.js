export const API_KEY = 'C8EA26279ED696B33DE86183F1CF4764';

let DARTHLOGAN = '76561198749212985';

export let USER_ID = DARTHLOGAN;

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

export const API_GET_GAMES = 'api/refresh';

export const STEAM_STORE_URL = (gameId) =>
  `https://store.steampowered.com/app/${gameId}`;
