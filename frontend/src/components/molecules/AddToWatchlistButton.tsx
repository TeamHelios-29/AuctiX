import { useEffect, useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addActionToWatchList,
  removeAuctionFromWatchList,
  checkIfAuctionIsWatched,
} from '@/services/watchlistService';
import AxiosRequest from '@/services/axiosInspector';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/hooks';

type Props = {
  auctionId: string;
  initiallyWatched?: boolean;
};

export default function AddToWatchlistButton({
  auctionId,
  initiallyWatched,
}: Props) {
  const { toast } = useToast();

  const [isWatched, setIsWatched] = useState(initiallyWatched ?? false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(
    initiallyWatched !== undefined,
  );

  const axiosInstance = AxiosRequest().axiosInstance;
  const isLoggedIn = useAppSelector((state) => state.auth.isUserLoggedIn);
  const userRole = useAppSelector((state) => state.user.role);

  useEffect(() => {
    if (initiallyWatched === undefined && isLoggedIn && userRole === 'BIDDER') {
      const fetchWatchStatus = async () => {
        try {
          const res = await checkIfAuctionIsWatched(auctionId, axiosInstance);
          setIsWatched(res.isWatched);
        } catch (e) {
          toast({
            variant: 'destructive',
            title: 'Failed to check watchlist status',
            description: 'Failed to get the watchlist status, please try again',
          });
        } finally {
          setInitialized(true);
        }
      };

      fetchWatchStatus();
    } else if (initiallyWatched === undefined) {
      // Skip fetching but still mark as initialized to avoid showing the loading button
      setInitialized(true);
    }
  }, [auctionId, isLoggedIn, userRole, initiallyWatched]);

  const handleClick = async () => {
    if (!isLoggedIn) {
      toast({
        variant: 'default',
        title: 'Cannot add to watchlist',
        description: 'You must be logged in to add auction to your watchlist',
      });
      return;
    }

    if (userRole !== 'BIDDER') {
      toast({
        variant: 'default',
        title: 'Cannot add to watchlist',
        description: 'You must be a bidder to add an auction to your watchlist',
      });
      return;
    }

    try {
      setLoading(true);

      if (!isWatched) {
        await addActionToWatchList(auctionId, axiosInstance);
        setIsWatched(true);
        toast({
          variant: 'default',
          title: 'Added to watchlist',
          description: 'The auction was added to watchlist',
        });
      } else {
        await removeAuctionFromWatchList(auctionId, axiosInstance);
        setIsWatched(false);
        toast({
          variant: 'default',
          title: 'Removed from watchlist',
          description: 'The auction was removed from you watchlist',
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description:
          'Something went wrong with changing the auction watch status',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || loading) {
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

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        className="flex flex-col items-center text-xs text-muted-foreground"
        disabled
      >
        <Heart className="h-5 w-5 mb-1" />
        Login to Watch
      </Button>
    );
  }

  if (userRole !== 'BIDDER') {
    return (
      <Button
        variant="ghost"
        className="flex flex-col items-center text-xs text-muted-foreground"
        disabled
      >
        <Heart className="h-5 w-5 mb-1" />
        Only for Bidders
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
