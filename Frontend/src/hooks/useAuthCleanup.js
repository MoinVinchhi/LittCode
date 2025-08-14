import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

export const useAuthCleanup = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (isPublicRoute) {
      // Clear any existing auth state on public routes
      // This prevents showing success messages from previous actions
      // We'll dispatch a clear action to reset the state
      dispatch({ type: 'auth/clearMessages' });
    }
  }, [location.pathname, dispatch]);
};
