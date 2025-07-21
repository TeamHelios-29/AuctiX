import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AxiosRequest from '@/services/axiosInspector';
import { useNavigate } from 'react-router-dom';

type WalletInfo = {
  amount: number;
  freezeAmount: number;
  updatedAt: string;
};

export default function BidderDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBids, setRecentBids] = useState([]);
  const [watchedAuctions, setWatchedAuctions] = useState([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const userData = useAppSelector((state) => state.user);
  const authData = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const axiosInstance = AxiosRequest().axiosInstance;
  const token = authData?.token;

  useEffect(() => {
    fetchBidderData();
  }, []);

  const fetchBidderData = async () => {
    if (!token) {
      console.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
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

      setWalletInfo(walletData);
    } catch (error) {
      console.error('Error fetching bidder data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Overview</h1>
          </div>
          <div></div>
        </header>
        <div className="bg-gradient-to-r from-[#FFF0B7] to-transparent p-6 rounded-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userData.profile_photo ? (
                <img
                  src={userData.profile_photo}
                  alt="Profile"
                  className="rounded-md w-20 h-20 object-cover"
                />
              ) : (
                <svg
                  className="rounded-md w-20 h-20 bg-white text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-gray-600 font-medium leading-none">
                Hello,
              </div>
              <div className="flex items-center">
                <h2 className="text-4xl leading-none font-bold">
                  {userData?.username || 'Guest'}
                </h2>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm font-semibold text-white bg-yellow-600 rounded-full px-2">
                  {userData?.role === 'BIDDER'
                    ? 'Bidder'
                    : userData?.role === 'SELLER'
                      ? 'Seller'
                      : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bidder Stats Cards */}
        <div className="p-6 border rounded-lg mb-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="p-4">
              <div className="text-4xl font-bold">{stats?.totalBids || 0}</div>
              <div className="text-sm text-gray-500">Total Bids</div>
            </Card>
            <Card className="p-4 border-green-300 shadow-lg shadow-green-100">
              <div className="text-4xl font-bold">
                {stats?.wonAuctions || 0}
              </div>
              <div className="text-sm text-gray-500">Won Auctions</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">{stats?.activeBids || 0}</div>
              <div className="text-sm text-gray-500">Active Bids</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">
                {watchedAuctions?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Watching</div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 border rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
          {/* Render recent bids table */}
        </div>

        {/* Watched Auctions */}
        <div className="p-6 border rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Watched Auctions</h3>
          {/* Render watched auctions */}
        </div>

        {/* Wallet Section */}
        <div className="p-6 border rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wallet</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">
                    Available Balance
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    {loading
                      ? 'Loading...'
                      : walletInfo?.amount !== undefined
                        ? `LKR ${walletInfo.amount.toLocaleString()}`
                        : 'LKR 0'}
                  </div>
                </div>
                {walletInfo?.freezeAmount !== undefined && (
                  <div>
                    <div className="text-gray-500 text-sm mb-1">
                      Frozen Amount
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      LKR {walletInfo.freezeAmount.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              {walletInfo?.updatedAt && (
                <div className="text-xs text-gray-400 mt-2">
                  Last Updated:{' '}
                  {new Date(walletInfo.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/wallet')}>
                Go to Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
