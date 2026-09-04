/**
 * Skenario pengujian
 *
 * - toastSlice reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus menambahkan notifikasi bertipe info ketika pushToast dipanggil
 *     tanpa tipe
 *   - harus menambahkan notifikasi sesuai tipe yang diberikan
 *   - harus menghapus notifikasi sesuai id ketika diberi action dismissToast
 *   - harus menambahkan notifikasi error ketika ada thunk yang ditolak
 *     dengan payload string
 *   - harus mengabaikan thunk yang ditolak tanpa payload string
 */

import {describe, expect, it} from 'vitest';

import toastReducer, {dismissToast, pushToast} from './toastSlice';

const rejectedWithValue = (payload) => ({
  type: 'threads/receive/rejected',
  payload,
  error: {message: 'Rejected'},
  meta: {
    arg: undefined,
    requestId: 'request-id',
    requestStatus: 'rejected',
    rejectedWithValue: true,
  },
});

describe('toastSlice reducer', () => {
  it('harus mengembalikan state awal ketika diberi action tidak dikenal',
      () => {
        const nextState = toastReducer(undefined, {type: 'UNKNOWN'});

        expect(nextState).toEqual({items: []});
      });

  it('harus menambahkan notifikasi info ketika pushToast tanpa tipe', () => {
    const nextState = toastReducer(
        {items: []},
        pushToast({message: 'Halo dunia'}),
    );

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toMatchObject({
      type: 'info',
      message: 'Halo dunia',
    });
    expect(nextState.items[0].id).toEqual(expect.any(String));
  });

  it('harus menambahkan notifikasi sesuai tipe yang diberikan', () => {
    const nextState = toastReducer(
        {items: []},
        pushToast({type: 'success', message: 'Thread berhasil dibuat.'}),
    );

    expect(nextState.items[0]).toMatchObject({
      type: 'success',
      message: 'Thread berhasil dibuat.',
    });
  });

  it('harus menghapus notifikasi sesuai id pada action dismissToast', () => {
    const state = {
      items: [
        {id: 'toast-1', type: 'info', message: 'pertama'},
        {id: 'toast-2', type: 'error', message: 'kedua'},
      ],
    };

    const nextState = toastReducer(state, dismissToast('toast-1'));

    expect(nextState.items).toEqual([
      {id: 'toast-2', type: 'error', message: 'kedua'},
    ]);
  });

  it('harus menambahkan notifikasi error ketika thunk ditolak dengan pesan',
      () => {
        const nextState = toastReducer(
            {items: []},
            rejectedWithValue('Gagal memuat thread.'),
        );

        expect(nextState.items).toHaveLength(1);
        expect(nextState.items[0]).toMatchObject({
          type: 'error',
          message: 'Gagal memuat thread.',
        });
      });

  it('harus mengabaikan thunk yang ditolak tanpa payload string', () => {
    const nextState = toastReducer({items: []}, rejectedWithValue(null));

    expect(nextState.items).toEqual([]);
  });
});
