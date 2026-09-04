/**
 * Skenario pengujian
 *
 * - CommentForm component
 *   - harus menampilkan tautan masuk ketika pengguna belum terautentikasi
 *   - harus menonaktifkan tombol kirim ketika komentar masih kosong
 *   - harus mengaktifkan tombol kirim ketika komentar sudah diisi
 *   - harus mengirim komentar yang sudah dipangkas spasinya lalu mengosongkan
 *     isian ketika permintaan berhasil
 *   - harus mempertahankan isian ketika permintaan gagal
 */

import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import CommentForm from './CommentForm';
import api from '../../utils/api';
import {renderWithProviders} from '../../tests/utils';

const authUser = {
  id: 'user-1',
  name: 'Khairil',
  email: 'khairil@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Khairil',
};

const authenticatedState = {
  auth: {
    token: 'token-123',
    user: authUser,
    isPreloading: false,
    isSubmitting: false,
  },
};

const fakeComment = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: authUser,
  upVotesBy: [],
  downVotesBy: [],
};

describe('CommentForm component', () => {
  it('harus menampilkan tautan masuk ketika pengguna belum terautentikasi',
      () => {
        renderWithProviders(<CommentForm threadId="thread-1" />);

        expect(screen.getByRole('link', {name: 'Masuk'}))
            .toHaveAttribute('href', '/login');
        expect(screen.queryByRole('textbox', {name: 'Isi komentar'}))
            .not.toBeInTheDocument();
      });

  it('harus menonaktifkan tombol kirim ketika komentar masih kosong', () => {
    renderWithProviders(<CommentForm threadId="thread-1" />, {
      preloadedState: authenticatedState,
    });

    expect(screen.getByRole('button', {name: 'Kirim komentar'}))
        .toBeDisabled();
  });

  it('harus mengaktifkan tombol kirim ketika komentar sudah diisi',
      async () => {
        const user = userEvent.setup();
        renderWithProviders(<CommentForm threadId="thread-1" />, {
          preloadedState: authenticatedState,
        });

        await user.type(
            screen.getByRole('textbox', {name: 'Isi komentar'}),
            'Komentar pertama',
        );

        expect(screen.getByRole('button', {name: 'Kirim komentar'}))
            .toBeEnabled();
      });

  it('harus mengirim komentar lalu mengosongkan isian ketika berhasil',
      async () => {
        vi.spyOn(api, 'createComment').mockResolvedValue(fakeComment);
        const user = userEvent.setup();
        const {store} = renderWithProviders(
            <CommentForm threadId="thread-1" />,
            {preloadedState: authenticatedState},
        );
        const textbox = screen.getByRole('textbox', {name: 'Isi komentar'});

        await user.type(textbox, '  Komentar pertama  ');
        await user.click(
            screen.getByRole('button', {name: 'Kirim komentar'}),
        );

        expect(api.createComment).toHaveBeenCalledWith({
          threadId: 'thread-1',
          content: 'Komentar pertama',
        });
        await waitFor(() => expect(textbox).toHaveValue(''));
        expect(store.getState().threadDetail.isCommenting).toBe(false);
      });

  it('harus mempertahankan isian ketika permintaan gagal', async () => {
    vi.spyOn(api, 'createComment')
        .mockRejectedValue(new Error('Gagal mengirim komentar.'));
    const user = userEvent.setup();
    const {store} = renderWithProviders(<CommentForm threadId="thread-1" />, {
      preloadedState: authenticatedState,
    });
    const textbox = screen.getByRole('textbox', {name: 'Isi komentar'});

    await user.type(textbox, 'Komentar pertama');
    await user.click(screen.getByRole('button', {name: 'Kirim komentar'}));

    await waitFor(() => {
      expect(store.getState().toast.items[0]).toMatchObject({
        type: 'error',
        message: 'Gagal mengirim komentar.',
      });
    });
    expect(textbox).toHaveValue('Komentar pertama');
  });
});
