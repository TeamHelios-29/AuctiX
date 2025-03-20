import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import Register from '@/pages/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Home from '@/pages/Home';
import { Provider } from 'react-redux';
import { store } from './services/store';
import Dashboard from './pages/Dashboard';
// import { AuthProvider } from './context/AuthContext';
import CreateBidPage from './pages/create-auction';
import WalletPage from './pages/Wallet';
import SellerProfile from './pages/SellerProfile';
import User from './pages/User';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-bid" element={<CreateBidPage />} />{' '}
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute
              //   allowedUsers={['SELLER', 'BIDDER']}
              //   redirectPath="/403"
              // >
              <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route path="/403" element={<h2>403 Unautherized</h2>} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/seller" element={<SellerProfile />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
