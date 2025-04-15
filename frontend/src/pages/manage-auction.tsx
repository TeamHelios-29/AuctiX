import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

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
    id: 'AC002',
    name: 'John Doe',
    start: '2024-12-15 02:21',
    end: '2024-12-15 02:21',
    startPrice: 'LKR 5000',
    currentBid: 'LKR 6000',
    status: 'Ongoing',
  },
  {
    id: 'AC003',
    name: 'John Doe',
    start: '2024-12-15 02:21',
    end: '2024-12-15 02:21',
    startPrice: 'LKR 3400',
    currentBid: '-',
    status: 'Hidden',
  },
  {
    id: 'AC004',
    name: 'John Doe',
    start: '2024-12-15 02:21',
    end: '2024-12-15 02:21',
    startPrice: 'LKR 3400',
    currentBid: '-',
    status: 'Upcoming',
  },
];

export default function AuctionManagement() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Auctions</h1>
      <div className="flex justify-between mb-4">
        <Button onClick={() => navigate('/create-auction')}>Add Auction</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
              {auctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>{auction.id}</TableCell>
                  <TableCell>{auction.name}</TableCell>
                  <TableCell>{auction.start}</TableCell>
                  <TableCell>{auction.end}</TableCell>
                  <TableCell>{auction.startPrice}</TableCell>
                  <TableCell>{auction.currentBid}</TableCell>
                  <TableCell>{auction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
