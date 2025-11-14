// redux/store.js
import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Action Types
const MOVE_ACHIEVEMENT = "MOVE_ACHIEVEMENT";

// Actions
export const moveAchievement = (gameId, achName, fromLane, toLane) => ({
  type: MOVE_ACHIEVEMENT,
  payload: { gameId, achName, fromLane, toLane },
});

// Initial State
const initialState = {
  kanbanObj: {}, // { [gameId]: { MISSABLE: [], EASY: [], ... } }
};

// Reducer
const kanbanReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOVE_ACHIEVEMENT: {
      const { gameId, achName, fromLane, toLane } = action.payload;
      const kanbanObj = { ...state.kanbanObj };
      if (!kanbanObj[gameId]) kanbanObj[gameId] = {};
      const gameKanban = { ...kanbanObj[gameId] };

      // Remove from old lane
      if (fromLane && gameKanban[fromLane]) {
        gameKanban[fromLane] = gameKanban[fromLane].filter(
          (a) => a !== achName
        );
      }

      // Add to new lane
      if (!gameKanban[toLane]) gameKanban[toLane] = [];
      if (!gameKanban[toLane].includes(achName))
        gameKanban[toLane].push(achName);

      kanbanObj[gameId] = gameKanban;
      return { ...state, kanbanObj };
    }

    default:
      return state;
  }
};

// Persist Config
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({ kanban: kanbanReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
