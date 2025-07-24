import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';

interface Seller {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: {
    id: string;
  } | null;
}

interface AuctionResult {
  id: string;
  title: string;
  category: string;
  seller: Seller;
  images: string[];
}

const getImageUrl = (uuid?: string) => {
  return uuid
    ? `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${uuid}`
    : '/api/placeholder/400/250';
};

export default function AuctionSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AuctionResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length >= 1) {
        axiosInstance
          .get(`/auctions/search?q=${encodeURIComponent(query)}`)
          .then((res) => {
            setResults(res.data);
            setShowDropdown(true);
          })
          .catch(() => {
            setResults([]);
            setShowDropdown(false);
          });
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (auctionId: string) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/auction-details/${auctionId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(query)}`);
  };

  const highlightMatch = (text?: string) => {
    if (!text || !query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Search auctions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          ref={inputRef}
        />
      </form>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item.id)}
            >
              <img
                src={getImageUrl(item.images[0])}
                alt={item.title}
                className="w-12 h-12 object-cover rounded-md mr-4"
              />

              <div className="flex flex-col w-full">
                <div className="text-sm font-semibold">
                  {highlightMatch(item.title)}
                </div>

                <div className="text-xs text-gray-500">
                  Seller:
                  {highlightMatch(
                    item.seller.firstName && item.seller.lastName
                      ? `${item.seller.firstName} ${item.seller.lastName}`
                      : item.seller.username,
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  {highlightMatch(item.category)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
