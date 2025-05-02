import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ComplaintDataTable from '../components/organisms/complaintDataTable';
import { getAllComplaints } from '../services/complaints';
import { AxiosInstance } from 'axios';
import AxiosReqest from '@/services/axiosInspector';
import { useEffect, useState } from 'react';

export default function ComplaintReports() {
  interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profile_photo: string | null;
    role: string;
  }

  interface Complaint {
    id: string;
    reportedUser: User;
    reportedBy: User;
    reason: string;
    dateReported: string;
    status: string;
  }

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  useEffect(() => {
    getAllComplaints()
      .then((response) => {
        setComplaints(response.data);
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="p-6 max-w-6xl mx-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Complain Reports</h1>
          <p className="text-gray-500">
            View and manage reports by users on auction listings
          </p>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 shadow-none bg-gray-100">
            <div className="text-4xl font-bold">{complaints.length}</div>
            <div className="text-sm text-gray-500">Reports</div>
          </Card>
          <Card className="p-4 border-2 border-yellow-400">
            <div className="text-4xl font-bold">
              {
                complaints.filter((report) => report.status === 'PENDING')
                  .length
              }
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">
              {
                complaints.filter((report) => report.status === 'UNDER_REVIEW')
                  .length
              }
            </div>
            <div className="text-sm text-gray-500">Under Review</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">
              {
                complaints.filter((report) => report.status === 'REJECTED')
                  .length
              }
            </div>
            <div className="text-sm text-gray-500">Rejected</div>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">Manage Reports</h2>

        <div className="flex justify-between mb-4">
          <div className="relative w-full mr-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search" className="pl-8 w-full" />
          </div>
          <Button
            variant="outline"
            className="flex items-center whitespace-nowrap"
          >
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Report ID</TableHead>
              <TableHead>Reported User</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.reportedUser.username}</TableCell>
                <TableCell>{complaint.reportedBy.username}</TableCell>
                <TableCell>{complaint.reason}</TableCell>
                <TableCell>{complaint.dateReported}</TableCell>
                <TableCell>
                  <Badge
                    className={`
                      ${complaint.status === 'REJECTED' ? 'bg-red-100 text-red-600' : ''}
                      ${complaint.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-600' : ''}
                      ${complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-600' : ''}
                      ${complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : ''}
                    shadow-none`}
                  >
                    {complaint.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ComplaintDataTable />
      </div>
    </div>
  );
}
