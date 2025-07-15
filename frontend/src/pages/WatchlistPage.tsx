import WatchListDataTable from '@/components/organisms/WatchListDataTable';

export default function WatchlistPage() {
  return (
    <div className="bg-white">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">Watchlist</h1>
            </div>
            <div></div>
          </div>
          <p className="text-gray-600 mt-4">
            The watchlist shows auctions you are currently watching. If you are
            watching an auction, you will receive notifications about important
            events related to it. Additionally, if you place a bid on an
            auction, it will be automatically added to your watchlist.
          </p>
        </header>

        <WatchListDataTable />
      </div>
    </div>
  );
}
