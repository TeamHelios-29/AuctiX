import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DefaultLayout from '../layout/defaultLayout';
import DashboardLayout from '../layout/dashboardLayout';
import Dashboard from '@/pages/Dashboard';
import WalletPage from '@/pages/Wallet';
import User from '@/pages/User';
import Register from '@/pages/Register';
import LoginPage from '@/pages/Login';
import Home from '@/pages/Home';
import CreateAuction from '@/pages/create-auction';
import SellerProfile from '@/pages/SellerProfile';
import AuctionChat from '@/components/organisms/auction-chat';
import AuctionDetailsPage from '@/pages/auction-details';
import Report from '@/pages/Report';
import Settings from '@/pages/Settings';
import { useNotificationRegistration } from '@/hooks/use-notification-registration';
import UserPage from '@/pages/User_Delivery';
import SellerPage from '@/pages/Seller_Delivery';
export default function AppRouter() {
  useNotificationRegistration();

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes using DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/seller" element={<SellerProfile />} />
          <Route path="/auction-details" element={<AuctionDetailsPage />} />
          <Route path="/create-auction" element={<CreateAuction />} />
        </Route>
        {/* Routes using DashboardLayout */}
        <Route element={<DashboardLayout />}>
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
          <Route
            path="/user"
            element={
              <ProtectedRoute
                allowedUsers={['ADMIN', 'SUPPER_ADMIN', 'BIDDER', 'SELLER']}
                redirectPath="/403"
              >
                <User />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Route>
        {/* Other Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-delivery" element={<UserPage />} />
        <Route path="/seller-delivery" element={<SellerPage />} />

        <Route path="/403" element={<h2>403 Unautherized</h2>} />
        <Route path="/test-chat" element={<AuctionChat />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
