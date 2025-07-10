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

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);

  useEffect(() => {
    const fetchNotifications = () => {
      dispatch(fetchLatestNotifications());
      dispatch(fetchUnreadCount());
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch(restoreUser()); // Get the user auth data from local storage and set it in the redux store
  }, []);

  useEffect(() => {
    dispatch(fetchCurrentUser()); // Fetch the current user data from the server and set it in the redux store
  }, [auth.isUserLoggedIn]);

  return <AppRouter />;
};

export default App;
