import { Button } from '../ui/button';
import React, { useState } from 'react';
import SellerReport from './SellerReport';

export default function SellerHeader() {
  const [reportOpen, setReportOpen] = useState(false);

  // Dummy sellerId for demonstration
  const sellerId = 'seller-123';

  const handleReportSubmit = (
    sellerId: string,
    reason: string,
    complaint: string,
  ) => {
    // Handle report submission (e.g., API call)
    // ...your logic here...
  };

  return (
    <div className="bg-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-lg border">
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src="exampleAvatar.png"
          alt="Seller"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border"
        />
        <div>
          <h2 className="text-base sm:text-xl font-semibold flex items-center">
            Sam Perera
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
        sellerId={sellerId}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
