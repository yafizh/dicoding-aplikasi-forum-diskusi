import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  pendingCount: 0,
};

const isPending = (action) => action.type.endsWith('/pending');
const isSettled = (action) =>
  action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected');

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addMatcher(isPending, (state) => {
          state.pendingCount += 1;
        })
        .addMatcher(isSettled, (state) => {
          state.pendingCount = Math.max(0, state.pendingCount - 1);
        });
  },
});

export const selectIsLoading = (state) => state.loading.pendingCount > 0;

export default loadingSlice.reducer;
