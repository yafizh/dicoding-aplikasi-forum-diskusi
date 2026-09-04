import {configureStore} from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import filterReducer from './filter/filterSlice';
import leaderboardsReducer from './leaderboards/leaderboardsSlice';
import loadingReducer from './ui/loadingSlice';
import threadDetailReducer from './threadDetail/threadDetailSlice';
import threadsReducer from './threads/threadsSlice';
import toastReducer from './ui/toastSlice';
import usersReducer from './users/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    filter: filterReducer,
    loading: loadingReducer,
    toast: toastReducer,
  },
});

export default store;
