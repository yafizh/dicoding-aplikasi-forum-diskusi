/**
 * Skenario pengujian
 *
 * - stripHtml
 *   - harus menghapus tag HTML dan merapikan spasi berlebih
 *   - harus mengembalikan string kosong ketika argumen tidak diberikan
 * - truncate
 *   - harus mengembalikan teks apa adanya ketika masih di bawah batas
 *   - harus memotong teks pada batas kata dan menambahkan elipsis
 * - resolveUserVote
 *   - harus mengembalikan "neutral" ketika pengguna belum masuk
 *   - harus mengenali vote naik dan vote turun milik pengguna
 * - toggleVoteType
 *   - harus mengembalikan "neutral" ketika tombol yang sama ditekan ulang
 *   - harus mengembalikan tipe vote baru ketika tombol berbeda ditekan
 * - applyVote
 *   - harus memindahkan pengguna antar daftar vote tanpa duplikasi
 * - collectCategories
 *   - harus mengumpulkan kategori unik dan mengurutkannya secara alfabet
 * - sanitizeHtml
 *   - harus membuang tag berbahaya beserta atribut yang tidak diizinkan
 *   - harus menjaga tautan aman dan menambahkan atribut rel serta target
 */

import {describe, expect, it} from 'vitest';

import {
  applyVote,
  collectCategories,
  resolveUserVote,
  sanitizeHtml,
  stripHtml,
  toggleVoteType,
  truncate,
  VOTE_TYPE,
} from './index';

describe('stripHtml', () => {
  it('harus menghapus tag HTML dan merapikan spasi berlebih', () => {
    const html = '<p>Halo&nbsp;<strong>dunia</strong></p>   <p>React</p>';

    expect(stripHtml(html)).toBe('Halo dunia React error');
  });

  it('harus mengembalikan string kosong tanpa argumen', () => {
    expect(stripHtml()).toBe('');
  });
});

describe('truncate', () => {
  it('harus mengembalikan teks apa adanya ketika masih di bawah batas', () => {
    expect(truncate('Teks pendek', 20)).toBe('Teks pendek');
  });

  it('harus memotong teks pada batas kata dan menambahkan elipsis', () => {
    expect(truncate('satu dua tiga empat', 12)).toBe('satu dua…');
  });
});

describe('resolveUserVote', () => {
  const thread = {upVotesBy: ['user-1'], downVotesBy: ['user-2']};

  it('harus mengembalikan neutral ketika pengguna belum masuk', () => {
    expect(resolveUserVote(thread, null)).toBe(VOTE_TYPE.NEUTRAL);
  });

  it('harus mengenali vote naik dan vote turun milik pengguna', () => {
    expect(resolveUserVote(thread, 'user-1')).toBe(VOTE_TYPE.UP);
    expect(resolveUserVote(thread, 'user-2')).toBe(VOTE_TYPE.DOWN);
    expect(resolveUserVote(thread, 'user-3')).toBe(VOTE_TYPE.NEUTRAL);
  });
});

describe('toggleVoteType', () => {
  it('harus mengembalikan neutral ketika tombol sama ditekan ulang', () => {
    expect(toggleVoteType(VOTE_TYPE.UP, VOTE_TYPE.UP))
        .toBe(VOTE_TYPE.NEUTRAL);
  });

  it('harus mengembalikan tipe vote baru ketika tombol berbeda ditekan', () => {
    expect(toggleVoteType(VOTE_TYPE.UP, VOTE_TYPE.DOWN)).toBe(VOTE_TYPE.DOWN);
    expect(toggleVoteType(VOTE_TYPE.NEUTRAL, VOTE_TYPE.UP)).toBe(VOTE_TYPE.UP);
  });
});

describe('applyVote', () => {
  it('harus memindahkan pengguna antar daftar vote tanpa duplikasi', () => {
    const entity = {upVotesBy: ['user-1'], downVotesBy: []};

    applyVote(entity, 'user-1', VOTE_TYPE.DOWN);
    expect(entity).toEqual({upVotesBy: [], downVotesBy: ['user-1']});

    applyVote(entity, 'user-1', VOTE_TYPE.UP);
    expect(entity).toEqual({upVotesBy: ['user-1'], downVotesBy: []});

    applyVote(entity, 'user-1', VOTE_TYPE.NEUTRAL);
    expect(entity).toEqual({upVotesBy: [], downVotesBy: []});
  });
});

describe('collectCategories', () => {
  it('harus mengumpulkan kategori unik dan terurut', () => {
    const threads = [
      {category: 'redux'},
      {category: 'react'},
      {category: 'redux'},
      {category: ''},
      {category: null},
    ];

    expect(collectCategories(threads)).toEqual(['react', 'redux']);
  });
});

describe('sanitizeHtml', () => {
  it('harus membuang tag berbahaya beserta atribut terlarang', () => {
    const html =
      '<p onclick="alert(1)">Aman</p><script>alert(2)</script>';

    const result = sanitizeHtml(html);

    expect(result).toContain('<p>Aman</p>');
    expect(result).not.toContain('script');
    expect(result).not.toContain('onclick');
  });

  it('harus menjaga tautan aman dan menambahkan rel serta target', () => {
    const html = '<a href="https://dicoding.com" title="Dicoding">Tautan</a>';

    const result = sanitizeHtml(html);

    expect(result).toContain('href="https://dicoding.com"');
    expect(result).toContain('rel="noopener noreferrer nofollow"');
    expect(result).toContain('target="_blank"');
  });

  it('harus membuang tautan dengan skema yang tidak aman', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">Klik</a>');

    expect(result).not.toContain('javascript:');
    expect(result).toContain('Klik');
  });
});
