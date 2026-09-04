import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, Route, Routes} from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import CreateThreadPage from './pages/CreateThreadPage';
import GuestRoute from './routes/GuestRoute';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoadingBar from './components/layout/LoadingBar';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import Spinner from './components/common/Spinner';
import ThreadDetailPage from './pages/ThreadDetailPage';
import Toaster from './components/layout/Toaster';
import {
  asyncPreloadAuth,
  selectIsPreloading,
} from './states/auth/authSlice';

const App = () => {
  const isPreloading = useSelector(selectIsPreloading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadAuth());
  }, [dispatch]);

  if (isPreloading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-brand-600">
        <Spinner className="h-7 w-7" label="Menyiapkan aplikasi…" />
      </div>
    );
  }

  return (
    <>
      <LoadingBar />
      <Toaster />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/threads/new" element={<ProtectedRoute />}>
            <Route index element={<CreateThreadPage />} />
          </Route>
          <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
