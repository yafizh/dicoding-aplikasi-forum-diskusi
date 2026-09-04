/**
 * Skenario pengujian
 *
 * - authSlice reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus menandai proses submit ketika asyncLoginUser pending
 *   - harus menyimpan token dan pengguna ketika asyncLoginUser fulfilled
 *   - harus mengosongkan sesi ketika asyncLoginUser rejected
 *   - harus menghentikan proses submit ketika asyncRegisterUser fulfilled
 *   - harus mengisi pengguna ketika asyncPreloadAuth fulfilled dengan data
 *   - harus mengosongkan sesi ketika asyncPreloadAuth fulfilled tanpa data
 *   - harus mengosongkan sesi dan menghapus token ketika diberi action logout
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';

import api from '../../utils/api';
import authReducer, {
  asyncLoginUser,
  asyncPreloadAuth,
  asyncRegisterUser,
  logout,
} from './authSlice';

const fakeUser = {
  id: 'user-1',
  name: 'Khairil',
  email: 'khairil@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Khairil',
};

const initialState = {
  token: null,
  user: null,
  isPreloading: true,
  isSubmitting: false,
};

describe('authSlice reducer', () => {
  beforeEach(() => {
    vi.spyOn(api, 'removeAccessToken').mockImplementation(() => {});
    vi.spyOn(api, 'getAccessToken').mockReturnValue('token-123');
  });

  it('harus mengembalikan state awal ketika diberi action tidak dikenal',
      () => {
        const nextState = authReducer(undefined, {type: 'UNKNOWN'});

        expect(nextState.user).toBeNull();
        expect(nextState.isPreloading).toBe(true);
        expect(nextState.isSubmitting).toBe(false);
        expect(Object.keys(nextState).sort())
            .toEqual(Object.keys(initialState).sort());
      });

  it('harus menandai proses submit ketika login sedang berjalan', () => {
    const nextState = authReducer(
        initialState,
        asyncLoginUser.pending('request-id', {
          email: fakeUser.email,
          password: 'rahasia',
        }),
    );

    expect(nextState.isSubmitting).toBe(true);
  });

  it('harus menyimpan token dan pengguna ketika login berhasil', () => {
    const nextState = authReducer(
        {...initialState, isSubmitting: true},
        asyncLoginUser.fulfilled(
            {token: 'token-123', user: fakeUser},
            'request-id',
            {email: fakeUser.email, password: 'rahasia'},
        ),
    );

    expect(nextState.isSubmitting).toBe(false);
    expect(nextState.token).toBe('token-123');
    expect(nextState.user).toEqual(fakeUser);
  });

  it('harus mengosongkan sesi ketika login gagal', () => {
    const nextState = authReducer(
        {...initialState, isSubmitting: true, token: 'token-123'},
        asyncLoginUser.rejected(
            new Error('Rejected'),
            'request-id',
            {email: fakeUser.email, password: 'salah'},
            'email or password is wrong',
        ),
    );

    expect(nextState.isSubmitting).toBe(false);
    expect(nextState.token).toBeNull();
    expect(nextState.user).toBeNull();
  });

  it('harus menghentikan proses submit ketika pendaftaran berhasil', () => {
    const nextState = authReducer(
        {...initialState, isSubmitting: true},
        asyncRegisterUser.fulfilled(fakeUser, 'request-id', {
          name: fakeUser.name,
          email: fakeUser.email,
          password: 'rahasia',
        }),
    );

    expect(nextState.isSubmitting).toBe(false);
    expect(nextState.user).toBeNull();
  });

  it('harus mengisi pengguna ketika preload menemukan sesi aktif', () => {
    const nextState = authReducer(
        initialState,
        asyncPreloadAuth.fulfilled(fakeUser, 'request-id'),
    );

    expect(nextState.isPreloading).toBe(false);
    expect(nextState.user).toEqual(fakeUser);
    expect(nextState.token).toBe('token-123');
  });

  it('harus mengosongkan sesi ketika preload tidak menemukan sesi', () => {
    const nextState = authReducer(
        initialState,
        asyncPreloadAuth.fulfilled(null, 'request-id'),
    );

    expect(nextState.isPreloading).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
  });

  it('harus mengosongkan sesi dan menghapus token ketika logout', () => {
    const nextState = authReducer(
        {...initialState, token: 'token-123', user: fakeUser},
        logout(),
    );

    expect(api.removeAccessToken).toHaveBeenCalledTimes(1);
    expect(nextState.token).toBeNull();
    expect(nextState.user).toBeNull();
  });
});
