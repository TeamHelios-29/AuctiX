import React from 'react';
import { Clock } from 'lucide-react';

// Define TypeScript interfaces
interface Auction {
  id: string;
  productName: string;
  category: string;
  seller: {
    name: string;
    avatar: string;
  };
  startingPrice: number;
  currency: string;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  imageUrl: string;
  isExpired: boolean;
}

// Sample data for testing
const sampleAuctions: Auction[] = [
  {
    id: '1',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 3,
      hours: 3,
      minutes: 34,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: false,
  },
  {
    id: '2',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 3,
      hours: 3,
      minutes: 34,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: false,
  },
  {
    id: '3',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 3,
      hours: 3,
      minutes: 34,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: false,
  },
  {
    id: '4',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 3,
      hours: 3,
      minutes: 34,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: false,
  },
  {
    id: '5',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 3,
      hours: 3,
      minutes: 34,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: false,
  },
  {
    id: '6',
    productName: 'Product Name',
    category: 'Category',
    seller: {
      name: 'John Doly',
      avatar: '/api/placeholder/24/24',
    },
    startingPrice: 5000,
    currency: 'LKR',
    timeRemaining: {
      days: 0,
      hours: 0,
      minutes: 4,
      seconds: 59,
    },
    imageUrl: '/api/placeholder/400/250',
    isExpired: true,
  },
];

// AuctionTimer component for displaying the countdown
const AuctionTimer: React.FC<{
  timeRemaining: Auction['timeRemaining'];
  isExpired: boolean;
}> = ({ timeRemaining, isExpired }) => {
  const { days, hours, minutes, seconds } = timeRemaining;

  const bgColor = isExpired ? 'bg-red-500' : 'bg-yellow-400';

  const timerText = isExpired
    ? `0d 0h ${minutes}m ${seconds}s`
    : `${days}d ${hours}h ${minutes}m ${seconds}s`;

  return (
    <div
      className={`absolute top-2 left-2 ${bgColor} text-xs font-medium py-1 px-2 rounded-md text-black`}
    >
      {timerText}
    </div>
  );
};

// AuctionCard component
const AuctionCard: React.FC<{ auction: Auction }> = ({ auction }) => {
  return (
    <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200">
      <div className="relative">
        <img
          src={auction.imageUrl}
          alt={auction.productName}
          className="w-full h-48 object-cover"
        />
        <AuctionTimer
          timeRemaining={auction.timeRemaining}
          isExpired={auction.isExpired}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{auction.productName}</h3>
        <p className="text-sm text-gray-500">{auction.category}</p>

        <div className="flex items-center mt-2">
          <span className="text-xs text-gray-500 mr-1">By</span>
          <div className="flex items-center">
            <img
              src={auction.seller.avatar}
              alt={auction.seller.name}
              className="w-5 h-5 rounded-full mr-1"
            />
            <span className="text-xs text-purple-700">
              {auction.seller.name}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">Starting Price:</div>
          <div className="text-right font-semibold">
            {auction.currency} {auction.startingPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Auctions Page component
const AuctionsPage: React.FC = () => {
  // Filter to only show active auctions by default
  const activeAuctions = sampleAuctions.filter((auction) => !auction.isExpired);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-gray-500">Explore</p>
        <h1 className="text-3xl font-bold">All Auctions</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default AuctionsPage;
