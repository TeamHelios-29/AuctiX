import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AxiosRequest from '@/services/axiosInspector';
import { useNavigate } from 'react-router-dom';
// import { BarChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

type WalletInfo = {
  amount: number;
  freezeAmount: number;
  updatedAt: string;
};

type AuctionData = {
  auctionId: string;
  title: string;
  description: string;
  currentPrice: number;
  yourHighestBid: number;
  status: string;
  startTime: string;
  endTime: string;
  isLeadingBid: boolean;
  category: string;
  imagePaths: string[];
};

export default function BidderDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBids, setRecentBids] = useState<AuctionData[]>([]);
  const [watchedAuctions, setWatchedAuctions] = useState<AuctionData[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('90d');
  const userData = useAppSelector((state) => state.user);
  const authData = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const axiosInstance = AxiosRequest().axiosInstance;
  const token = authData?.token;

  // Mock chart data and config
  const chartConfig = {}; // Replace with actual config if needed
  const chartData = [
    { date: '2024-04-01', mobile: 120, desktop: 200 },
    { date: '2024-04-02', mobile: 150, desktop: 180 },
    { date: '2024-04-03', mobile: 170, desktop: 210 },
    { date: '2024-04-04', mobile: 130, desktop: 190 },
    { date: '2024-04-05', mobile: 160, desktop: 220 },
    { date: '2024-04-06', mobile: 140, desktop: 205 },
    { date: '2024-04-07', mobile: 180, desktop: 215 },
    // ...add more data as needed
  ];

  // Filter chart data based on selected time range
  const filteredData = React.useMemo(() => {
    if (timeRange === '7d') {
      return chartData.slice(-7);
    } else if (timeRange === '30d') {
      return chartData.slice(-30);
    }
    return chartData;
  }, [timeRange, chartData]);

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
      const [walletData, auctionData] = await Promise.all([
        axiosInstance
          .get('/coins/wallet-info', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => response.data)
          .catch((error) => {
            console.error('Error fetching wallet info:', error);
            return null;
          }),
        axiosInstance
          .get('/bids/my-auctions', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => response.data)
          .catch((error) => {
            console.error('Error fetching auction data:', error);
            return [];
          }),
      ]);

      setWalletInfo(walletData);

      if (auctionData && Array.isArray(auctionData)) {
        setRecentBids(auctionData.slice(0, 5));
        setWatchedAuctions(
          auctionData.filter((auction) => auction.status === 'active'),
        );

        const totalBids = auctionData.length;
        const wonAuctions = auctionData.filter(
          (auction) => auction.status === 'completed' && auction.isLeadingBid,
        ).length;
        const activeBids = auctionData.filter(
          (auction) => auction.status === 'active',
        ).length;

        setStats({ totalBids, wonAuctions, activeBids });
      }
    } catch (error) {
      console.error('Error fetching bidder data:', error);
    } finally {
      setLoading(false);
    }
  };

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
                    className="rounded-md w-20 h-20 object-cover"
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
                  onClick={() => navigate('/settings')}
                >
                  Go to Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-4 bg-gray-100 border-none">
            <div className="text-4xl font-bold">{stats?.totalBids || 0}</div>
            <div className="text-sm font-bold text-gray-500">Total Bids</div>
          </Card>
          <Card className="p-4 border-yellow-300 shadow-lg shadow-yellow-100">
            <div className="text-4xl font-bold">{stats?.wonAuctions || 0}</div>
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

        {/* Bidder Stats Cards */}
        <div className="p-6 border border-gray-200 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : recentBids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Auction</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Your Bid</th>
                    <th className="text-left py-2">Current Price</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBids.map((auction) => (
                    <tr
                      key={auction.auctionId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">
                        <div className="font-medium">{auction.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {auction.description}
                        </div>
                      </td>
                      <td className="py-3 text-sm">{auction.category}</td>
                      <td className="py-3">
                        <span
                          className={`font-semibold ${auction.isLeadingBid ? 'text-green-600' : 'text-gray-700'}`}
                        >
                          LKR {auction.yourHighestBid.toLocaleString()}
                        </span>
                        {auction.isLeadingBid && (
                          <div className="text-xs text-green-600">Leading</div>
                        )}
                      </td>
                      <td className="py-3 font-semibold">
                        LKR {auction.currentPrice.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            auction.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : auction.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {auction.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        {new Date(auction.endTime).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No recent bids found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
