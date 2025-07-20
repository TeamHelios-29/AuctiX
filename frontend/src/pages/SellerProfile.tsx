import SellerHeader from '@/components/organisms/sellerHeader';
import AuctionCard from '../components/molecules/auctionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SellerProfile() {
  const auctions = [
    {
      imageUrl: 'buyerRegister.jpg',
      productName: 'leanado davinci statue',
      category: 'Category',
      sellerName: 'Sam Perera',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },
    {
      imageUrl: 'example.jpg',
      productName: 'Product Name jaya sanka 1:26 scale model automatic car',
      category: 'Category',
      sellerName: 'Sam Perera',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },

    {
      imageUrl: 'example.jpg',
      productName: 'Mig aircraft',
      category: 'Category',
      sellerName: 'Sam Perera',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '1,000,000',
      timeRemaining: '0d 4h 4m 59s', // This should be red
    },
    {
      imageUrl: 'example.jpg',
      productName: 'Class M6 locomotive model',
      category: 'Category',
      sellerName: 'Sam Perera',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '10,000',
      timeRemaining: '3d 3h 34m 59s',
    },
    {
      imageUrl: 'example.jpg',
      productName: 'Vintage 1980s arcade machine - "Galactic Invaders"',
      category: 'Category',
      sellerName: 'sam Perera',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },
  ];

  return (
    <div>
      <div className="min-h-screen mx-auto px-10 py-6 sm:py-8  sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-7xl">
        {/* Seller Header */}
        <SellerHeader />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {auctions.map((auction, index) => (
            <AuctionCard key={index} {...auction} />
          ))}
        </div>
      </div>
    </div>
  );
}
