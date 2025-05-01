// store/exampleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data
export const fetchAllGames = createAsyncThunk(
  "games/fetchAllGames",
  async () => {
    const res = await fetch("/api/refresh");
    const data = await res.json();
    return data;
  }
);

export const fetchAllGamesForIds = createAsyncThunk(
  "games/fetchAllGamesForIds",
  async (gameIds, { rejectWithValue }) => {
    console.log("Calling for", gameIds);
    try {
      const res = await fetch("/api/steam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameIds }),
      });

      if (!res.ok) throw new Error("Failed to fetch games");

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const gamesSlice = createSlice({
  name: "habittracker",
  initialState: {
    games: [],
    loading: false,
    error: null,
    steamGames: [],
    steamError: null,
    steamLoading: false,
    selectedGameId: "",
    hiddenDescriptions: {},
    completionStatus: {},
  },
  reducers: {
    resetGames: (state) => {
      state.games = [];
    },
    selectGame: (state, action) => {
      state.selectedGameId = action.payload;
    },
    updateHidden: (state, action) => {
      state.hiddenDescriptions[action.payload.gameId] = action.payload.hidden;
    },
    updateGameProgress: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGamesForIds.pending, (state) => {
        state.loading = true;
        state.steamGames = [];
      })
      .addCase(fetchAllGamesForIds.fulfilled, (state, action) => {
        state.loading = false;
        state.steamGames = action.payload?.data;
      })
      .addCase(fetchAllGamesForIds.rejected, (state, action) => {
        state.steamLoading = false;
        state.steamError = action.error.message;
      });
  },
});

export const { resetGames, selectGame, updateHidden } = gamesSlice.actions;
export default gamesSlice.reducer;
