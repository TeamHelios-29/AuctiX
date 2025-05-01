import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, MoreHorizontal, Plus, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AuctionDashboard() {
  const [activeTab, setActiveTab] = useState('all');

  // Sample auction data
  const auctions = [
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
      id: 'AC001',
      name: 'Sample',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 5000',
      currentBid: 'LKR 6000',
      status: 'Ongoing',
    },
    {
      id: 'AC001',
      name: 'Product1',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Hidden',
    },
    {
      id: 'AC001',
      name: 'Product2',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Upcoming',
    },
    {
      id: 'AC001',
      name: 'Product3',
      start: '2024-12-15 02:21',
      end: '2024-12-15 02:21',
      startPrice: 'LKR 3400',
      currentBid: '-',
      status: 'Upcoming',
    },
  ];

  // Sample data for charts
  const monthlyRevenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 4000 },
    { name: 'Sep', revenue: 4500 },
    { name: 'Oct', revenue: 5200 },
    { name: 'Nov', revenue: 6000 },
    { name: 'Dec', revenue: 7000 },
  ];

  const auctionStatusData = [
    { name: 'Ongoing', value: 3 },
    { name: 'Upcoming', value: 7 },
    { name: 'Ended', value: 2 },
    { name: 'Hidden', value: 1 },
  ];

  const bidActivityData = [
    { day: 'Mon', bids: 10 },
    { day: 'Tue', bids: 15 },
    { day: 'Wed', bids: 8 },
    { day: 'Thu', bids: 12 },
    { day: 'Fri', bids: 20 },
    { day: 'Sat', bids: 25 },
    { day: 'Sun', bids: 18 },
  ];

  const COLORS = ['#FF8C00', '#4169E1', '#DC143C', '#808080'];

  return (
    <div className="bg-white">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          </div>
          <div></div>
        </header>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="{imageUrl}"
                alt="Profile"
                className="rounded-lg w-16 h-16"
              />
            </div>
            <div>
              <div className="text-gray-500">Hello,</div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Sam Perera</h2>
                <span className="text-green-500">
                  <Check className="h-5 w-5" />
                </span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-4xl font-bold">12</div>
              <div className="text-sm text-gray-500">All</div>
            </Card>
            <Card className="p-4 border-2 border-yellow-400">
              <div className="text-4xl font-bold">3</div>
              <div className="text-sm text-gray-500">Ongoing</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">7</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </Card>
            <Card className="p-4">
              <div className="text-4xl font-bold">2</div>
              <div className="text-sm text-gray-500">Ended</div>
            </Card>
          </div>
          <Card className="p-4 border-none shadow-none">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={auctionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {auctionStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-4 border-none shadow-none">
            <h3 className="text-lg font-semibold mb-4">
              Monthly Revenue (LKR)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ecb02d"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 border-none shadow-none">
            <h3 className="text-lg font-semibold mb-4">Weekly Bid Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bidActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bids" fill="#ecb02d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mb-4 flex justify-between">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveTab('all')}>
                All
              </TabsTrigger>
              <TabsTrigger
                value="ongoing"
                onClick={() => setActiveTab('ongoing')}
              >
                Ongoing
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="ended" onClick={() => setActiveTab('ended')}>
                Ended
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search" className="pl-8 w-64" />
            </div>
            <Button className="bg-blue-950 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Auctions
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="w-[100px]">Auction ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Start Price</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auctions.map((auction, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="bg-gray-100 w-8 h-8 rounded"></div>
                </TableCell>
                <TableCell className="font-medium">{auction.id}</TableCell>
                <TableCell>{auction.name}</TableCell>
                <TableCell>{auction.start}</TableCell>
                <TableCell>{auction.end}</TableCell>
                <TableCell>{auction.startPrice}</TableCell>
                <TableCell>{auction.currentBid}</TableCell>
                <TableCell>
                  <Badge
                    className={`
                      ${auction.status === 'Ended' ? 'bg-red-100 text-red-600' : ''}
                      ${auction.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-600' : ''}
                      ${auction.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : ''}
                      ${auction.status === 'Hidden' ? 'bg-gray-100 text-gray-600' : ''}
                    shadow-none`}
                  >
                    {auction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
