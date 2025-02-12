import React from 'react';
import { Card } from '@/components/ui/card';
import BidForm from '@/components/bid-form';

const CreateBid: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Create new Auction Listing</h1>
        <p className="text-gray-600 mb-6">Start an auction now</p>
        <BidForm />
      </Card>
    </div>
  );
};

export default CreateBid;
