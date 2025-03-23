import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;
