import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../utils/api';

const initialState = {
  token: api.getAccessToken(),
  user: null,
  isPreloading: true,
  isSubmitting: false,
};

export const asyncRegisterUser = createAsyncThunk(
    'auth/register',
    async ({name, email, password}, {rejectWithValue}) => {
      try {
        return await api.register({name, email, password});
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

export const asyncLoginUser = createAsyncThunk(
    'auth/login',
    async ({email, password}, {rejectWithValue}) => {
      try {
        const token = await api.login({email, password});
        api.putAccessToken(token);
        const user = await api.getOwnProfile();
        return {token, user};
      } catch (error) {
        api.removeAccessToken();
        return rejectWithValue(error.message);
      }
    },
);

export const asyncPreloadAuth = createAsyncThunk(
    'auth/preload',
    async (_, {rejectWithValue}) => {
      if (!api.getAccessToken()) return null;
      try {
        return await api.getOwnProfile();
      } catch {
        api.removeAccessToken();
        return rejectWithValue(null);
      }
    },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      api.removeAccessToken();
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(asyncLoginUser.pending, (state) => {
          state.isSubmitting = true;
        })
        .addCase(asyncLoginUser.fulfilled, (state, action) => {
          state.isSubmitting = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(asyncLoginUser.rejected, (state) => {
          state.isSubmitting = false;
          state.token = null;
          state.user = null;
        })
        .addCase(asyncRegisterUser.pending, (state) => {
          state.isSubmitting = true;
        })
        .addCase(asyncRegisterUser.fulfilled, (state) => {
          state.isSubmitting = false;
        })
        .addCase(asyncRegisterUser.rejected, (state) => {
          state.isSubmitting = false;
        })
        .addCase(asyncPreloadAuth.pending, (state) => {
          state.isPreloading = true;
        })
        .addCase(asyncPreloadAuth.fulfilled, (state, action) => {
          state.isPreloading = false;
          state.user = action.payload;
          state.token = action.payload ? api.getAccessToken() : null;
        })
        .addCase(asyncPreloadAuth.rejected, (state) => {
          state.isPreloading = false;
          state.user = null;
          state.token = null;
        });
  },
});

export const {logout} = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsPreloading = (state) => state.auth.isPreloading;
export const selectIsAuthSubmitting = (state) => state.auth.isSubmitting;

export default authSlice.reducer;
