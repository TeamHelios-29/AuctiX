import { useEffect, useState } from 'react';
import {
  getWatchList,
  removeAuctionFromWatchList,
} from '@/services/watchlistService';
import AxiosRequest from '@/services/axiosInspector';
import WatchlistItem from '@/components/molecules/WatchListItem';
import { AxiosInstance } from 'axios';

type AuctionDetails = {
  id: string;
  title: string;
  category: string;
  sellerName: string;
  sellerAvatarUrl?: string;
  imageUrl: string;
  startingPrice: number;
  endsAt: string;
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<AuctionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;

  useEffect(() => {
    getWatchList(axiosInstance, 0, 20)
      .then((data) => {
        setWatchlist(data.content);
      })
      .finally(() => setLoading(false));
  }, [axiosInstance]);

  const handleRemove = async (auctionId: string) => {
    await removeAuctionFromWatchList(auctionId, axiosInstance);
    setWatchlist((prev) => prev.filter((item) => item.id !== auctionId));
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (watchlist.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        Your watchlist is empty.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        My Watchlist ({watchlist.length})
      </h1>
      {watchlist.map((auction) => (
        <WatchlistItem
          key={auction.id}
          auction={auction}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
