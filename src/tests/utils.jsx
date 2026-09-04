import {configureStore} from '@reduxjs/toolkit';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';

import {reducer} from '../states/store';

export function createTestStore(preloadedState) {
  return configureStore({reducer, preloadedState});
}

export function renderWithProviders(ui, options = {}) {
  const {
    preloadedState,
    store = createTestStore(preloadedState),
    route = '/',
    ...renderOptions
  } = options;

  const Wrapper = ({children}) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
