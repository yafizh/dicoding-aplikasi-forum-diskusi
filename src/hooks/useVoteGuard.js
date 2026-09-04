import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';

import {selectIsAuthenticated} from '../states/auth/authSlice';
import {pushToast} from '../states/ui/toastSlice';

export default function useVoteGuard(handler) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback((voteType) => {
    if (!isAuthenticated) {
      dispatch(pushToast({
        type: 'info',
        message: 'Masuk terlebih dahulu untuk memberikan vote.',
      }));
      navigate('/login', {state: {from: location.pathname}});
      return;
    }
    handler(voteType);
  }, [isAuthenticated, dispatch, navigate, location.pathname, handler]);
}
