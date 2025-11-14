import axios from "axios";
import * as TYPES from "../types/games.types";
import { API_GET_GAMES } from "../../helpers/urlHelper";

export const actionAddAchToKanban = (gameId, updatedKanbanObj) => {
  return {
    type: TYPES.ADD_GAME_ACH_TO_KANBAN,
    payload: { gameId, updatedKanbanObj },
  };
};
