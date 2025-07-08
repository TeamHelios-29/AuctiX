import React, { useEffect } from 'react';
import AppRouter from '@/routes/AppRouter';
import {
  listenForForegroundMessages,
  registerSWAndRequestNotificationPermission,
} from './firebase/firebase';
import { restoreUser } from './store/slices/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchCurrentUser } from './store/slices/userSlice';
import { IAuthUser } from './types/IAuthUser';
import { ToastContainer } from 'react-toastify'; // ✅ Add this
import 'react-toastify/dist/ReactToastify.css'; // ✅ And this
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth: IAuthUser = useAppSelector((state) => state.auth as IAuthUser);

  useEffect(() => {
    dispatch(restoreUser()); // Get the user auth data from local storage and set it in the redux store
  }, []);

  useEffect(() => {
    dispatch(fetchCurrentUser()); // Fetch the current user data from the server and set it in the redux store
  }, [auth.isUserLoggedIn]);

  return (
    <>
      <AppRouter />
      <Toaster />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
