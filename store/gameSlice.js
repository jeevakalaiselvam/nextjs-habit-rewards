// store/exampleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";

// Async thunk to fetch data
export const fetchAllGames = createAsyncThunk(
  "games/fetchAllGames",
  async () => {
    const res = await fetch("/api/refresh");
    const data = await res.json();
    return data;
  }
);

export const refreshGameSingle = createAsyncThunk(
  "games/refreshGameSingle",
  async (gameId) => {
    const res = await fetch(`/api/refresh/${gameId}`);
    const data = await res.json();
    return { gameId, updatedGame: data?.data };
  }
);

const gamesSlice = createSlice({
  name: "habittracker",
  initialState: {
    games: [],
    loading: false,
    error: null,
    selectedGameId: "",
  },
  reducers: {
    resetGames: (state) => {
      state.games = [];
    },
    selectGame: (state, action) => {
      state.selectedGameId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGames.pending, (state) => {
        state.loading = true;
        state.games = [];
      })
      .addCase(fetchAllGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload?.data;
      })
      .addCase(fetchAllGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(refreshGameSingle.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshGameSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.games = state?.games?.map((game) => {
          if (game?.id == action.payload.gameId) {
            let updatedGame = action.payload.updatedGame;
            return updatedGame;
          } else {
            return game;
          }
        });
        message.info("Refresh Success !");
      })
      .addCase(refreshGameSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetGames, selectGame } = gamesSlice.actions;
export default gamesSlice.reducer;
