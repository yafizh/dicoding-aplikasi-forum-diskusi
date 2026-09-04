/**
 * Skenario pengujian
 *
 * - asyncReceiveThreads thunk
 *   - harus mengirim action pending lalu fulfilled dengan daftar thread
 *     ketika permintaan berhasil
 *   - harus mengirim action rejected dengan pesan kesalahan ketika
 *     permintaan gagal
 * - asyncCreateThread thunk
 *   - harus mengirim notifikasi sukses dan action fulfilled ketika thread
 *     berhasil dibuat
 *   - harus mengirim action rejected tanpa notifikasi sukses ketika thread
 *     gagal dibuat
 * - asyncVoteThread thunk
 *   - harus menerapkan vote secara optimistis ke store ketika permintaan
 *     berhasil
 *   - harus mengembalikan vote ke kondisi awal dan menampilkan notifikasi
 *     kesalahan ketika permintaan gagal
 *   - harus mengabaikan vote ketika pengguna belum masuk
 */

import {describe, expect, it, vi} from 'vitest';

import api from '../../utils/api';
import {createTestStore} from '../../tests/utils';
import {
  asyncCreateThread,
  asyncReceiveThreads,
  asyncVoteThread,
} from './threadsSlice';
import {pushToast} from '../ui/toastSlice';

const fakeThread = {
  id: 'thread-1',
  title: 'Thread pertama',
  body: '<p>Isi thread pertama</p>',
  category: 'react',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const fakeUser = {
  id: 'user-1',
  name: 'Khairil',
  email: 'khairil@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Khairil',
};

const getState = () => ({});

describe('asyncReceiveThreads thunk', () => {
  it('harus mengirim action yang benar ketika permintaan berhasil',
      async () => {
        vi.spyOn(api, 'getAllThreads').mockResolvedValue([fakeThread]);
        const dispatch = vi.fn();

        await asyncReceiveThreads()(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: asyncReceiveThreads.pending.type,
        }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: asyncReceiveThreads.fulfilled.type,
          payload: [fakeThread],
        }));
      });

  it('harus mengirim action rejected ketika permintaan gagal', async () => {
    vi.spyOn(api, 'getAllThreads')
        .mockRejectedValue(new Error('Gagal memuat thread.'));
    const dispatch = vi.fn();

    await asyncReceiveThreads()(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncReceiveThreads.rejected.type,
      payload: 'Gagal memuat thread.',
    }));
  });
});

describe('asyncCreateThread thunk', () => {
  const payload = {
    title: fakeThread.title,
    body: fakeThread.body,
    category: fakeThread.category,
  };

  it('harus mengirim notifikasi sukses ketika thread berhasil dibuat',
      async () => {
        vi.spyOn(api, 'createThread').mockResolvedValue(fakeThread);
        const dispatch = vi.fn();

        await asyncCreateThread(payload)(dispatch, getState, undefined);

        expect(api.createThread).toHaveBeenCalledWith(payload);
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: pushToast.type,
          payload: expect.objectContaining({
            type: 'success',
            message: 'Thread berhasil dibuat.',
          }),
        }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: asyncCreateThread.fulfilled.type,
          payload: fakeThread,
        }));
      });

  it('harus mengirim action rejected ketika thread gagal dibuat', async () => {
    vi.spyOn(api, 'createThread')
        .mockRejectedValue(new Error('"title" is not allowed to be empty'));
    const dispatch = vi.fn();

    await asyncCreateThread(payload)(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncCreateThread.rejected.type,
      payload: '"title" is not allowed to be empty',
    }));
  });
});

describe('asyncVoteThread thunk', () => {
  const createStoreWithThread = () => createTestStore({
    auth: {
      token: 'token-123',
      user: fakeUser,
      isPreloading: false,
      isSubmitting: false,
    },
    threads: {items: [fakeThread], status: 'succeeded', isCreating: false},
  });

  it('harus menerapkan vote secara optimistis ketika permintaan berhasil',
      async () => {
        vi.spyOn(api, 'voteThread').mockResolvedValue({
          id: 'vote-1',
          userId: fakeUser.id,
          threadId: fakeThread.id,
          voteType: 1,
        });
        const store = createStoreWithThread();

        await store.dispatch(asyncVoteThread({
          threadId: fakeThread.id,
          voteType: 'up',
        }));

        expect(api.voteThread).toHaveBeenCalledWith({
          threadId: fakeThread.id,
          voteType: 'up',
        });
        expect(store.getState().threads.items[0].upVotesBy)
            .toEqual([fakeUser.id]);
      });

  it('harus mengembalikan vote ketika permintaan gagal', async () => {
    vi.spyOn(api, 'voteThread')
        .mockRejectedValue(new Error('Gagal memberi vote.'));
    const store = createStoreWithThread();

    await store.dispatch(asyncVoteThread({
      threadId: fakeThread.id,
      voteType: 'up',
    }));

    const state = store.getState();
    expect(state.threads.items[0].upVotesBy).toEqual([]);
    expect(state.threads.items[0].downVotesBy).toEqual([]);
    expect(state.toast.items[0]).toMatchObject({
      type: 'error',
      message: 'Gagal memberi vote.',
    });
  });

  it('harus mengabaikan vote ketika pengguna belum masuk', async () => {
    vi.spyOn(api, 'voteThread').mockResolvedValue({});
    const store = createTestStore({
      threads: {items: [fakeThread], status: 'succeeded', isCreating: false},
    });

    await store.dispatch(asyncVoteThread({
      threadId: fakeThread.id,
      voteType: 'up',
    }));

    expect(api.voteThread).not.toHaveBeenCalled();
    expect(store.getState().threads.items[0].upVotesBy).toEqual([]);
  });
});
