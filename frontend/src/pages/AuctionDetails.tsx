import { useState, useEffect } from 'react';
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
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuctionWebSocket } from '@/hooks/useAuctionWebSocket';

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
  const [timeLeft, setTimeLeft] = useState<boolean>(true);
  const axiosInstance = AxiosRequest().axiosInstance;
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  function transformBidData(backendData: any) {
    const getAvatarUrl = (profilePicture: { id: any }) => {
      if (profilePicture && profilePicture.id) {
        return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${profilePicture.id}`;
      }
      return '/defaultProfilePhoto.jpg';
    };

    const transformUser = (user: {
      username: any;
      firstName: any;
      lastName: any;
      profilePicture: { id: any };
    }) => ({
      id: user.username,
      name: `${user.firstName} ${user.lastName}`,
      avatar: getAvatarUrl(user.profilePicture),
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

  useAuctionWebSocket(auctionId!, (payload) => {
    const newBid = payload.newBid;
    const updatedHistory = payload.bidHistory;

    const updatedProduct = { ...product! }; // product is already fetched earlier

    // Update highest bid
    updatedProduct.currentBid = newBid.amount;
    updatedProduct.currentBidder = newBid.bidder
      ? {
          id: newBid.bidder.username,
          name: `${newBid.bidder.firstName} ${newBid.bidder.lastName}`,
          avatar: newBid.bidder.profilePicture?.id
            ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${newBid.bidder.profilePicture.id}`
            : '/defaultProfilePhoto.jpg',
        }
      : {
          id: '',
          name: 'No bidder yet',
          avatar: '/defaultProfilePhoto.jpg',
        };

    // Update bid history
    updatedProduct.bidHistory = updatedHistory.map((bid: any) => ({
      bidder: {
        id: bid.bidder.username,
        name: `${bid.bidder.firstName} ${bid.bidder.lastName}`,
        avatar: bid.bidder.profilePicture?.id
          ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${bid.bidder.profilePicture.id}`
          : '/defaultProfilePhoto.jpg',
      },
      amount: bid.amount,
      timestamp: bid.bidTime,
    }));

    setProduct(updatedProduct);
  });

  useEffect(() => {
    if (!product) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(product.endTime);
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
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
            <p className="text-2xl ">
              <span className="text-gray-400">Closes in </span>
              <span className="">{timeLeft}</span>
            </p>
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

            <div className="flex items-center mb-4">
              <Button
                variant="secondary"
                className="px-4 bg-gray-100"
                onClick={handleDecrementBid}
              >
                −
              </Button>
              <Input
                type="text"
                value={`LKR ${bidAmount.toLocaleString()}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value) {
                    setBidAmount(Number(value));
                  }
                }}
                className="text-center mx-2"
              />
              <Button
                variant="secondary"
                className="px-4 bg-gray-100"
                onClick={handleIncrementBid}
              >
                +
              </Button>
            </div>

            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
              onClick={handlePlaceBid}
            >
              Place Bid
            </Button>
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
            <Button
              variant="ghost"
              className="flex flex-col items-center text-xs"
            >
              <Heart className="h-5 w-5 mb-1" />
              Add to Watchlist
            </Button>
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
            <div>Sorry chat is unvaliable</div>
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
