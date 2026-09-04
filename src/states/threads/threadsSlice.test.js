/**
 * Skenario pengujian
 *
 * - threadsSlice reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengubah status menjadi loading ketika asyncReceiveThreads pending
 *   - harus mengisi daftar thread ketika asyncReceiveThreads fulfilled
 *   - harus mengubah status menjadi failed ketika asyncReceiveThreads rejected
 *   - harus menambahkan thread baru di awal daftar ketika asyncCreateThread
 *     fulfilled
 *   - harus memindahkan pengguna ke upVotesBy ketika diberi action voteApplied
 *     bertipe up
 *   - harus memindahkan pengguna ke downVotesBy ketika diberi action
 *     voteApplied bertipe down
 *   - harus menghapus vote pengguna ketika voteApplied bertipe neutral
 *   - harus mengabaikan voteApplied ketika thread tidak ditemukan
 *   - harus mengembalikan vote ke kondisi sebelumnya ketika diberi action
 *     voteReverted
 *   - harus menambah jumlah komentar ketika diberi action commentCounted
 */

import {describe, expect, it} from 'vitest';

import threadsReducer, {
  asyncCreateThread,
  asyncReceiveThreads,
  commentCounted,
  voteApplied,
  voteReverted,
} from './threadsSlice';

const initialState = {items: [], status: 'idle', isCreating: false};

const threadOne = {
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

const threadTwo = {
  ...threadOne,
  id: 'thread-2',
  title: 'Thread kedua',
  category: 'redux',
};

describe('threadsSlice reducer', () => {
  it('harus mengembalikan state awal ketika diberi action tidak dikenal',
      () => {
        const nextState = threadsReducer(undefined, {type: 'UNKNOWN'});

        expect(nextState).toEqual(initialState);
      });

  it('harus mengubah status menjadi loading ketika thread sedang dimuat',
      () => {
        const nextState = threadsReducer(
            initialState,
            asyncReceiveThreads.pending('request-id'),
        );

        expect(nextState.status).toBe('loading');
      });

  it('harus mengisi daftar thread ketika permintaan berhasil', () => {
    const threads = [threadOne, threadTwo];

    const nextState = threadsReducer(
        {...initialState, status: 'loading'},
        asyncReceiveThreads.fulfilled(threads, 'request-id'),
    );

    expect(nextState.status).toBe('succeeded');
    expect(nextState.items).toEqual(threads);
  });

  it('harus mengubah status menjadi failed ketika permintaan gagal', () => {
    const nextState = threadsReducer(
        {...initialState, status: 'loading'},
        asyncReceiveThreads.rejected(
            new Error('Gagal'),
            'request-id',
            undefined,
            'Gagal memuat thread.',
        ),
    );

    expect(nextState.status).toBe('failed');
    expect(nextState.items).toEqual([]);
  });

  it('harus menambahkan thread baru di awal daftar', () => {
    const state = {...initialState, items: [threadTwo], isCreating: true};
    const created = {...threadOne, id: 'thread-3'};

    const nextState = threadsReducer(
        state,
        asyncCreateThread.fulfilled(created, 'request-id', {
          title: created.title,
          body: created.body,
          category: created.category,
        }),
    );

    expect(nextState.isCreating).toBe(false);
    expect(nextState.items).toHaveLength(2);
    expect(nextState.items[0]).toEqual({...created, totalComments: 0});
  });

  it('harus memindahkan pengguna ke upVotesBy ketika memberi vote up', () => {
    const state = {
      ...initialState,
      items: [{...threadOne, downVotesBy: ['user-2']}],
    };

    const nextState = threadsReducer(state, voteApplied({
      threadId: 'thread-1',
      userId: 'user-2',
      voteType: 'up',
    }));

    expect(nextState.items[0].upVotesBy).toEqual(['user-2']);
    expect(nextState.items[0].downVotesBy).toEqual([]);
  });

  it('harus memindahkan pengguna ke downVotesBy ketika memberi vote down',
      () => {
        const state = {
          ...initialState,
          items: [{...threadOne, upVotesBy: ['user-2']}],
        };

        const nextState = threadsReducer(state, voteApplied({
          threadId: 'thread-1',
          userId: 'user-2',
          voteType: 'down',
        }));

        expect(nextState.items[0].upVotesBy).toEqual([]);
        expect(nextState.items[0].downVotesBy).toEqual(['user-2']);
      });

  it('harus menghapus vote pengguna ketika vote bertipe neutral', () => {
    const state = {
      ...initialState,
      items: [{...threadOne, upVotesBy: ['user-2', 'user-3']}],
    };

    const nextState = threadsReducer(state, voteApplied({
      threadId: 'thread-1',
      userId: 'user-2',
      voteType: 'neutral',
    }));

    expect(nextState.items[0].upVotesBy).toEqual(['user-3']);
    expect(nextState.items[0].downVotesBy).toEqual([]);
  });

  it('harus mengabaikan vote ketika thread tidak ditemukan', () => {
    const state = {...initialState, items: [threadOne]};

    const nextState = threadsReducer(state, voteApplied({
      threadId: 'thread-tidak-ada',
      userId: 'user-2',
      voteType: 'up',
    }));

    expect(nextState.items).toEqual([threadOne]);
  });

  it('harus mengembalikan vote ke kondisi sebelumnya', () => {
    const state = {
      ...initialState,
      items: [{...threadOne, upVotesBy: ['user-2']}],
    };

    const nextState = threadsReducer(state, voteReverted({
      threadId: 'thread-1',
      snapshot: {upVotesBy: [], downVotesBy: ['user-9']},
    }));

    expect(nextState.items[0].upVotesBy).toEqual([]);
    expect(nextState.items[0].downVotesBy).toEqual(['user-9']);
  });

  it('harus menambah jumlah komentar thread terkait', () => {
    const state = {
      ...initialState,
      items: [{...threadOne, totalComments: 2}, threadTwo],
    };

    const nextState = threadsReducer(state, commentCounted('thread-1'));

    expect(nextState.items[0].totalComments).toBe(3);
    expect(nextState.items[1].totalComments).toBe(0);
  });
});
