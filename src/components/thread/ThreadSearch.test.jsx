/**
 * Skenario pengujian
 *
 * - ThreadSearch component
 *   - harus menampilkan kotak pencarian beserta kata kunci yang tersimpan
 *     pada store
 *   - harus memperbarui kata kunci pada store ketika pengguna mengetik
 *   - harus mengosongkan kata kunci pada store ketika isian dihapus
 */

import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';

import ThreadSearch from './ThreadSearch';
import {renderWithProviders} from '../../tests/utils';

describe('ThreadSearch component', () => {
  it('harus menampilkan kata kunci yang tersimpan pada store', () => {
    renderWithProviders(<ThreadSearch />, {
      preloadedState: {filter: {category: null, keyword: 'redux'}},
    });

    expect(screen.getByRole('searchbox', {name: 'Cari thread'}))
        .toHaveValue('redux');
  });

  it('harus memperbarui kata kunci pada store ketika pengguna mengetik',
      async () => {
        const user = userEvent.setup();
        const {store} = renderWithProviders(<ThreadSearch />);

        await user.type(
            screen.getByRole('searchbox', {name: 'Cari thread'}),
            'react',
        );

        expect(store.getState().filter.keyword).toBe('react');
        expect(screen.getByRole('searchbox', {name: 'Cari thread'}))
            .toHaveValue('react');
      });

  it('harus mengosongkan kata kunci pada store ketika isian dihapus',
      async () => {
        const user = userEvent.setup();
        const {store} = renderWithProviders(<ThreadSearch />, {
          preloadedState: {filter: {category: null, keyword: 'redux'}},
        });

        await user.clear(screen.getByRole('searchbox', {name: 'Cari thread'}));

        expect(store.getState().filter.keyword).toBe('');
      });
});
