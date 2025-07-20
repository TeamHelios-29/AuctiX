import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SellerHeader from '@/components/organisms/sellerHeader';
import AuctionCard from '../components/molecules/auctionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/auctions/seller/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Auction data:', data);
        setAuctions(data);

        // Extract seller info from first auction if available
        if (data.length > 0 && data[0].seller) {
          setSellerInfo(data[0].seller);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching auctions:', error);
        setLoading(false);
      });
  }, [id]);

  // Helper function to get auction image URL - matching ExploreAuctions pattern
  const getAuctionImageUrl = (auction: any) => {
    console.log('Processing auction for image:', {
      id: auction.id,
      images: auction.images,
      hasImages: auction.images && auction.images.length > 0,
      firstImage: auction.images?.[0],
    });

    if (auction.images && auction.images.length > 0) {
      const imageUrl = `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${auction.images[0]}`;
      console.log('Generated image URL:', imageUrl);
      console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
      return imageUrl;
    }
    console.log('No images found, using placeholder');
    return '/api/placeholder/400/250';
  };

  // Helper function to get seller avatar URL - matching ExploreAuctions pattern
  const getSellerAvatarUrl = (auction: any) => {
    if (
      auction.seller &&
      auction.seller.profilePicture &&
      auction.seller.profilePicture.id
    ) {
      return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${auction.seller.profilePicture.id}`;
    }
    return '/api/placeholder/24/24';
  };

  return (
    <div>
      <div className="min-h-screen mx-auto px-10 py-6 sm:py-8  sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
        {/* Seller Header */}
        <SellerHeader
          sellerId={id}
          sellerName={
            sellerInfo?.firstName && sellerInfo?.lastName
              ? `${sellerInfo.firstName} ${sellerInfo.lastName}`
              : 'Loading...'
          }
          sellerAvatar={sellerInfo?.profilePicture?.id}
          backgroundPhoto={sellerInfo?.backgroundPhoto?.id}
        />
        <div className="text-xl sm:text-4xl font-semibold mt-6 sm:mt-10">
          Auctions by seller
        </div>
        {/* Filters */}
        <Tabs defaultValue="All" className="w-full mt-3 sm:mt-4">
          <TabsList>
            {['All', 'Ongoing', 'Upcoming', 'Ended'].map((filter) => (
              <TabsTrigger key={filter} value={filter}>
                {filter}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Auction Cards Grid */}
        {loading ? (
          <div className="mt-8 text-center">Loading...</div>
        ) : auctions.length === 0 ? (
          <div className="mt-8 text-center text-muted-foreground">
            No auctions found for this seller
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {auctions.map((auction, index) => {
              const imageUrl = getAuctionImageUrl(auction);
              const avatarUrl = getSellerAvatarUrl(auction);

              console.log('Auction:', auction.id, 'Image URL:', imageUrl); // Debug log

              return (
                <AuctionCard
                  key={auction.id || index}
                  imageUrl={imageUrl}
                  productName={auction.title}
                  category={auction.category}
                  sellerName={
                    auction.seller?.firstName && auction.seller?.lastName
                      ? `${auction.seller.firstName} ${auction.seller.lastName}`
                      : 'Unknown Seller'
                  }
                  sellerAvatar={avatarUrl}
                  startingPrice={
                    auction.startingPrice?.toLocaleString() || 'N/A'
                  }
                  timeRemaining={auction.endTime}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
