import React, { useEffect } from 'react';
import AppRouter from '@/routes/AppRouter';
import { restoreUser } from './store/slices/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchCurrentUser } from './store/slices/userSlice';
import { IAuthUser } from './types/IAuthUser';
import {
  fetchLatestNotifications,
  fetchUnreadCount,
} from './store/slices/notificationSlice';
import { Toaster } from './components/ui/toaster';
import { fetchPendingRequiredActions } from './store/slices/requiredActionsSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);

  useEffect(() => {
    const fetchNotifications = () => {
      dispatch(fetchLatestNotifications());
      dispatch(fetchUnreadCount());
    };

    dispatch(restoreUser());
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchPendingRequiredActions());
  }, [auth.isUserLoggedIn]);

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
};

export default App;
