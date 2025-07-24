import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AxiosRequest from '@/services/axiosInspector';
import { toast } from 'react-toastify';

type SellerStats = {
  totalAuctions: number;
  ongoingAuctions: number;
  upcomingAuctions: number;
  completedAuctions: number;
  deletedAuctions: number;
  walletBalance: number;
};

type WalletInfo = {
  amount: number;
  freezeAmount: number;
  updatedAt: string;
  // Add other properties based on your API response
};

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const userData = useAppSelector((state) => state.user);
  const authData = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const axiosInstance = AxiosRequest().axiosInstance;
  const token = authData?.token;

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    if (!token) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      // Get seller statistics
      const statsResponse = await axiosInstance.get('/auctions/seller/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Get recent auctions (limit to 5 for dashboard)
      const auctionsResponse = await axiosInstance.get(
        '/auctions/seller/auctions?filter=total',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Get wallet information
      const getWalletInfo = async () => {
        try {
          const response = await axiosInstance.get('/coins/wallet-info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching wallet info:', error);
          return null;
        }
      };

      const walletData = await getWalletInfo();

      setStats(statsResponse.data);
      setWalletInfo(walletData);
      setRecentAuctions(auctionsResponse.data.slice(0, 5)); // Show only recent 5
    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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

  const statusDisplayMap: Record<string, string> = {
    ongoing: 'Active',
    active: 'Active',
    upcoming: 'Upcoming',
    ended: 'Ended',
    completed: 'Ended',
    unlisted: 'Unlisted',
    deleted: 'Deleted',
    pending_admin_approval: 'Pending Deletion',
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return `LKR ${price?.toLocaleString() || 0}`;
  };

  const handleAuctionAction = async (
    action: 'view' | 'edit' | 'delete',
    auctionId: string,
  ) => {
    switch (action) {
      case 'view':
        navigate(`/auction-details/${auctionId}`);
        break;
      case 'edit':
        navigate(`/auctions/update/${auctionId}`);
        break;
      case 'delete':
        const confirmed = window.confirm(
          'Are you sure you want to delete this auction?',
        );
        if (!confirmed) return;

        try {
          await axiosInstance.delete(`/auctions/delete/${auctionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success('Auction deleted successfully');
          fetchSellerData(); // Refresh data
        } catch (error: any) {
          if (error.response?.status === 400) {
            toast.error(error.response.data || 'Cannot delete auction');
          } else {
            toast.error('Failed to delete auction');
          }
        }
        break;
    }
    setShowDropdown(null);
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
    <div className="bg-white">
      <section className="relative w-full mb-5">
        {/* Banner image without padding */}
        <div className="relative h-64 w-full">
          <img
            src={userData.banner_photo}
            alt="cover-image"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Profile content positioned at bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <img
                    src={userData.profile_photo}
                    alt="user-avatar-image"
                    className="rounded-md w-20 h-20 object-cover shadow-lg shadow-white/10 border-2 border-white/20"
                  />
                  <div className="flex flex-col items-start ml-4 md:ml-6 mb-2">
                    <div className="text-white/80 font-medium leading-none text-sm">
                      Hello,
                    </div>
                    <h3 className="font-manrope font-bold text-2xl md:text-4xl text-white">
                      {userData.username || 'Guest'}
                    </h3>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings/profile')}
                >
                  Go to Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        {/* Split screen: Wallet Card (left) and placeholder (right) */}
        <div className="flex gap-6 mb-8">
          {/* Wallet Card (left) */}
          {/* Wallet Card (left) */}
          <div className="w-full md:w-2/5">
            <Card className="bg-gradient-to-br from-gray-50 to-zinc-300 text-gray-800 p-6 rounded-lg h-full shadow-sm border-none">
              <div className="flex justify-between items-start mb-4">
                <div className="text-gray-600 text-sm font-medium">Wallet</div>
                <div className="text-gray-800 text-lg ">
                  Aucti<span className="text-[#eaac26]">X</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-gray-500 text-xs mb-1">
                  Available Balance
                </div>
                <div className="text-2xl font-bold tracking-wider text-gray-900">
                  {loading
                    ? 'Loading...'
                    : walletInfo?.amount !== undefined
                      ? `LKR ${walletInfo.amount.toLocaleString()}`
                      : 'LKR 0'}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-500 text-xs">Frozen</div>
                  <div className="text-sm font-semibold text-orange-600">
                    {walletInfo?.freezeAmount !== undefined
                      ? `LKR ${walletInfo.freezeAmount.toLocaleString()}`
                      : 'LKR 0'}
                  </div>
                </div>
                <div>
                  <Button
                    variant="secondary"
                    className="text-xs px-3 py-1 text-gray-700 hover:text-gray-900"
                    onClick={() => navigate('/wallet')}
                  >
                    Go to Wallet
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          {/* Placeholder for right side */}
          <div className="hidden md:block w-3/5 bg-gray-100 rounded-lg"></div>
        </div>

        <div className="p-6 border rounded-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-semibold">Auctions</h1>
            </div>

            <Button
              className="bg-blue-950 text-white"
              onClick={() => navigate('/auctions/new')}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Auction
            </Button>
          </div>

          {/* Seller Stats Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <Card className="p-4 bg-gray-100 border-none">
              <div className="text-4xl font-bold">
                {stats?.totalAuctions || 0}
              </div>
              <div className="text-sm font-bold text-gray-500">Total</div>
            </Card>
            <Card className="p-4 border-yellow-300 shadow-lg shadow-yellow-100">
              <div className="text-4xl font-bold">
                {stats?.ongoingAuctions || 0}
              </div>
              <div className="text-sm text-gray-500">Active</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">
                {stats?.upcomingAuctions || 0}
              </div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">
                {stats?.completedAuctions || 0}
              </div>
              <div className="text-sm text-gray-500">Ended</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">
                {stats?.deletedAuctions || 0}
              </div>
              <div className="text-sm text-gray-500">Deleted</div>
            </Card>
          </div>

          {/* Recent Auctions */}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading auctions...</div>
            </div>
          ) : recentAuctions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No auctions found</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/create-auction')}
              >
                Create Your First Auction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">
                      Title
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">
                      Start Price
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">
                      Current Bid
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">
                      End Time
                    </th>
                    <th className="w-12 py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentAuctions.map((auction: any) => (
                    <tr
                      key={auction.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-3">
                          {auction.imageUrl && (
                            <img
                              src={auction.imageUrl}
                              alt={auction.title}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {auction.title || auction.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            auction.status,
                          )}`}
                        >
                          {statusDisplayMap[auction.status?.toLowerCase()] ||
                            auction.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium">
                        {formatPrice(auction.startingPrice)}
                      </td>
                      <td className="py-3 px-2 font-medium text-green-600">
                        {auction.currentBid
                          ? formatPrice(auction.currentBid)
                          : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500">
                        {formatDate(auction.endTime)}
                      </td>
                      <td className="py-3 px-2 relative">
                        <div className="dropdown-container">
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
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              <div className="py-1">
                                <div
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                                  onClick={() =>
                                    handleAuctionAction('view', auction.id)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View</span>
                                </div>
                                <div
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                                  onClick={() =>
                                    handleAuctionAction('edit', auction.id)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </div>
                                <div
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center space-x-2"
                                  onClick={() =>
                                    handleAuctionAction('delete', auction.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
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
          )}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {recentAuctions.length} of {stats?.totalAuctions || 0}{' '}
              auctions
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/manage-auctions')}
            >
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
