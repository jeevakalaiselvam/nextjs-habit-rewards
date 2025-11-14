import * as TYPES from "../types/games.types";

const INITIAL_STATE = {
  games: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case TYPES.FETCH_ALL_GAMES_REQUEST:
      return {
        ...state,
        games: [],
      };
    case TYPES.FETCH_ALL_GAMES_SUCCESS:
      return {
        ...state,
        games: payload.sort(
          (game1, game2) => game2.completion - game1.completion
        ),
      };
    case TYPES.FETCH_ALL_GAMES_ERROR:
      return {
        ...state,
        games: [],
      };

    default:
      return state;
  }
};

export default reducer;
