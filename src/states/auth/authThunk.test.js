/**
 * Skenario pengujian
 *
 * - asyncLoginUser thunk
 *   - harus mengirim action pending lalu fulfilled dan menyimpan token
 *     ketika proses login berhasil
 *   - harus mengirim action pending lalu rejected dengan pesan kesalahan
 *     serta menghapus token ketika proses login gagal
 * - asyncRegisterUser thunk
 *   - harus mengirim action fulfilled dengan data pengguna ketika
 *     pendaftaran berhasil
 *   - harus mengirim action rejected dengan pesan kesalahan ketika
 *     pendaftaran gagal
 * - asyncPreloadAuth thunk
 *   - harus mengembalikan payload null tanpa memanggil API ketika tidak ada
 *     token tersimpan
 *   - harus menghapus token ketika token tersimpan sudah tidak valid
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';

import api from '../../utils/api';
import {
  asyncLoginUser,
  asyncPreloadAuth,
  asyncRegisterUser,
} from './authSlice';

const fakeToken = 'token-123';

const fakeUser = {
  id: 'user-1',
  name: 'Khairil',
  email: 'khairil@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Khairil',
};

const credentials = {email: fakeUser.email, password: 'rahasia'};

const getState = () => ({});

describe('asyncLoginUser thunk', () => {
  beforeEach(() => {
    vi.spyOn(api, 'putAccessToken').mockImplementation(() => {});
    vi.spyOn(api, 'removeAccessToken').mockImplementation(() => {});
  });

  it('harus mengirim action yang benar ketika login berhasil', async () => {
    vi.spyOn(api, 'login').mockResolvedValue(fakeToken);
    vi.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);
    const dispatch = vi.fn();

    await asyncLoginUser(credentials)(dispatch, getState, undefined);

    expect(api.login).toHaveBeenCalledWith(credentials);
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncLoginUser.pending.type,
    }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncLoginUser.fulfilled.type,
      payload: {token: fakeToken, user: fakeUser},
    }));
  });

  it('harus mengirim action rejected ketika login gagal', async () => {
    vi.spyOn(api, 'login')
        .mockRejectedValue(new Error('email or password is wrong'));
    vi.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);
    const dispatch = vi.fn();

    await asyncLoginUser(credentials)(dispatch, getState, undefined);

    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(api.removeAccessToken).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncLoginUser.pending.type,
    }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncLoginUser.rejected.type,
      payload: 'email or password is wrong',
    }));
  });
});

describe('asyncRegisterUser thunk', () => {
  it('harus mengirim action fulfilled ketika pendaftaran berhasil',
      async () => {
        const payload = {...credentials, name: fakeUser.name};
        vi.spyOn(api, 'register').mockResolvedValue(fakeUser);
        const dispatch = vi.fn();

        await asyncRegisterUser(payload)(dispatch, getState, undefined);

        expect(api.register).toHaveBeenCalledWith(payload);
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: asyncRegisterUser.fulfilled.type,
          payload: fakeUser,
        }));
      });

  it('harus mengirim action rejected ketika pendaftaran gagal', async () => {
    const payload = {...credentials, name: fakeUser.name};
    vi.spyOn(api, 'register')
        .mockRejectedValue(new Error('email is already taken'));
    const dispatch = vi.fn();

    await asyncRegisterUser(payload)(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncRegisterUser.rejected.type,
      payload: 'email is already taken',
    }));
  });
});

describe('asyncPreloadAuth thunk', () => {
  it('harus mengembalikan null tanpa memanggil API ketika tidak ada token',
      async () => {
        vi.spyOn(api, 'getAccessToken').mockReturnValue(null);
        vi.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);
        const dispatch = vi.fn();

        await asyncPreloadAuth()(dispatch, getState, undefined);

        expect(api.getOwnProfile).not.toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: asyncPreloadAuth.fulfilled.type,
          payload: null,
        }));
      });

  it('harus menghapus token ketika token tersimpan tidak valid', async () => {
    vi.spyOn(api, 'getAccessToken').mockReturnValue('token-kedaluwarsa');
    vi.spyOn(api, 'getOwnProfile')
        .mockRejectedValue(new Error('token maksimal kadaluarsa'));
    vi.spyOn(api, 'removeAccessToken').mockImplementation(() => {});
    const dispatch = vi.fn();

    await asyncPreloadAuth()(dispatch, getState, undefined);

    expect(api.removeAccessToken).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: asyncPreloadAuth.rejected.type,
      payload: null,
    }));
  });
});
