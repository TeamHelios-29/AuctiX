import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { Filter } from 'lucide-react';
import AuctionCard from '../components/molecules/auctionCard';

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

// AuctionTimer hook and util for time remaining and auction status

export type AuctionStatus = 'upcoming' | 'active' | 'expired';

export function useAuctionTimer(
  startTime: string,
  endTime: string,
): [TimeRemaining, AuctionStatus] {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [status, setStatus] = useState<AuctionStatus>('active');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        const diff = start - now;
        setStatus('upcoming');
        setTimeRemaining({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else if (now < end) {
        const diff = end - now;
        setStatus('active');
        setTimeRemaining({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setStatus('expired');
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return [timeRemaining, status];
}

// Util to format the timer text output for display
export function getAuctionTimerText(
  time: TimeRemaining,
  status: AuctionStatus,
) {
  const { days, hours, minutes, seconds } = time;
  if (status === 'upcoming')
    return `Starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (status === 'active') return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return 'Expired';
}

// FilterContent component for filter options
const FilterContent: React.FC<{
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClose?: () => void;
}> = ({ activeFilter, onFilterChange, onClose }) => {
  const filters = [
    { key: 'active' as FilterType, label: 'Active Auctions' },
    { key: 'upcoming' as FilterType, label: 'Upcoming Auctions' },
    {
      key: 'expired' as FilterType,
      label: 'Expired Auctions',
      subtitle: '(Last 3 days)',
    },
  ];

  return (
    <div className="space-y-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => {
            onFilterChange(filter.key);
            onClose?.();
          }}
        >
          <div className="text-left">
            <div>{filter.label}</div>
            {filter.subtitle && (
              <div className="text-xs text-muted-foreground">
                {filter.subtitle}
              </div>
            )}
          </div>
        </Button>
      ))}
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
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

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
      <div className="min-h-screen mx-auto px-10 py-6 sm:py-8 sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 sm:h-12 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mx-auto px-10 py-6 sm:py-8 sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <Button
            onClick={() => fetchAuctions(activeFilter, 1)}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Create a separate component for auction card with timer
  const AuctionCardWithTimer: React.FC<{
    auction: Auction;
    onCardClick: (id: string) => void;
  }> = ({ auction, onCardClick }) => {
    const [timeRemaining, status] = useAuctionTimer(
      auction.startTime,
      auction.endTime,
    );
    const timerText = getAuctionTimerText(timeRemaining, status);

    // Correct image URL construction using the API endpoint
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

    return (
      <div className="cursor-pointer" onClick={() => onCardClick(auction.id)}>
        <AuctionCard
          imageUrl={imageUrl}
          productName={auction.title}
          category={auction.category}
          sellerName={
            auction.seller.firstName
              ? `${auction.seller.firstName} ${auction.seller.lastName}`
              : auction.seller.username
          }
          sellerAvatar={getSellerAvatarUrl()}
          startingPrice={auction.startingPrice.toLocaleString()}
          timeRemaining={timerText}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen mx-auto px-10 py-6 sm:py-8 sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Explore</p>
          <h1 className="text-xl sm:text-4xl font-semibold">All Auctions</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              <Badge variant="secondary" className="ml-1">
                {activeFilter}
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Filter Auctions</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No {activeFilter} auctions found
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}{' '}
              of {pagination.totalItems} {activeFilter} auctions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {auctions.map((auction) => (
              <AuctionCardWithTimer
                key={auction.id}
                auction={auction}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = pagination.currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > pagination.totalPages)
                    return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pageNum === pagination.currentPage
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => handlePageChange(pageNum)}
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  );
                },
              )}

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionsPage;
