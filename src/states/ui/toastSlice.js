import {createSlice, isRejectedWithValue, nanoid} from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({type = 'info', message}) {
        return {payload: {id: nanoid(), type, message}};
      },
    },
    dismissToast(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isRejectedWithValue, (state, action) => {
      if (typeof action.payload !== 'string') return;
      state.items.push({
        id: nanoid(),
        type: 'error',
        message: action.payload,
      });
    });
  },
});

export const {pushToast, dismissToast} = toastSlice.actions;

export const selectToasts = (state) => state.toast.items;

export default toastSlice.reducer;
