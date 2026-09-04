/**
 * Skenario pengujian
 *
 * - VoteGroup component
 *   - harus menampilkan jumlah vote naik dan vote turun sesuai props
 *   - harus memanggil onVote dengan "up" ketika tombol suka ditekan dan
 *     pengguna belum memberi vote
 *   - harus memanggil onVote dengan "neutral" ketika tombol suka ditekan
 *     sedangkan pengguna sudah menyukai
 *   - harus memanggil onVote dengan "down" ketika tombol tidak suka ditekan
 *   - harus menandai tombol aktif melalui aria-pressed sesuai vote pengguna
 */

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import VoteGroup from './VoteGroup';
import {VOTE_TYPE} from '../../utils';

const setup = (props = {}) => {
  const onVote = vi.fn();
  render(
      <VoteGroup
        upVotesBy={['user-1', 'user-2']}
        downVotesBy={['user-3']}
        userVote={VOTE_TYPE.NEUTRAL}
        onVote={onVote}
        {...props}
      />,
  );
  return {onVote, user: userEvent.setup()};
};

describe('VoteGroup component', () => {
  it('harus menampilkan jumlah vote naik dan turun sesuai props', () => {
    setup();

    expect(screen.getByRole('button', {name: 'Suka'})).toHaveTextContent('2');
    expect(screen.getByRole('button', {name: 'Tidak suka'}))
        .toHaveTextContent('1');
  });

  it('harus memanggil onVote dengan "up" ketika pengguna menekan suka',
      async () => {
        const {onVote, user} = setup();

        await user.click(screen.getByRole('button', {name: 'Suka'}));

        expect(onVote).toHaveBeenCalledTimes(1);
        expect(onVote).toHaveBeenCalledWith(VOTE_TYPE.UP);
      });

  it('harus memanggil onVote dengan "neutral" ketika suka dibatalkan',
      async () => {
        const {onVote, user} = setup({userVote: VOTE_TYPE.UP});

        await user.click(screen.getByRole('button', {name: 'Batalkan suka'}));

        expect(onVote).toHaveBeenCalledWith(VOTE_TYPE.NEUTRAL);
      });

  it('harus memanggil onVote dengan "down" ketika tombol tidak suka ditekan',
      async () => {
        const {onVote, user} = setup();

        await user.click(screen.getByRole('button', {name: 'Tidak suka'}));

        expect(onVote).toHaveBeenCalledWith(VOTE_TYPE.DOWN);
      });

  it('harus menandai tombol aktif sesuai vote pengguna', () => {
    setup({userVote: VOTE_TYPE.DOWN});

    expect(screen.getByRole('button', {name: 'Suka'}))
        .toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', {name: 'Batalkan tidak suka'}))
        .toHaveAttribute('aria-pressed', 'true');
  });
});
