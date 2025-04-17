import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AppRouter from '@/routes/AppRouter';
import { store } from '@/store/store';
import {
  listenForForegroundMessages,
  registerSWAndRequestNotificationPermission,
} from './firebase/firebase';

const App: React.FC = () => {
  useEffect(() => {
    registerSWAndRequestNotificationPermission();
    listenForForegroundMessages(); // todo check if we are going to use ws instead for foreground msgs
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;
