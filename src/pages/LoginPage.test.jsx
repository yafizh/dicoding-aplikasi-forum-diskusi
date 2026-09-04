/**
 * Skenario pengujian
 *
 * - LoginPage component
 *   - harus menampilkan isian email, kata sandi, tombol masuk, dan tautan
 *     pendaftaran
 *   - harus memperbarui isian email dan kata sandi ketika pengguna mengetik
 *   - harus mengirim email dan kata sandi ke API lalu menyimpan sesi ketika
 *     proses login berhasil
 *   - harus menampilkan notifikasi kesalahan dan tidak menyimpan sesi ketika
 *     proses login gagal
 *   - harus menonaktifkan tombol masuk selama proses login berjalan
 */

import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import LoginPage from './LoginPage';
import api from '../utils/api';
import {renderWithProviders} from '../tests/utils';

const fakeUser = {
  id: 'user-1',
  name: 'Khairil',
  email: 'khairil@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Khairil',
};

describe('LoginPage component', () => {
  it('harus menampilkan seluruh elemen formulir login', () => {
    renderWithProviders(<LoginPage />, {route: '/login'});

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /masuk/i})).toBeEnabled();
    expect(screen.getByRole('link', {name: 'Daftar sekarang'}))
        .toHaveAttribute('href', '/register');
  });

  it('harus memperbarui isian ketika pengguna mengetik', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, {route: '/login'});

    await user.type(screen.getByLabelText('Email'), fakeUser.email);
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia');

    expect(screen.getByLabelText('Email')).toHaveValue(fakeUser.email);
    expect(screen.getByLabelText('Kata sandi')).toHaveValue('rahasia');
  });

  it('harus menyimpan sesi ketika proses login berhasil', async () => {
    vi.spyOn(api, 'login').mockResolvedValue('token-123');
    vi.spyOn(api, 'getOwnProfile').mockResolvedValue(fakeUser);
    const user = userEvent.setup();
    const {store} = renderWithProviders(<LoginPage />, {route: '/login'});

    await user.type(screen.getByLabelText('Email'), fakeUser.email);
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia');
    await user.click(screen.getByRole('button', {name: /masuk/i}));

    expect(api.login).toHaveBeenCalledWith({
      email: fakeUser.email,
      password: 'rahasia',
    });
    await waitFor(() => {
      expect(store.getState().auth.user).toEqual(fakeUser);
    });
    expect(store.getState().auth.token).toBe('token-123');
  });

  it('harus menampilkan notifikasi kesalahan ketika login gagal', async () => {
    vi.spyOn(api, 'login')
        .mockRejectedValue(new Error('email or password is wrong'));
    vi.spyOn(api, 'removeAccessToken').mockImplementation(() => {});
    const user = userEvent.setup();
    const {store} = renderWithProviders(<LoginPage />, {route: '/login'});

    await user.type(screen.getByLabelText('Email'), fakeUser.email);
    await user.type(screen.getByLabelText('Kata sandi'), 'salah');
    await user.click(screen.getByRole('button', {name: /masuk/i}));

    await waitFor(() => {
      expect(store.getState().toast.items[0]).toMatchObject({
        type: 'error',
        message: 'email or password is wrong',
      });
    });
    expect(store.getState().auth.user).toBeNull();
  });

  it('harus menonaktifkan tombol masuk selama proses login berjalan', () => {
    renderWithProviders(<LoginPage />, {
      route: '/login',
      preloadedState: {
        auth: {
          token: null,
          user: null,
          isPreloading: false,
          isSubmitting: true,
        },
      },
    });

    expect(screen.getByRole('button', {name: /masuk/i})).toBeDisabled();
  });
});
