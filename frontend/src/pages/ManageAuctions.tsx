import React, { useState, useMemo } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ManageAuctions = () => {
  const [selectedFilter, setSelectedFilter] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);
  const itemsPerPage = 10;

  // Mock auction data
  const allAuctions = [
    {
      id: 'AC001',
      name: 'Antique Chair',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 9000',
      currentBid: 'LKR 13000',
      status: 'Ended',
    },
    {
      id: 'AC002',
      name: 'Vintage Lamp',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 5000',
      currentBid: 'LKR 6000',
      status: 'Ongoing',
    },
    {
      id: 'AC003',
      name: 'Wooden Table',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Unlisted',
    },
    {
      id: 'AC004',
      name: 'Gold Watch',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Upcoming',
    },
    {
      id: 'AC005',
      name: 'Silver Ring',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Upcoming',
    },
    {
      id: 'AC006',
      name: 'Ceramic Vase',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Upcoming',
    },
    {
      id: 'AC007',
      name: 'Oil Painting',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 8000',
      currentBid: 'LKR 9500',
      status: 'Ended',
    },
    {
      id: 'AC008',
      name: 'Crystal Bowl',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 2500',
      currentBid: '-',
      status: 'Unlisted',
    },
  ];

  // Filter auctions based on selected filter and search term
  const filteredAuctions = useMemo(() => {
    let filtered = allAuctions;

    // Filter by status
    if (selectedFilter !== 'total') {
      const statusMap = {
        ongoing: 'Ongoing',
        upcoming: 'Upcoming',
        completed: 'Ended',
        unlisted: 'Unlisted',
      };
      filtered = filtered.filter(
        (auction) => auction.status === statusMap[selectedFilter],
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [selectedFilter, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to first page when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchTerm]);

  // Calculate stats
  const stats = [
    { title: 'Total Auctions', count: allAuctions.length, key: 'total' },
    {
      title: 'Ongoing Auction',
      count: allAuctions.filter((a) => a.status === 'Ongoing').length,
      key: 'ongoing',
    },
    {
      title: 'Upcoming Auctions',
      count: allAuctions.filter((a) => a.status === 'Upcoming').length,
      key: 'upcoming',
    },
    {
      title: 'Completed Auctions',
      count: allAuctions.filter((a) => a.status === 'Ended').length,
      key: 'completed',
    },
    {
      title: 'Unlisted Auctions',
      count: allAuctions.filter((a) => a.status === 'Unlisted').length,
      key: 'unlisted',
    },
  ];

  const handleAuctionAction = (action, auctionId) => {
    console.log(`${action} auction ${auctionId}`);
    setShowDropdown(null);
    // Implement your action logic here
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Ended':
        return 'bg-gray-100 text-gray-800';
      case 'Unlisted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold mb-2">Auctions</h1>
        <p className="text-gray-600">
          You can view and manage your auctions here
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 text-center cursor-pointer transition-all rounded-lg border ${
              selectedFilter === item.key
                ? 'bg-blue-50 border-blue-300 shadow-md'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => setSelectedFilter(item.key)}
          >
            <h2 className="text-2xl font-bold">{item.count}</h2>
            <p className="text-sm text-gray-500">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Auctions</h2>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Add Auction +
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="relative">
            <button
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={() =>
                setShowDropdown(showDropdown === 'columns' ? null : 'columns')
              }
            >
              Columns
            </button>
            {showDropdown === 'columns' && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Show All Columns
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Hide Start Price
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Hide Current Bid
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Auction ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Start
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  End
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Start Price
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Current Bid
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="w-12 py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedAuctions.map((auction, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{auction.id}</td>
                  <td className="py-3 px-4">{auction.name}</td>
                  <td className="py-3 px-4">{auction.start}</td>
                  <td className="py-3 px-4">{auction.end}</td>
                  <td className="py-3 px-4">{auction.startPrice}</td>
                  <td className="py-3 px-4">{auction.currentBid}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(auction.status)}`}
                    >
                      {auction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() =>
                          setShowDropdown(
                            showDropdown === auction.id ? null : auction.id,
                          )
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {showDropdown === auction.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <div
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                handleAuctionAction('update', auction.id)
                              }
                            >
                              Update Auction
                            </div>
                            <div
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                              onClick={() =>
                                handleAuctionAction('delete', auction.id)
                              }
                            >
                              Delete Auction
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredAuctions.length)} of{' '}
            {filteredAuctions.length} auctions
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAuctions;
