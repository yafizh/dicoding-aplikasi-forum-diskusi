import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {SkeletonTheme} from 'react-loading-skeleton';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import App from './App.jsx';
import store from './states/store';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
            <App />
          </SkeletonTheme>
        </BrowserRouter>
      </Provider>
    </StrictMode>,
);
