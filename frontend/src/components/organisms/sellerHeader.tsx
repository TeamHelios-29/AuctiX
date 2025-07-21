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
  sellerName,
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

  // Helper function to get seller avatar URL - using user profile endpoint
  const getSellerAvatarUrl = () => {
    if (sellerAvatar) {
      return `${import.meta.env.VITE_API_URL}/user/getUserProfilePhoto?file_uuid=${sellerAvatar}`;
    }
    return '/defaultProfilePhoto.jpg';
  };

  // Helper function to get background photo URL
  const getBackgroundPhotoUrl = () => {
    if (backgroundPhoto) {
      return `${import.meta.env.VITE_API_URL}/user/getUserProfilePhoto?file_uuid=${backgroundPhoto}`;
    }
    return '/defaultBanner.jpg';
  };

  const backgroundUrl = getBackgroundPhotoUrl();

  console.log('Background photo ID:', backgroundPhoto);
  console.log('Background URL:', backgroundUrl);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

  return (
    <div
      className="relative overflow-hidden rounded-lg border"
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${backgroundUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '220px',
            }
          : {
              backgroundColor: '#f3f4f6',
              minHeight: '220px',
            }
      }
    >
      <div className="flex flex-col sm:flex-row items-end gap-4 h-full p-6">
        <div className="flex items-end gap-4">
          <img
            src={getSellerAvatarUrl()}
            alt="Seller"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg -mb-10"
            onError={(e) => {
              e.currentTarget.src = '/defaultProfilePhoto.jpg';
            }}
            style={{ background: '#fff' }}
          />
          <div className="flex flex-col justify-end pb-2">
            <h2 className="text-2xl font-semibold text-gray-900 drop-shadow-lg">
              {sellerName}
            </h2>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setReportOpen(true)}
          >
            Report Seller
          </Button>
        </div>
      </div>
      <SellerReport
        sellerId={sellerId || 'unknown'}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
