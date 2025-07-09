import React, { useState, useEffect } from 'react';

interface Seller {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: {
    id: string;
  } | null;
}

interface Auction {
  id: string;
  title: string;
  category: string;
  seller: Seller;
  startingPrice: number;
  startTime: string;
  endTime: string;
  images: string[];
  isPublic: boolean;
  currentHighestBid?: {
    amount: number;
    bidder: any;
  };
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type FilterType = 'active' | 'expired' | 'upcoming';

// Update the AuctionTimer to properly handle upcoming auctions
const AuctionTimer: React.FC<{
  startTime: string;
  endTime: string;
}> = ({ startTime, endTime }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [status, setStatus] = useState<'upcoming' | 'active' | 'expired'>(
    'active',
  );

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const startDate = new Date(startTime).getTime();
      const endDate = new Date(endTime).getTime();

      if (now < startDate) {
        // Upcoming: time until start
        const difference = startDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
        setStatus('upcoming');
      } else if (now >= startDate && now < endDate) {
        // Active: time until end
        const difference = endDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
        setStatus('active');
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setStatus('expired');
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const { days, hours, minutes, seconds } = timeRemaining;

  // Simplify the timer text logic
  let bgColor, timerText;

  if (status === 'upcoming') {
    bgColor = 'bg-blue-400';
    timerText = `Starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (status === 'active') {
    bgColor = 'bg-yellow-400';
    timerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    bgColor = 'bg-red-500';
    timerText = 'Expired';
  }

  return (
    <div
      className={`absolute top-2 left-2 ${bgColor} text-xs font-medium py-1 px-2 rounded-md text-black`}
    >
      {timerText}
    </div>
  );
};

const AuctionCard: React.FC<{
  auction: Auction;
  onCardClick: (auctionId: string) => void;
}> = ({ auction, onCardClick }) => {
  // Fix the image URL construction
  const imageUrl =
    auction.images && auction.images.length > 0
      ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${auction.images[0]}`
      : '/api/placeholder/400/250';

  // Get seller avatar URL
  const getSellerAvatarUrl = () => {
    if (auction.seller.profilePicture && auction.seller.profilePicture.id) {
      return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${auction.seller.profilePicture.id}`;
    }
    return '/api/placeholder/24/24';
  };

  // Get seller display name
  const getSellerDisplayName = () => {
    if (auction.seller.firstName && auction.seller.lastName) {
      return `${auction.seller.firstName} ${auction.seller.lastName}`;
    }
    return auction.seller.username || 'Unknown Seller';
  };

  const getCurrentPrice = () => {
    const now = new Date();
    const startDate = new Date(auction.startTime);

    // For upcoming auctions, always show starting price
    if (now < startDate) {
      return auction.startingPrice;
    }

    // For active auctions, show highest bid if exists
    if (auction.currentHighestBid && auction.currentHighestBid.amount > 0) {
      return auction.currentHighestBid.amount;
    }

    return auction.startingPrice;
  };

  // Update the AuctionCard to properly show price labels
  const getPriceLabel = () => {
    const now = new Date();
    const startDate = new Date(auction.startTime);

    // For upcoming auctions, only show starting price
    if (now < startDate) {
      return 'Starting Price:';
    }

    // For active auctions, show current bid if exists
    if (auction.currentHighestBid && auction.currentHighestBid.amount > 0) {
      return 'Current Highest Bid:';
    }

    return 'Starting Price:';
  };

  return (
    <div
      className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onCardClick(auction.id)}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={auction.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/api/placeholder/400/250';
          }}
        />
        <AuctionTimer startTime={auction.startTime} endTime={auction.endTime} />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-1">
          {auction.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{auction.category}</p>

        <div className="flex items-center mb-3">
          <span className="text-xs text-gray-500 mr-2">By</span>
          <div className="flex items-center">
            <img
              src={getSellerAvatarUrl()}
              alt={getSellerDisplayName()}
              className="w-5 h-5 rounded-full mr-2"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/24/24';
              }}
            />
            <span className="text-xs text-purple-700 font-medium">
              {getSellerDisplayName()}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">{getPriceLabel()}</div>
          <div className="text-right font-semibold text-lg">
            LKR {getCurrentPrice().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Update FilterSidebar component
const FilterSidebar: React.FC<{
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="w-64 bg-white rounded-md shadow-sm border border-gray-200 p-4 h-fit">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="space-y-2">
        <button
          onClick={() => onFilterChange('active')}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            activeFilter === 'active'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active Auctions
        </button>

        {/* Add new upcoming filter */}
        <button
          onClick={() => onFilterChange('upcoming')}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            activeFilter === 'upcoming'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Upcoming Auctions
        </button>

        <button
          onClick={() => onFilterChange('expired')}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            activeFilter === 'expired'
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Expired Auctions
          <span className="text-xs text-gray-500 block">(Last 3 days)</span>
        </button>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        Next
      </button>
    </div>
  );
};

const AuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12, // Show 12 auctions per page
  });

  const fetchAuctions = async (filter: FilterType, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auctions/all?filter=${filter}&page=${page}&limit=${pagination.itemsPerPage}&sort=latest`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch auctions: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      if (data.auctions && Array.isArray(data.auctions)) {
        // If the API returns paginated data
        setAuctions(data.auctions);
        setPagination((prev) => ({
          ...prev,
          currentPage: data.currentPage || page,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || data.auctions.length,
        }));
      } else if (Array.isArray(data)) {
        // If the API returns a simple array (fallback for current API)
        // Implement client-side pagination
        const itemsPerPage = pagination.itemsPerPage;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Sort by latest first (assuming there's a createdAt or similar field)
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.startTime || a.createdAt || 0);
          const dateB = new Date(b.startTime || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });

        const paginatedData = sortedData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        setAuctions(paginatedData);
        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages,
          totalItems: data.length,
        }));
      } else {
        setAuctions([]);
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions(activeFilter, 1);
  }, [activeFilter]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    fetchAuctions(activeFilter, page);
  };

  const handleCardClick = (auctionId: string) => {
    window.location.href = `/auction-details/${auctionId}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading auctions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-gray-500">Explore</p>
        <h1 className="text-3xl font-bold">All Auctions</h1>
      </div>

      <div className="flex gap-6">
        <FilterSidebar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1">
          {auctions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                No {activeFilter} auctions found
              </div>
            </div>
          ) : (
            <>
              {/* Results summary */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing{' '}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
                  to{' '}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems,
                  )}{' '}
                  of {pagination.totalItems} {activeFilter} auctions
                </p>
              </div>

              {/* Auction grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionsPage;
