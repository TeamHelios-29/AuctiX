import { Clock } from "lucide-react";

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
  const isEndingSoon = timeRemaining.startsWith("0d");

  return (
    <div className="w-72 border rounded-lg shadow-lg overflow-hidden bg-white">
      {/* Image with Timer Badge */}
      <div className="relative">
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-40 object-cover"
        />
        <div
          className={`absolute top-2 left-2 ${
            isEndingSoon ? "bg-red-500" : "bg-yellow-400"
          } text-white font-semibold px-3 py-1 rounded-md text-sm flex items-center`}
        >
          <Clock className="w-4 h-4 mr-1" /> {timeRemaining}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-black">{productName}</h3>
        <p className="text-gray-600 text-sm">{category}</p>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mt-2">
          <span>By</span>
          <img
            src={sellerAvatar}
            alt="Seller"
            className="w-6 h-6 rounded-full border"
          />
          <p className="text-sm text-gray-700 font-medium">{sellerName}</p>
        </div>

        {/* Price */}
        <div className="mt-3 flex justify-between items-center">
          <p className="text-sm text-gray-500">Starting Price:</p>
          <p className="text-lg font-bold text-black">LKR {startingPrice}</p>
        </div>
      </div>
    </div>
  );
}
