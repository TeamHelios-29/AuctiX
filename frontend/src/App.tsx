import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import Register from '@/pages/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { store } from './services/store';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER']}
                redirectPath="/login"
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/403" element={<h2>403 Unautherized</h2>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
