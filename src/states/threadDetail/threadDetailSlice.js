import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../utils/api';
import {applyVote, resolveUserVote, VOTE_TYPE} from '../../utils';
import {pushToast} from '../ui/toastSlice';
import {
  commentCounted,
  voteApplied as threadVoteApplied,
  voteReverted as threadVoteReverted,
} from '../threads/threadsSlice';

const initialState = {
  detail: null,
  status: 'idle',
  isCommenting: false,
};

export const asyncReceiveThreadDetail = createAsyncThunk(
    'threadDetail/receive',
    async (threadId, {rejectWithValue}) => {
      try {
        return await api.getThreadDetail(threadId);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

export const asyncCreateComment = createAsyncThunk(
    'threadDetail/createComment',
    async ({threadId, content}, {dispatch, rejectWithValue}) => {
      try {
        const comment = await api.createComment({threadId, content});
        dispatch(commentCounted(threadId));
        return comment;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
      state.status = 'idle';
    },
    threadVoteApplied(state, action) {
      const {userId, voteType} = action.payload;
      if (state.detail) applyVote(state.detail, userId, voteType);
    },
    threadVoteReverted(state, action) {
      if (state.detail) Object.assign(state.detail, action.payload);
    },
    commentVoteApplied(state, action) {
      const {commentId, userId, voteType} = action.payload;
      const comment = state.detail?.comments
          .find((item) => item.id === commentId);
      if (comment) applyVote(comment, userId, voteType);
    },
    commentVoteReverted(state, action) {
      const {commentId, snapshot} = action.payload;
      const comment = state.detail?.comments
          .find((item) => item.id === commentId);
      if (comment) Object.assign(comment, snapshot);
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(asyncReceiveThreadDetail.pending, (state) => {
          state.status = 'loading';
          state.detail = null;
        })
        .addCase(asyncReceiveThreadDetail.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.detail = action.payload;
        })
        .addCase(asyncReceiveThreadDetail.rejected, (state) => {
          state.status = 'failed';
          state.detail = null;
        })
        .addCase(asyncCreateComment.pending, (state) => {
          state.isCommenting = true;
        })
        .addCase(asyncCreateComment.fulfilled, (state, action) => {
          state.isCommenting = false;
          state.detail?.comments.unshift(action.payload);
        })
        .addCase(asyncCreateComment.rejected, (state) => {
          state.isCommenting = false;
        });
  },
});

export const {
  clearDetail,
  threadVoteApplied: detailVoteApplied,
  threadVoteReverted: detailVoteReverted,
  commentVoteApplied,
  commentVoteReverted,
} = threadDetailSlice.actions;

export const asyncVoteThreadDetail = ({voteType}) =>
  async (dispatch, getState) => {
    const {auth, threadDetail} = getState();
    const userId = auth.user?.id;
    const detail = threadDetail.detail;
    if (!userId || !detail) return;

    const threadId = detail.id;
    const snapshot = {
      upVotesBy: [...detail.upVotesBy],
      downVotesBy: [...detail.downVotesBy],
    };

    dispatch(detailVoteApplied({userId, voteType}));
    dispatch(threadVoteApplied({threadId, userId, voteType}));

    try {
      await api.voteThread({threadId, voteType});
    } catch (error) {
      dispatch(detailVoteReverted(snapshot));
      dispatch(threadVoteReverted({threadId, snapshot}));
      dispatch(pushToast({type: 'error', message: error.message}));
    }
  };

export const asyncVoteComment = ({commentId, voteType}) =>
  async (dispatch, getState) => {
    const {auth, threadDetail} = getState();
    const userId = auth.user?.id;
    const detail = threadDetail.detail;
    const comment = detail?.comments.find((item) => item.id === commentId);
    if (!userId || !comment) return;

    const snapshot = {
      upVotesBy: [...comment.upVotesBy],
      downVotesBy: [...comment.downVotesBy],
    };

    dispatch(commentVoteApplied({commentId, userId, voteType}));

    try {
      await api.voteComment({threadId: detail.id, commentId, voteType});
    } catch (error) {
      dispatch(commentVoteReverted({commentId, snapshot}));
      dispatch(pushToast({type: 'error', message: error.message}));
    }
  };

export const selectThreadDetail = (state) => state.threadDetail.detail;
export const selectThreadDetailStatus = (state) => state.threadDetail.status;
export const selectIsCommenting = (state) => state.threadDetail.isCommenting;

export const selectDetailVote = (state) => {
  const detail = state.threadDetail.detail;
  if (!detail) return VOTE_TYPE.NEUTRAL;
  return resolveUserVote(detail, state.auth.user?.id ?? null);
};

export const makeSelectCommentVote = (commentId) => (state) => {
  const comment = state.threadDetail.detail?.comments
      .find((item) => item.id === commentId);
  if (!comment) return VOTE_TYPE.NEUTRAL;
  return resolveUserVote(comment, state.auth.user?.id ?? null);
};

export default threadDetailSlice.reducer;
