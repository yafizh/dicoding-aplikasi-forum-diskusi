/**
 * Skenario pengujian
 *
 * - filterSlice reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengubah kategori ketika diberi action setCategory
 *   - harus menghapus kategori ketika setCategory diberi payload null
 *   - harus mengubah kata kunci ketika diberi action setKeyword
 *   - harus mengosongkan kategori dan kata kunci ketika diberi action
 *     clearFilter
 */

import {describe, expect, it} from 'vitest';

import filterReducer, {
  clearFilter,
  setCategory,
  setKeyword,
} from './filterSlice';

describe('filterSlice reducer', () => {
  const initialState = {category: null, keyword: ''};

  it('harus mengembalikan state awal ketika diberi action tidak dikenal',
      () => {
        const nextState = filterReducer(undefined, {type: 'UNKNOWN'});

        expect(nextState).toEqual(initialState);
      });

  it('harus mengubah kategori ketika diberi action setCategory', () => {
    const nextState = filterReducer(initialState, setCategory('react'));

    expect(nextState).toEqual({category: 'react', keyword: ''});
  });

  it('harus menghapus kategori ketika setCategory diberi payload null', () => {
    const state = {category: 'react', keyword: ''};

    const nextState = filterReducer(state, setCategory(null));

    expect(nextState).toEqual({category: null, keyword: ''});
  });

  it('harus mengubah kata kunci ketika diberi action setKeyword', () => {
    const nextState = filterReducer(initialState, setKeyword('redux'));

    expect(nextState).toEqual({category: null, keyword: 'redux'});
  });

  it('harus mengosongkan filter ketika diberi action clearFilter', () => {
    const state = {category: 'react', keyword: 'redux'};

    const nextState = filterReducer(state, clearFilter());

    expect(nextState).toEqual(initialState);
  });
});
