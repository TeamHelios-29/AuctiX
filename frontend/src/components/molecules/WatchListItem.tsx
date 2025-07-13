import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatAuctionTimeRemaining } from '@/lib/utils';

type Props = {
  auction: {
    id: string;
    title: string;
    category: string;
    sellerName: string;
    sellerAvatarUrl?: string;
    imageUrl: string;
    startingPrice: number;
    endsAt: string;
  };
  onRemove: (id: string) => void;
};

export default function WatchlistItem({ auction, onRemove }: Props) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
      <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-br">
          {formatAuctionTimeRemaining(auction.endsAt)}
        </span>
      </div>
      <div className="ml-4 flex-1">
        <div className="font-semibold text-lg">{auction.title}</div>
        <div className="text-sm text-gray-500">{auction.category}</div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <img
            src={auction.sellerAvatarUrl ?? '/default-avatar.png'}
            alt="Seller"
            className="w-4 h-4 rounded-full"
          />
          <span>By {auction.sellerName}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-500">Starting Price:</div>
        <div className="font-bold text-lg text-black">
          LKR {auction.startingPrice.toLocaleString()}
        </div>
        <div className="flex gap-2 mt-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(auction.id)}
            title="Remove from watchlist"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => window.open(`/auction/${auction.id}`, '_blank')}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
