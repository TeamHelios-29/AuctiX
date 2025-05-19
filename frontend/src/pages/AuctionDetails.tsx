import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share, Flag, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom'; // if using react-router
import axios from 'axios'; // for API calls
import { Client } from '@stomp/stompjs'; // for WebSocket connection
import AxiosRequest from '@/services/axiosInspector';
import type { BidDTO, BidderDTO } from 'src/types/BidDTO';

// Types
interface BidHistory {
  bidder: {
    id: string;
    name: string;
    avatar: string;
  };
  amount: number;
  timestamp: string;
}

interface ProductOwner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  joinedDate: string;
}

interface ProductDetails {
  id: string;
  category: string;
  name: string;
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
    id: string;
    name: string;
    avatar: string;
  };
  endTime: string;
  bidHistory: BidHistory[];
  productOwner: ProductOwner;
}

const BID_INCREMENT = 1000;

// const productData: ProductDetails = {
//   id: '12345',
//   category: 'Category',
//   name: 'Product Name',
//   description:
//     'Lorem ipsum dolor sit amet consectetur. Augue quis justo amet tristique nibh. Elementum risus sem ultricies sed sit. Quam qelit aenm eu egestas diam ut sector nunc ulteries. In consetetur, urna non molestie. Tincidunt sitsusant et pretium cursus urna sociates et. Quis adipiscing laoreet risus malesuada elementum.',
//   images: [
//     '/api/placeholder/400/320',
//     '/api/placeholder/150/100',
//     '/api/placeholder/150/100',
//     '/api/placeholder/150/100',
//     '/api/placeholder/150/100',
//   ],
//   startingPrice: 5000,
//   currentBid: 7000,
//   bidIncrement: BID_INCREMENT,
//   currentBidder: {
//     id: '67890',
//     name: 'Tishan Dias',
//     avatar: '/api/placeholder/32/32',
//   },
//   seller: {
//     id: '54321',
//     name: 'John Dolly',
//     avatar: '/api/placeholder/32/32',
//   },
//   endTime: '2025-04-20T12:00:00Z', // Example future date
//   bidHistory: [],
//   productOwner: {
//     id: '54321',
//     name: 'John Dolly',
//     avatar: '/api/placeholder/32/32',
//     rating: 4.8,
//     joinedDate: '2023-01-15',
//   },
// };

const AuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const axiosInstance = AxiosRequest().axiosInstance;

  const [currentBid, setCurrentBid] = useState<number>(0);
  const [currentBidder, setCurrentBidder] = useState<BidderDTO | null>(null);

  function bidDTOToBidHistory(bid: BidDTO): BidHistory {
    return {
      bidder: bid.bidder,
      amount: bid.amount,
      timestamp: bid.bidTime, // Assuming bidTime is ISO string
    };
  }

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(`/auctions/${auctionId}`);
        setProduct(response.data);
        // Initialize bid amount to current bid + increment
        setBidAmount(response.data.currentBid + response.data.bidIncrement);
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

  // useEffect(() => {
  //   // Directly set mock data for demo
  //   setProduct(productData);
  //   setBidAmount(productData.currentBid + productData.bidIncrement);
  //   setLoading(false);
  // }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-auction', // Changed to match backend endpoint
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Configure handlers BEFORE activation
    client.onConnect = () => {
      console.log('Connected to WebSocket');

      client.subscribe(`/topic/bids/${auctionId}`, (message) => {
        const bidUpdate: BidDTO = JSON.parse(message.body);
        setCurrentBid(bidUpdate.amount);
        setCurrentBidder({
          name: bidUpdate.bidder.name, // Now nested
          avatar: bidUpdate.bidder.avatar,
          id: bidUpdate.bidder.id, // Now nested
        });

        setProduct((prev) =>
          prev
            ? {
                ...prev,
                bidHistory: [bidDTOToBidHistory(bidUpdate), ...prev.bidHistory],
                currentBid: bidUpdate.amount,
                currentBidder: bidUpdate.bidder,
              }
            : null,
        );
      });

      // Single error handler
      client.onStompError = (frame: any) => {
        console.error('STOMP error:', frame.headers.message);
        setError('Connection error - please refresh the page');
      };

      client.activate();
      setStompClient(client);
    };

    // Activate client and cleanup
    client.onDisconnect = () => {
      console.log('WebSocket disconnected');
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
        console.log('WebSocket disconnected');
      }
    };
  }, [auctionId]);

  // Calculate time remaining
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
    if (
      bidAmount - product.bidIncrement >=
      product.currentBid + product.bidIncrement
    ) {
      setBidAmount(bidAmount - product.bidIncrement);
    }
  };

  const handlePlaceBid = async () => {
    if (!product || !auctionId) return;

    try {
      // Send bid to backend
      await axios.post(`/api/bids`, {
        auctionId: auctionId,
        amount: bidAmount,
        // You might need to include authentication info or user ID
        // depending on your backend implementation
      });

      // No need to update state here as it will be updated via WebSocket
    } catch (err) {
      console.error('Error placing bid:', err);
      // Handle different error types (e.g., bid too low, auction ended)
      const errorResponse =
        (err as any)?.response?.data?.message ||
        'Failed to place bid. Please try again.';
      setError(errorResponse);

      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p>Loading auction details...</p>
      </div>
    );
  }

  // Show error state
  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If product is null after loading, show not found message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p>Auction not found</p>
      </div>
    );
  }

  // Move the return statement and JSX inside the component function
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Product Images */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <img
                src="http://localhost:8080/api/user/getUserProfilePhoto?file_uuid=61163c7a-5d6c-4f2c-b64a-5cfda6b84565"
                alt={product.name}
                className="w-full h-96 object-cover rounded-md"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md cursor-pointer"
                />
              ))}
            </div>
          </div>

          <Tabs defaultValue="information" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="bid-history">Bid History</TabsTrigger>
              <TabsTrigger value="product-owner">Product Owner</TabsTrigger>
            </TabsList>

            <TabsContent
              value="information"
              className="p-4 border rounded-md mt-2"
            >
              <h2 className="text-lg font-semibold mb-4">About this product</h2>
              <p className="text-sm text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {product.description}
              </p>
              <p className="text-sm text-gray-600">{product.description}</p>
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
                          src={bid.bidder.avatar}
                          alt={bid.bidder.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {bid.bidder.name}
                          </p>
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

            <TabsContent
              value="product-owner"
              className="p-4 border rounded-md mt-2"
            >
              <h2 className="text-lg font-semibold mb-4">Product Owner</h2>
              <div className="flex items-center mb-4">
                <img
                  src={product.productOwner.avatar}
                  alt={product.productOwner.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{product.productOwner.name}</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-2">
                      Rating: {product.productOwner.rating}/5
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined:{' '}
                      {new Date(
                        product.productOwner.joinedDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section - Bidding Information */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-1">Closes in</p>
            <p className="text-lg font-semibold">{timeLeft}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Current Highest Bid</p>
            <p className="text-3xl font-bold mb-2">
              LKR {product.currentBid.toLocaleString()}
            </p>
            <div className="flex items-center text-sm">
              <p>By</p>
              <img
                src={product.currentBidder.avatar}
                alt={product.currentBidder.name}
                className="w-6 h-6 rounded-full mx-2"
              />
              <p>{product.currentBidder.name}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Starting Price: LKR {product.startingPrice.toLocaleString()}
            </p>

            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                className="px-4"
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
                variant="outline"
                className="px-4"
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
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <p className="text-sm">{product.seller.name}</p>
          </div>

          {/* Live Chat Section Placeholder */}
          <div className="border rounded-md p-4 mt-6">
            <h2 className="text-lg font-semibold mb-4">Live Chat</h2>
            <p className="text-sm text-gray-500">
              Live chat will be integrated here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsPage;
