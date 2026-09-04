import {useSelector} from 'react-redux';
import {Navigate, Outlet} from 'react-router-dom';

import {selectIsAuthenticated} from '../states/auth/authSlice';

const GuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;
