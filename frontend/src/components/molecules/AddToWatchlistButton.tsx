import { useEffect, useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addActionToWatchList,
  removeAuctionFromWatchList,
  checkIfAuctionIsWatched,
} from '@/services/watchlistService';
import AxiosRequest from '@/services/axiosInspector';
import { toast } from 'sonner';

type Props = {
  auctionId: string;
  initiallyWatched?: boolean;
};

export default function AddToWatchlistButton({
  auctionId,
  initiallyWatched,
}: Props) {
  const [isWatched, setIsWatched] = useState(initiallyWatched ?? false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(
    initiallyWatched !== undefined,
  );

  const axiosInstance = AxiosRequest().axiosInstance;

  useEffect(() => {
    if (initiallyWatched === undefined) {
      const fetchWatchStatus = async () => {
        try {
          const res = await checkIfAuctionIsWatched(auctionId, axiosInstance);
          setIsWatched(res.isWatched);
        } catch (e) {
          toast.error('Failed to check watchlist status');
        } finally {
          setInitialized(true);
        }
      };

      fetchWatchStatus();
    }
  }, [auctionId, axiosInstance, initiallyWatched]);

  const handleClick = async () => {
    try {
      setLoading(true);

      if (!isWatched) {
        await addActionToWatchList(auctionId, axiosInstance);
        setIsWatched(true);
        toast.success('Added to watchlist');
      } else {
        await removeAuctionFromWatchList(auctionId, axiosInstance);
        setIsWatched(false);
        toast.success('Removed from watchlist');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <Button
        variant="ghost"
        className="flex flex-col items-center text-xs"
        disabled
      >
        <Heart className="h-5 w-5 mb-1 animate-pulse" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center text-xs"
      onClick={handleClick}
      disabled={loading}
    >
      {isWatched ? (
        <>
          <HeartOff className="h-5 w-5 mb-1 text-red-500" />
          In Watchlist
        </>
      ) : (
        <>
          <Heart className="h-5 w-5 mb-1" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
