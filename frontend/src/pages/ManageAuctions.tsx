import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ManageAuctions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center space-x"
        >
          <span className="text-xl font-bold text-gray-700">&larr;</span>{' '}
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold mb-2">Auctions</h1>
        <p className="text-gray-600">
          You can view and manage your auctions here
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { title: 'Total Auctions', count: 15 },
          { title: 'Ongoing Auction', count: 1 },
          { title: 'Upcoming Auctions', count: 3 },
          { title: 'Completed Auctions', count: 10 },
          { title: 'Canceled Auctions', count: 1 },
        ].map((item, idx) => (
          <Card key={idx} className="p-4 text-center">
            <h2 className="text-2xl font-bold">{item.count}</h2>
            <p className="text-sm text-gray-500">{item.title}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Auctions</h2>
          <Button>Add Auction +</Button>
        </div>
        <div className="flex justify-between mb-4">
          <Input type="text" placeholder="Search" className="w-1/3" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48"></DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Auction ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Start Price</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
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
                name: 'John Doe',
                start: '2024-12-15 02:21',
                end: '2024-12-15 02:21',
                startPrice: 'LKR 5000',
                currentBid: 'LKR 6000',
                status: 'Ongoing',
              },
              {
                id: 'AC001',
                name: 'John Doe',
                start: '2024-12-15 02:21',
                end: '2024-12-15 02:21',
                startPrice: 'LKR 3400',
                currentBid: '-',
                status: 'Hidden',
              },
              {
                id: 'AC001',
                name: 'John Doe',
                start: '2024-12-15 02:21',
                end: '2024-12-15 02:21',
                startPrice: 'LKR 3400',
                currentBid: '-',
                status: 'Upcoming',
              },
              {
                id: 'AC001',
                name: 'John Doe',
                start: '2024-12-15 02:21',
                end: '2024-12-15 02:21',
                startPrice: 'LKR 3400',
                currentBid: '-',
                status: 'Upcoming',
              },
              {
                id: 'AC001',
                name: 'John Doe',
                start: '2024-12-15 02:21',
                end: '2024-12-15 02:21',
                startPrice: 'LKR 3400',
                currentBid: '-',
                status: 'Upcoming',
              },
            ].map((auction, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{auction.id}</TableCell>
                <TableCell>{auction.name}</TableCell>
                <TableCell>{auction.start}</TableCell>
                <TableCell>{auction.end}</TableCell>
                <TableCell>{auction.startPrice}</TableCell>
                <TableCell>{auction.currentBid}</TableCell>
                <TableCell>
                  <Badge>{auction.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            1 of 100 row(s) selected.
          </span>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManageAuctions;
