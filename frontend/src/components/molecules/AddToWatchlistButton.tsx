import { useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addActionToWatchList,
  removeAuctionFromWatchList,
} from '@/services/watchlistService';
import AxiosRequest from '@/services/axiosInspector';
import { toast } from 'sonner'; // optional

type Props = {
  auctionId: string;
  initiallyWatched: boolean;
};

export default function AddToWatchlistButton({
  auctionId,
  initiallyWatched = false,
}: Props) {
  const [isWatched, setIsWatched] = useState(initiallyWatched);
  const [loading, setLoading] = useState(false);
  const axiosInstance = AxiosRequest().axiosInstance;

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
