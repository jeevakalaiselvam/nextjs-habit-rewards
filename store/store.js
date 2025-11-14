import { createStore, combineReducers, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ----- REDUCERS -----
const initialUserState = { name: "", isLoggedIn: false };

function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, name: action.payload, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, name: "", isLoggedIn: false };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
});

// ---- Persist config ----
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ---- Safe DevTools enhancer ----
const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

// ---- Store ----
export const store = createStore(persistedReducer, composeEnhancers());

export const persistor = persistStore(store);
