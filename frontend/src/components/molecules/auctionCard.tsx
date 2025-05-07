import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AuctionCardProps {
  imageUrl: string;
  productName: string;
  category: string;
  sellerName: string;
  sellerAvatar: string;
  startingPrice: string;
  timeRemaining: string;
}

export default function AuctionCard({
  imageUrl,
  productName,
  category,
  sellerName,
  sellerAvatar,
  startingPrice,
  timeRemaining,
}: AuctionCardProps) {
  // Check if the timeRemaining starts with "0d" (indicating the last day)
  const isEndingSoon = timeRemaining.startsWith('0d');

  return (
    <Card className="w-72 overflow-hidden">
      {/* Image with Timer Badge */}
      <div className="relative">
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-40 object-cover"
        />
        <Badge
          className={`absolute top-0 left-0 ${
            isEndingSoon
              ? 'bg-red-500 text-white'
              : 'bg-yellow-400 text-gray-900'
          } font-bold px-3 py-1 rounded-none rounded-br-md text-sm flex items-center`}
        >
          <Clock className="w-4 h-4 mr-1" /> {timeRemaining}
        </Badge>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{productName}</h3>
        <p className="text-gray-600 text-sm">{category}</p>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mt-2">
          <span>By</span>
          <Avatar className="w-6 h-6">
            <AvatarImage src={sellerAvatar} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-700 font-medium">{sellerName}</p>
        </div>

        {/* Price */}
        <div className="mt-3 flex justify-between items-center">
          <p className="text-sm text-gray-700">Starting Price:</p>
          <p className="text-lg font-bold text-gray-700">LKR {startingPrice}</p>
        </div>
      </CardContent>
    </Card>
  );
}
