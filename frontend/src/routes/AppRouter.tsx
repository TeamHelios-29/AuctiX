import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import WalletPage from '@/pages/Wallet';
import User from '@/pages/User';
import Register from '@/pages/Register';
import LoginPage from '@/pages/Login';
import Home from '@/pages/Home';
import CreateAuction from '@/pages/create-auction';
import SellerProfile from '@/pages/SellerProfile';
import AuctionChat from '@/components/organisms/auction-chat';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-bid" element={<CreateAuction />} />{' '}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedUsers={['SELLER', 'BIDDER']}
              redirectPath="/403"
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/403" element={<h2>403 Unautherized</h2>} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/seller" element={<SellerProfile />} />
        <Route path="/test-chat" element={<AuctionChat />} />
        <Route path="/user" element={<User />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
