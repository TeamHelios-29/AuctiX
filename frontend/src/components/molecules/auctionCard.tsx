import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
    <Card className="overflow-hidden shadow-none h-full flex flex-col">
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
              ? 'bg-red-500 text-white hover:bg-red-500 hover:text-white'
              : 'bg-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-gray-900'
          } font-bold px-3 py-1 rounded-none rounded-br-md text-sm flex items-center shadow-none`}
        >
          <Clock className="w-4 h-4 mr-1" /> {timeRemaining}
        </Badge>
      </div>

      {/* Card Content */}
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="">
          <h3 className="text-lg leading-5 font-semibold text-gray-900 line-clamp-2">
            {productName}
          </h3>
          <p className="text-gray-600 text-sm">{category}</p>

          {/* Seller Info */}
          <div className="flex items-center gap-1 mt-2">
            <span>By</span>
            <Avatar className="w-5 h-5">
              <AvatarImage src={sellerAvatar} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-700 font-medium">{sellerName}</p>
          </div>
        </div>

        {/* Time Remaining */}

        {/* Price */}

        <div className="mt-auto pt-6 flex justify-between items-center">
          <p className="text-sm text-gray-700">Starting Price:</p>
          <p className="text-xl font-bold text-gray-500">LKR {startingPrice}</p>
        </div>
      </CardContent>
    </Card>
  );
}
