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

const gamesSlice = createSlice({
  name: "habittracker",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetGames: (state) => {
      state.games = [];
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
      });
  },
});

export const { resetGames } = gamesSlice.actions;
export default gamesSlice.reducer;
