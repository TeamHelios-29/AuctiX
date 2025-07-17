import React, { useState, useMemo, useEffect } from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosRequest from '@/services/axiosInspector';
import { useAppSelector } from '@/hooks/hooks';

const ManageAuctions = () => {
  type FilterKey =
    | 'total'
    | 'active'
    | 'upcoming'
    | 'ended'
    | 'unlisted'
    | 'deleted';

  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Map frontend filter keys to backend filter values
  const filterMap: Record<FilterKey, string> = {
    total: 'total',
    active: 'active',
    upcoming: 'upcoming',
    ended: 'ended',
    unlisted: 'unlisted',
    deleted: 'deleted',
  };

  // Map backend status to frontend display
  const statusDisplayMap: Record<string, string> = {
    ongoing: 'Active',
    active: 'Active',
    upcoming: 'Upcoming',
    ended: 'Ended',
    completed: 'Ended',
    unlisted: 'Unlisted',
    deleted: 'Deleted',
    PENDING_ADMIN_APPROVAL: 'Pending Deletion',
    DELETED: 'Deleted',
  };

  const itemsPerPage = 10;
  const axiosInstance = AxiosRequest().axiosInstance;
  const [allAuctions, setAllAuctions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const userData = useAppSelector((state) => state.auth);
  const token = userData?.token;
  const navigate = useNavigate();

  // Fetch auctions based on filter and search
  const fetchAuctions = async (
    filter: FilterKey = 'total',
    search: string = '',
  ) => {
    if (!token) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Map frontend filter to backend filter
      let backendFilter = filterMap[filter];
      if (filter === 'active') {
        backendFilter = 'ongoing';
      } else if (filter === 'ended') {
        backendFilter = 'completed';
      }

      params.append('filter', backendFilter);
      if (search) {
        params.append('search', search);
      }

      const url = `/auctions/seller/auctions?${params.toString()}`;
      console.log('Fetching from URL:', url);

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);
      setAllAuctions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch auctions:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Only sellers can view auctions.');
      } else {
        toast.error('Failed to load auctions');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch seller stats
  const fetchStats = async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get('/auctions/seller/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      fetchAuctions();
      fetchStats();
    }
  }, [token]);

  // Refetch when filter or search changes
  useEffect(() => {
    if (token) {
      fetchAuctions(selectedFilter, searchTerm);
    }
  }, [selectedFilter, searchTerm, token]);

  // Filter auctions on frontend (backup filtering)
  const filteredAuctions = useMemo(() => {
    return allAuctions;
  }, [allAuctions]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchTerm]);

  // Calculate stats from API response
  const calculatedStats: { title: string; count: number; key: FilterKey }[] = [
    {
      title: 'Total Auctions',
      count: stats?.totalAuctions || 0,
      key: 'total',
    },
    {
      title: 'Active Auctions',
      count: stats?.ongoingAuctions || 0,
      key: 'active',
    },
    {
      title: 'Upcoming Auctions',
      count: stats?.upcomingAuctions || 0,
      key: 'upcoming',
    },
    {
      title: 'Ended Auctions',
      count: stats?.completedAuctions || 0,
      key: 'ended',
    },
    {
      title: 'Unlisted Auctions',
      count: stats?.unlistedAuctions || 0,
      key: 'unlisted',
    },
    {
      title: 'Deleted Auctions',
      count: stats?.deletedAuctions || 0,
      key: 'deleted',
    },
  ];

  const handleAuctionAction = async (
    action: 'update' | 'delete',
    auctionId: string,
  ) => {
    if (action === 'update') {
      // Fixed: Navigate to the correct update route
      navigate(`/auctions/update/${auctionId}`);
    }
    if (action === 'delete') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this auction?',
      );
      if (!confirmed) return;

      try {
        await axiosInstance.delete(`/auctions/delete/${auctionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Auction deleted successfully');

        // Refresh the auctions list
        fetchAuctions(selectedFilter, searchTerm);
        fetchStats();
      } catch (error: any) {
        if (error.response?.status === 400) {
          toast.error(error.response.data || 'Cannot delete auction');
        } else {
          toast.error('Failed to delete auction');
        }
        console.error(error);
      }
    }

    setShowDropdown(null);
  };

  const getStatusBadgeColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'ongoing':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'unlisted':
        return 'bg-yellow-100 text-yellow-800';
      case 'deleted':
      case 'pending_admin_approval':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return `LKR ${price?.toLocaleString() || 0}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest('.dropdown-container')
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

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

      <div className="grid grid-cols-6 gap-4 mb-6">
        {calculatedStats.map((item, idx) => (
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
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate('/auctions/new')}
          >
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
          <div className="relative dropdown-container">
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

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading auctions...</div>
          </div>
        ) : (
          <>
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
                  {paginatedAuctions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No auctions found
                      </td>
                    </tr>
                  ) : (
                    paginatedAuctions.map((auction, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{auction.id}</td>
                        <td className="py-3 px-4">
                          {auction.title || auction.name}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(auction.startTime || auction.start)}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(auction.endTime || auction.end)}
                        </td>
                        <td className="py-3 px-4">
                          {formatPrice(auction.startingPrice)}
                        </td>
                        <td className="py-3 px-4">
                          {auction.currentBid
                            ? formatPrice(auction.currentBid)
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(auction.status)}`}
                          >
                            {statusDisplayMap[auction.status?.toLowerCase()] ||
                              auction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 relative">
                          <div className="dropdown-container">
                            <button
                              className="p-1 hover:bg-gray-200 rounded"
                              onClick={() =>
                                setShowDropdown(
                                  showDropdown === auction.id
                                    ? null
                                    : auction.id,
                                )
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {showDropdown === auction.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + itemsPerPage, filteredAuctions.length)}{' '}
                of {filteredAuctions.length} auctions
              </span>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
          </>
        )}
      </div>
    </div>
  );
};

export default ManageAuctions;
