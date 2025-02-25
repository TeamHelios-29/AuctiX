import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/Login';
import CreateBidPage from './pages/create-bid';
import Home from './pages/Home';
import Register from './pages/Register';
import WalletPage from './pages/Wallet';
import SellerProfile from './pages/SellerProfile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-bid" element={<CreateBidPage />} />{' '}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedUsers={['SELLER']} redirectPath="/login">
                {' '}
                <Dashboard />{' '}
              </ProtectedRoute>
            }
          />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/seller" element={<SellerProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const Dashboard: React.FC = () => <h2>Dashboard</h2>;

export default App;
