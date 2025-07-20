import { Button } from '../ui/button';
import React, { useState } from 'react';
import SellerReport from './SellerReport';

interface SellerHeaderProps {
  sellerId?: string;
  sellerName?: string;
  sellerAvatar?: string;
  backgroundPhoto?: string;
}

export default function SellerHeader({
  sellerId,
  sellerName = 'Unknown Seller',
  sellerAvatar,
  backgroundPhoto,
}: SellerHeaderProps) {
  const [reportOpen, setReportOpen] = useState(false);

  const handleReportSubmit = (
    sellerId: string,
    reason: string,
    complaint: string,
  ) => {
    // Handle report submission (e.g., API call)
    // ...your logic here...
  };

  // Helper function to get seller avatar URL
  const getSellerAvatarUrl = () => {
    if (sellerAvatar) {
      return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${sellerAvatar}`;
    }
    return 'defaultProfilePhoto.jpg';
  };

  // Helper function to get background photo URL
  const getBackgroundPhotoUrl = () => {
    if (backgroundPhoto) {
      return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${backgroundPhoto}`;
    }
    return null;
  };

  const backgroundUrl = getBackgroundPhotoUrl();

  return (
    <div className="bg-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-lg border">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={getSellerAvatarUrl()}
          alt="Seller"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
        />
        <div>
          <h2 className="text-base sm:text-xl font-semibold flex items-center">
            {sellerName}
          </h2>
        </div>
      </div>
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => setReportOpen(true)}
      >
        Report Seller
      </Button>
      <SellerReport
        sellerId={sellerId || 'unknown'}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
