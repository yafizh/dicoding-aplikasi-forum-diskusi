import {asyncReceiveThreads} from '../threads/threadsSlice';
import {asyncReceiveUsers} from '../users/usersSlice';

export const asyncPopulateThreadsAndUsers = () => async (dispatch) => {
  await Promise.all([
    dispatch(asyncReceiveUsers()),
    dispatch(asyncReceiveThreads()),
  ]);
};
