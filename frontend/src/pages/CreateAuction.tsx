import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuctionForm from '@/components/organisms/CreateAuctionForm';
import { useNavigate } from 'react-router-dom';

const CreateAuction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-3xl p-8 shadow-xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center space-x"
        >
          <span className="text-xl font-bold text-gray-700">&larr;</span>{' '}
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold mb-2">Create new Auction Listing</h1>
        <p className="text-gray-600 mb-6">
          Fill out the form below to start your auction.
        </p>
        <AuctionForm />
      </Card>
    </div>
  );
};

export default CreateAuction;
