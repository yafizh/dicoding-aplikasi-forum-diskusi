import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../utils/api';

const initialState = {
  items: [],
  status: 'idle',
};

export const asyncReceiveLeaderboards = createAsyncThunk(
    'leaderboards/receive',
    async (_, {rejectWithValue}) => {
      try {
        return await api.getLeaderboards();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(asyncReceiveLeaderboards.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(asyncReceiveLeaderboards.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(asyncReceiveLeaderboards.rejected, (state) => {
          state.status = 'failed';
        });
  },
});

export const selectLeaderboards = (state) => state.leaderboards.items;
export const selectLeaderboardsStatus = (state) => state.leaderboards.status;

export default leaderboardsSlice.reducer;
