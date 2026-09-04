import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../utils/api';

const initialState = {
  items: [],
  status: 'idle',
};

export const asyncReceiveUsers = createAsyncThunk(
    'users/receive',
    async (_, {rejectWithValue}) => {
      try {
        return await api.getAllUsers();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(asyncReceiveUsers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(asyncReceiveUsers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(asyncReceiveUsers.rejected, (state) => {
          state.status = 'failed';
        });
  },
});

export const selectUsers = (state) => state.users.items;

export default usersSlice.reducer;
