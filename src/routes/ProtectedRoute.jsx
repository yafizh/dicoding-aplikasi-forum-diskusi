import {useSelector} from 'react-redux';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

import {selectIsAuthenticated} from '../states/auth/authSlice';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{from: location.pathname}} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
