import AuctionCard from '../components/ui/auctionCard';
import SellerHeader from '../components/sellerHeader';
import Footer from '../components/footer';

export default function sellerProfile() {
  const auctions = [
    {
      imageUrl: 'example.jpg',
      productName: 'Product Name',
      category: 'Category',
      sellerName: 'John Doily',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },
    {
      imageUrl: 'example.jpg',
      productName: 'Product Name',
      category: 'Category',
      sellerName: 'John Doily',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },

    {
      imageUrl: 'example.jpg',
      productName: 'Product Name',
      category: 'Category',
      sellerName: 'John Doily',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '0d 4h 4m 59s', // This should be red
    },
    {
      imageUrl: 'example.jpg',
      productName: 'Product Name',
      category: 'Category',
      sellerName: 'John Doily',
      sellerAvatar: 'exampleAvatar.png',
      startingPrice: '5,000',
      timeRemaining: '3d 3h 34m 59s',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex-grow">
        {/* Seller Header */}
        <SellerHeader />
        <div className="text-4xl font-bold mt-6">Auctions by seller</div>
        {/* Filters */}
        <div className="mt-4 flex gap-2 ">
          {['All', 'Ongoing', 'Upcoming', 'Ended'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 text-sm border rounded-md hover:bg-white bg-gray-200"
            >
              {filter}
            </button>
          ))}
        </div>
        {/* Auction Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {auctions.map((auction, index) => (
            <AuctionCard key={index} {...auction} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
