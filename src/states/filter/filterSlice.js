import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  category: null,
  keyword: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    clearFilter(state) {
      state.category = null;
      state.keyword = '';
    },
  },
});

export const {setCategory, setKeyword, clearFilter} = filterSlice.actions;

export const selectCategoryFilter = (state) => state.filter.category;
export const selectKeywordFilter = (state) => state.filter.keyword;

export default filterSlice.reducer;
