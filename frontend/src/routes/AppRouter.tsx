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
import CreateAuction from '@/pages/CreateAuction';
import SellerProfile from '@/pages/SellerProfile';
import AuctionChat from '@/components/organisms/auction-chat';
import AuctionDetailsPage from '@/pages/AuctionDetails';
import Report from '@/pages/Report';
import ProfileSettings from '@/pages/ProfileSettings';
import { useNotificationRegistration } from '@/hooks/use-notification-registration';
import UserDeliveryPage from '@/pages/User_Delivery';
import SellerDeliveryPage from '@/pages/Seller_Delivery';
import AuctionsPage from '@/pages/ExploreAuctions';
import ManageAuctions from '@/pages/ManageAuctions';
import AdminManagementPage from '@/pages/AdminManagementPage';
import ComplaintDetail from '@/pages/ComplaintDetail';
import NotificationPreferencesPage from '@/pages/NotificationPreferencePage';
import NotificationsPage from '@/pages/NotificationPage';
// import WatchList from '@/pages/WatchList';
import UserProfile from '@/components/organisms/UserProfile';

export default function AppRouter() {
  useNotificationRegistration();

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes using DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/seller" element={<SellerProfile />} />
          <Route
            path="/auction-details/:auctionId"
            element={<AuctionDetailsPage />}
          />
          {/* <Route path="/create-auction" element={<CreateAuction />} /> */}
          <Route path="/auctions/new" element={<CreateAuction />} />
          <Route path="/auctions/edit/:id" element={<CreateAuction />} />

          <Route path="/explore-auctions" element={<AuctionsPage />} />
        </Route>

        {/* Routes using DashboardLayout */}

        <Route element={<DashboardLayout />}>
          <Route
            path="/manage-auctions"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER', 'ADMIN', 'SUPER_ADMIN']}
                redirectPath="/403"
              >
                <ManageAuctions />
              </ProtectedRoute>
            }
          />
          ;
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER', 'ADMIN', 'SUPER_ADMIN']}
                redirectPath="/403"
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications/"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER', 'ADMIN', 'SUPER_ADMIN']}
                redirectPath="/403"
              >
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications/preferences"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER', 'ADMIN', 'SUPER_ADMIN']}
                redirectPath="/403"
              >
                <NotificationPreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                allowedUsers={['ADMIN', 'SUPER_ADMIN', 'BIDDER', 'SELLER']}
                redirectPath="/403"
              >
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute
                allowedUsers={['SELLER', 'BIDDER', 'ADMIN', 'SUPER_ADMIN']}
                redirectPath="/403"
                ignorePendingForceRedirects={true}
              >
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-management"
            element={
              <ProtectedRoute
                allowedUsers={['SUPER_ADMIN']}
                redirectPath="/403"
                ignorePendingForceRedirects={true}
              >
                <AdminManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute allowedUsers={['ANY']} redirectPath="/403">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/reports" element={<Report />} />
          <Route path="/complaints" element={<Report />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          {/*           <Route path="/watchlist" element={<WatchList />} /> */}
        </Route>
        {/* Other Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-delivery" element={<UserDeliveryPage />} />
        <Route path="/seller-delivery" element={<SellerDeliveryPage />} />

        <Route path="/403" element={<h2>403 Unauthorized</h2>} />
        <Route path="/test-chat" element={<AuctionChat />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
