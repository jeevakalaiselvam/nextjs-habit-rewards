import axios from "axios";
import * as TYPES from "../types/games.types";
import { API_GET_GAMES } from "../../helpers/urlHelper";

export const actionFetchAllGames = () => {
  return (dispatch) => {
    dispatch({ type: TYPES.FETCH_ALL_GAMES_REQUEST });
    return axios.get(API_GET_GAMES).then(
      (data) => {
        dispatch({
          type: TYPES.FETCH_ALL_GAMES_SUCCESS,
          payload: data.data.data,
        });
      },
      (error) => {
        dispatch({ type: TYPES.FETCH_ALL_GAMES_FAILURE, payload: error });
      }
    );
  };
};
