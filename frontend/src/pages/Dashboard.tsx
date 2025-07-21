import React from 'react';
import { useAppSelector } from '@/hooks/hooks';
import BidderDashboard from '@/components/organisms/BidderDashboard';
import SellerDashboard from '@/components/organisms/SellerDashboard';

export default function Dashboard() {
  const userData = useAppSelector((state) => state.user);

  // Redirect based on user role
  if (userData?.role === 'BIDDER') {
    return <BidderDashboard />;
  } else if (userData?.role === 'SELLER') {
    return <SellerDashboard />;
  }

  // Default fallback or loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  );
}
