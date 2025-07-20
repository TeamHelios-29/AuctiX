import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share, Flag, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import AxiosRequest from '@/services/axiosInspector';
import { useToast } from '@/hooks/use-toast';
import AuctionReport from '@/components/organisms/AuctionReport';
import { title } from 'process';
import AuctionChat from '@/components/organisms/auction-chat';
import AddToWatchlistButton from '@/components/molecules/AddToWatchlistButton';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuctionWebSocket } from '@/hooks/useAuctionWebSocket';

// Import the timer utilities from your auction page or create them here
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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
  const [serverOffset, setServerOffset] = useState<number>(0);
  const [isOffsetReady, setIsOffsetReady] = useState<boolean>(false);

  // Fetch server time offset once on mount
  useEffect(() => {
    const fetchServerOffset = async () => {
      try {
        // TEMPORARILY SKIP SERVER TIME SYNC FOR TESTING
        setServerOffset(0);
        setIsOffsetReady(true);
        console.log('Using client time for testing');

        /* UNCOMMENT THIS WHEN TESTING SERVER TIME SYNC
      const clientTime = Date.now();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auctions/server-time`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch server time');
      }

      const data = await response.json();
      const serverTime = data.timestamp;
      const offset = serverTime - clientTime;

      setServerOffset(offset);
      setIsOffsetReady(true);

      console.log('Server time synced:', {
        offset: offset,
        serverTime: new Date(serverTime).toISOString(),
        clientTime: new Date(clientTime).toISOString(),
        offsetMinutes: Math.round(offset / 1000 / 60),
      });
      */
      } catch (error) {
        console.error('Failed to sync server time, using client time:', error);
        setServerOffset(0);
        setIsOffsetReady(true);
      }
    };

    fetchServerOffset();
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      // Don't calculate until we have server offset (or failed to get it)
      if (!isOffsetReady) return;

      // Get current time with server offset
      const now = Date.now() + serverOffset;

      let start: number;
      let end: number;

      try {
        start = new Date(startTime).getTime();
        end = new Date(endTime).getTime();

        if (isNaN(start) || isNaN(end)) {
          console.error('Invalid date format:', { startTime, endTime });
          setStatus('active');
          return;
        }

        if (end <= start) {
          console.error('End time must be after start time:', {
            startTime,
            endTime,
          });
          setStatus('expired');
          return;
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        setStatus('active');
        return;
      }

      // Add small buffer to prevent flickering during transitions
      const BUFFER_MS = 2000; // 2 second buffer

      // Determine status with buffer zones
      if (now < start - BUFFER_MS) {
        // Auction hasn't started yet
        const diff = start - now;
        setStatus('upcoming');
        setTimeRemaining(calculateTimeComponents(diff));
      } else if (now > end + BUFFER_MS) {
        // Auction has ended
        setStatus('expired');
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        // Auction is active (includes buffer zones around start/end)
        const diff = end - now;
        setStatus('active');
        setTimeRemaining(
          diff > 0
            ? calculateTimeComponents(diff)
            : { days: 0, hours: 0, minutes: 0, seconds: 0 },
        );
      }
    };

    const calculateTimeComponents = (milliseconds: number): TimeRemaining => {
      if (milliseconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((milliseconds % (1000 * 60)) / 1000),
      };
    };

    if (startTime && endTime && isOffsetReady) {
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, endTime, serverOffset, isOffsetReady]);

  return [timeRemaining, status];
}

// Keep your existing getAuctionTimerText function unchanged
export function getAuctionTimerText(
  time: TimeRemaining,
  status: AuctionStatus,
) {
  const { days, hours, minutes, seconds } = time;

  if (status === 'expired') {
    return 'Expired';
  }

  const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return timeString;
}

interface BidHistory {
  bidder: {
    id: string;
    name: string;
    avatar: string;
  };
  amount: number;
  timestamp: string;
}

interface ProductDetails {
  id: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentBid: number;
  bidIncrement: number;
  currentBidder: {
    id: string;
    name: string;
    avatar: string;
  };
  seller: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  endTime: string;
  startTime: string;
  bidHistory: BidHistory[];
}

