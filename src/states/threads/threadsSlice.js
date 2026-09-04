import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';

import api from '../../utils/api';
import {
  applyVote,
  collectCategories,
  resolveUserVote,
  stripHtml,
  VOTE_TYPE,
} from '../../utils';
import {pushToast} from '../ui/toastSlice';

const FALLBACK_OWNER = {
  id: null,
  name: 'Pengguna tidak dikenal',
  avatar: 'https://ui-avatars.com/api/?name=?&background=random',
};

const initialState = {
  items: [],
  status: 'idle',
  isCreating: false,
};

export const asyncReceiveThreads = createAsyncThunk(
    'threads/receive',
    async (_, {rejectWithValue}) => {
      try {
        return await api.getAllThreads();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

export const asyncCreateThread = createAsyncThunk(
    'threads/create',
    async ({title, body, category}, {dispatch, rejectWithValue}) => {
      try {
        const thread = await api.createThread({title, body, category});
        dispatch(pushToast({
          type: 'success',
          message: 'Thread berhasil dibuat.',
        }));
        return thread;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    voteApplied(state, action) {
      const {threadId, userId, voteType} = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread) applyVote(thread, userId, voteType);
    },
    voteReverted(state, action) {
      const {threadId, snapshot} = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread) Object.assign(thread, snapshot);
    },
    commentCounted(state, action) {
      const thread = state.items.find((item) => item.id === action.payload);
      if (thread) thread.totalComments += 1;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(asyncReceiveThreads.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(asyncReceiveThreads.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(asyncReceiveThreads.rejected, (state) => {
          state.status = 'failed';
        })
        .addCase(asyncCreateThread.pending, (state) => {
          state.isCreating = true;
        })
        .addCase(asyncCreateThread.fulfilled, (state, action) => {
          state.isCreating = false;
          state.items.unshift({...action.payload, totalComments: 0});
        })
        .addCase(asyncCreateThread.rejected, (state) => {
          state.isCreating = false;
        });
  },
});

export const {voteApplied, voteReverted, commentCounted} =
  threadsSlice.actions;

export const asyncVoteThread = ({threadId, voteType}) =>
  async (dispatch, getState) => {
    const {auth, threads} = getState();
    const userId = auth.user?.id;
    const thread = threads.items.find((item) => item.id === threadId);
    if (!userId || !thread) return;

    const snapshot = {
      upVotesBy: [...thread.upVotesBy],
      downVotesBy: [...thread.downVotesBy],
    };

    dispatch(voteApplied({threadId, userId, voteType}));

    try {
      await api.voteThread({threadId, voteType});
    } catch (error) {
      dispatch(voteReverted({threadId, snapshot}));
      dispatch(pushToast({type: 'error', message: error.message}));
    }
  };

const selectThreadItems = (state) => state.threads.items;
const selectUserItems = (state) => state.users.items;

export const selectThreadsStatus = (state) => state.threads.status;
export const selectIsCreatingThread = (state) => state.threads.isCreating;

const selectAuthUserForJoin = (state) => state.auth.user;

export const selectThreadsWithOwner = createSelector(
    [selectThreadItems, selectUserItems, selectAuthUserForJoin],
    (threads, users, authUser) => {
      const usersById = new Map(users.map((user) => [user.id, user]));
      if (authUser) usersById.set(authUser.id, authUser);

      return threads.map((thread) => ({
        ...thread,
        excerpt: stripHtml(thread.body),
        owner: usersById.get(thread.ownerId) ?? FALLBACK_OWNER,
      }));
    },
);

export const selectCategories = createSelector(
    [selectThreadItems],
    (threads) => collectCategories(threads),
);

export const selectVisibleThreads = createSelector(
    [
      selectThreadsWithOwner,
      (state) => state.filter.category,
      (state) => state.filter.keyword,
    ],
    (threads, category, keyword) => {
      const needle = keyword.trim().toLowerCase();
      return threads.filter((thread) => {
        const matchesCategory = !category || thread.category === category;
        const matchesKeyword = !needle ||
          thread.title.toLowerCase().includes(needle) ||
          thread.excerpt.toLowerCase().includes(needle);
        return matchesCategory && matchesKeyword;
      });
    },
);

export const makeSelectThreadVote = (threadId) => (state) => {
  const thread = state.threads.items.find((item) => item.id === threadId);
  if (!thread) return VOTE_TYPE.NEUTRAL;
  return resolveUserVote(thread, state.auth.user?.id ?? null);
};

export default threadsSlice.reducer;