function calculateBidIncrement(
  startingPrice: number,
  currentBid: number,
): number {
  const base = Math.max(startingPrice, currentBid || startingPrice);
  const increment = base * 0.05;
  return Math.ceil(increment / 100) * 100;
}

const AuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const axiosInstance = AxiosRequest().axiosInstance;
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use the auction timer hook
  const [timeRemaining, auctionStatus] = useAuctionTimer(
    product?.startTime || '',
    product?.endTime || '',
  );
  const timerText = getAuctionTimerText(timeRemaining, auctionStatus);

  function transformBidData(backendData: any) {
    const getAvatarUrl = (profilePicture: { id: any } | null | undefined) => {
      if (profilePicture?.id) {
        return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${profilePicture.id}`;
      }
      return '/defaultProfilePhoto.jpg';
    };

    const transformUser = (user: {
      username: any;
      firstName: any;
      lastName: any;
      profilePicture?: { id: any } | null;
    }) => ({
      id: user.username,
      name: `${user.firstName} ${user.lastName}`,
      avatar: getAvatarUrl(user?.profilePicture),
    });

    return {
      id: backendData.id,
      category: backendData.category,
      title: backendData.title,
      description: backendData.description,
      images: backendData.images || [],
      startingPrice: backendData.startingPrice || 5000,
      currentBid: backendData.currentHighestBid?.amount || 0,
      bidIncrement: calculateBidIncrement(
        backendData.startingPrice,
        backendData.currentHighestBid?.amount || 0,
      ),
      currentBidder: backendData.currentHighestBid?.bidder
        ? transformUser(backendData.currentHighestBid.bidder)
        : {
            id: '',
            name: 'No bidder yet',
            avatar: '/defaultProfilePhoto.jpg',
          },
      seller: {
        ...backendData.seller,
        profilePicture: getAvatarUrl(backendData.seller.profilePicture),
      },
      endTime: backendData.endTime,
      startTime: backendData.startTime,
      bidHistory: backendData.bidHistory.map((bid: any) => ({
        bidder: transformUser(bid.bidder),
        amount: bid.amount,
        timestamp: bid.bidTime,
      })),
    };
  }

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/auctions/${auctionId}`);
        const transformedData = transformBidData(response.data);
        setProduct(transformedData);
        // --- MODIFICATION HERE ---
        const initialBidSuggestion =
          transformedData.currentBid > 0
            ? transformedData.currentBid + transformedData.bidIncrement
            : transformedData.startingPrice; // If no current bid, start from startingPrice

        setBidAmount(initialBidSuggestion);
        // --- END MODIFICATION ---
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setError('Failed to load auction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchAuctionDetails();
    }
  }, [auctionId]);

  // FIXED WebSocket callback with proper error handling
  const handleBidUpdate = useCallback(
    (payload: any) => {
      try {
        if (!payload || !payload.newBid) {
          console.warn('Invalid WebSocket payload received:', payload);
          return;
        }

        const newBid = payload.newBid;
        const updatedHistory = payload.bidHistory || [];

        if (!product) {
          console.warn('Product not loaded yet, skipping WebSocket update');
          return;
        }

        const updatedProduct = { ...product };
        updatedProduct.currentBid = newBid.amount || 0;

        if (newBid.bidder) {
          updatedProduct.currentBidder = {
            id: newBid.bidder.username || '',
            name: `${newBid.bidder.firstName || 'Unknown'} ${newBid.bidder.lastName || 'User'}`,
            avatar: newBid.bidder.profilePicture?.id
              ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${newBid.bidder.profilePicture.id}`
              : '/defaultProfilePhoto.jpg',
          };
        } else {
          updatedProduct.currentBidder = {
            id: '',
            name: 'Anonymous Bidder',
            avatar: '/defaultProfilePhoto.jpg',
          };
        }

        updatedProduct.bidHistory = updatedHistory.map((bid: any) => ({
          bidder: {
            id: bid.bidder?.username || '',
            name: `${bid.bidder?.firstName || 'Unknown'} ${bid.bidder?.lastName || 'User'}`,
            avatar: bid.bidder?.profilePicture?.id
              ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${bid.bidder.profilePicture.id}`
              : '/defaultProfilePhoto.jpg',
          },
          amount: bid.amount || 0,
          timestamp: bid.bidTime || new Date().toISOString(),
        }));

        updatedProduct.bidIncrement = calculateBidIncrement(
          updatedProduct.startingPrice,
          updatedProduct.currentBid,
        );

        setProduct(updatedProduct);
        setBidAmount(updatedProduct.currentBid + updatedProduct.bidIncrement);
      } catch (error) {
        console.error('Error processing WebSocket update:', error);
      }
    },
    [product],
  ); // only include 'product', no need for bidAmount

  // Attach the memoized function
  useAuctionWebSocket(auctionId!, handleBidUpdate);

  useEffect(() => {
    if (product) {
      console.log('Auction dates received:', {
        startTime: product.startTime,
        endTime: product.endTime,
        startTimeParsed: new Date(product.startTime).toString(),
        endTimeParsed: new Date(product.endTime).toString(),
        now: new Date().toString(),
      });
    }
  }, [product]);

  const handleIncrementBid = () => {
    if (!product) return;
    setBidAmount(bidAmount + product.bidIncrement);
  };

  const handleDecrementBid = () => {
    if (!product) return;

    const minAllowedBid =
      Math.max(product.startingPrice, product.currentBid) +
      product.bidIncrement;

    // Ensure the bid doesn't go below the minimum allowed bid
    if (bidAmount - product.bidIncrement >= minAllowedBid) {
      setBidAmount(bidAmount - product.bidIncrement);
    } else {
      setBidAmount(minAllowedBid);
    }
  };

  const handlePlaceBid = async () => {
    if (!product || !auctionId) return;

    try {
      await axiosInstance.post(`/bids/place`, {
        auctionId: auctionId,
        amount: bidAmount.toString(),
      });

      toast({
        title: 'Bid Placed!',
        description: `Your bid of LKR ${bidAmount.toLocaleString()} was placed successfully.`,
        variant: 'success',
      });
    } catch (err: any) {
      console.error('Error placing bid:', err);
      const errorResponse =
        err?.response?.data?.message ||
        'Failed to place bid. Please try again.';

      setError(errorResponse);

      toast({
        title: 'Bid Failed',
        description: errorResponse,
        variant: 'destructive',
      });

      setTimeout(() => setError(null), 5000);
    }
  };

  const [reportOpen, setReportOpen] = useState(false);
  const handleReportSubmit = async (
    itemId: string,
    reason: string,
    complaint: string,
  ) => {
    await axiosInstance.post(`/complaints`, {
      targetType: 'AUCTION',
      targetId: itemId,
      reason: reason,
      description: complaint,
    });
    toast({
      title: 'Report Submitted',
      description: `Your report for "${product?.title}" has been submitted.`,
      variant: 'success',
    });
  };

  // Function to get the appropriate label based on auction status
  const getTimerLabel = (status: AuctionStatus) => {
    switch (status) {
      case 'upcoming':
        return 'Starts in';
      case 'active':
        return 'Closes in';
      case 'expired':
        return 'Ended';
      default:
        return 'Closes in';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p>Loading auction details...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p>Auction not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="text-3xl font-semibold">{product.title}</h1>
          </div>

          <div className="mb-6">
            {product.images && product.images.length > 0 && (
              <>
                <div className="mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${product.images[selectedImageIndex]}`}
                    alt={`Product image ${selectedImageIndex + 1}`}
                    className="w-full max-h-[500px] object-contain rounded-xl border"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((imgId, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${imgId}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`h-20 w-20 object-cover cursor-pointer border rounded-lg ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="pb-4 border-b-4 border-yellow-400">
            <br></br>
            <p className="text-2xl">
              <span className="text-gray-400">
                {getTimerLabel(auctionStatus)}{' '}
              </span>
              <span className="">
                {timerText === '0d 0h 0m 0s' && auctionStatus !== 'expired'
                  ? 'Loading...'
                  : timerText}
              </span>
            </p>
            {/* Enhanced debug info - remove after testing */}
            {/* <p className="text-xs text-gray-500">Status: {auctionStatus}</p> */}
          </div>

          <div className="bg-gray-100 p-4 rounded-md mt-4">
            <p className="text-sm text-gray-700 ">Current Highest Bid</p>
            <p className="text-4xl font-bold mb-2">
              LKR {product.currentBid?.toLocaleString()}
            </p>
            <div className="flex items-center text-sm">
              <p>By</p>
              <img
                src={
                  product.currentBidder?.avatar !== 'NULL'
                    ? product.currentBidder?.avatar
                    : '/defaultProfilePhoto.jpg'
                }
                alt={product.currentBidder?.name}
                className="w-6 h-6 rounded-full ml-2 mr-1"
              />
              <p>{product.currentBidder?.name}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">
              Starting Price: LKR {product.startingPrice?.toLocaleString()}
            </p>

            {auctionStatus === 'active' ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecrementBid}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncrementBid}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={handlePlaceBid}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  Place Bid - LKR {bidAmount.toLocaleString()}
                </Button>
              </>
            ) : auctionStatus === 'upcoming' ? (
              <Button
                className="w-full bg-yellow-200 text-gray-600 cursor-not-allowed"
                disabled
              >
                Auction not started
              </Button>
            ) : (
              <Button
                className="w-full bg-gray-200 text-gray-600 cursor-not-allowed"
                disabled
              >
                Auction ended
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <Button
              variant="ghost"
              className="flex flex-col items-center text-xs"
              onClick={() => setReportOpen(true)}
            >
              <Flag className="h-5 w-5 mb-1" />
              Report
            </Button>
            {/* <Button
              variant="ghost"
              className="flex flex-col items-center text-xs"
            >
              <Heart className="h-5 w-5 mb-1" />
              Add to Watchlist
            </Button> */}
            <AddToWatchlistButton auctionId={product.id} />
            <Button
              variant="ghost"
              className="flex flex-col items-center text-xs"
            >
              <Share className="h-5 w-5 mb-1" />
              Share
            </Button>
          </div>

          <div className="flex items-center mt-6">
            <p className="text-sm mr-2">By</p>
            <span className="border rounded-full p-1 pr-2 flex items-center">
              <img
                src={
                  product.seller.profilePicture || '/defaultProfilePhoto.jpg'
                }
                alt={`${product.seller.firstName} ${product.seller.lastName}`}
                className="w-6 h-6 rounded-full mr-1"
              />
              <p className="text-sm">
                {product.seller.firstName} {product.seller.lastName}
              </p>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="bid-history">Bid History</TabsTrigger>
          </TabsList>

          <TabsContent
            value="information"
            className="p-4 border rounded-md mt-2"
          >
            <h2 className="text-lg font-semibold mb-4">About this product</h2>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          </TabsContent>

          <TabsContent
            value="bid-history"
            className="p-4 border rounded-md mt-2"
          >
            <h2 className="text-lg font-semibold mb-4">Bid History</h2>
            {product.bidHistory.length > 0 ? (
              <ul>
                {product.bidHistory.map((bid, index) => (
                  <li key={index} className="mb-2 pb-2 border-b">
                    <div className="flex items-center">
                      <img
                        src={
                          bid.bidder?.avatar !== 'NULL'
                            ? bid.bidder?.avatar
                            : '/default-avatar.png'
                        }
                        alt={bid.bidder?.name || 'Bidder'}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{bid.bidder.name}</p>
                        <p className="text-xs text-gray-500">
                          LKR {bid.amount.toLocaleString()} •{' '}
                          {new Date(bid.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No bid history available yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Live Chat</h2>
        <p className="text-sm text-gray-500">
          {auctionId ? (
            <AuctionChat auctionId={auctionId} />
          ) : (
            <div>Sorry chat is unavailable</div>
          )}
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <AuctionReport
        itemId={product.id}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default AuctionDetailsPage;
