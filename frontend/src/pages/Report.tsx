import { ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function ComplaintReports() {
  // Sample report data
  const reports = [
    {
      id: 'R001',
      user: 'John Doe',
      reportedBy: 'Ken Wotson',
      reason: 'Fake profile',
      date: '2024-12-15',
      status: 'Listing Removed',
    },
    {
      id: 'R002',
      user: 'John Doe',
      reportedBy: 'Ken Wotson',
      reason: 'Fake profile',
      date: '2024-12-15',
      status: 'Under Review',
    },
    {
      id: 'R003',
      user: 'John Doe',
      reportedBy: 'Ken Wotson',
      reason: 'Fake profile',
      date: '2024-12-15',
      status: 'Under Review',
    },
    {
      id: 'R004',
      user: 'John Doe',
      reportedBy: 'Ken Wotson',
      reason: 'Fake profile',
      date: '2024-12-15',
      status: 'Under Review',
    },
    {
      id: 'R005',
      user: 'John Doe',
      reportedBy: 'Ken Wotson',
      reason: 'Fake profile',
      date: '2024-12-15',
      status: 'New',
    },
  ];

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
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">15</div>
            <div className="text-sm text-gray-500">Reports</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">1</div>
            <div className="text-sm text-gray-500">New Report</div>
          </Card>
          <Card className="p-4 border-2 border-yellow-400">
            <div className="text-4xl font-bold">3</div>
            <div className="text-sm text-gray-500">Under Review</div>
          </Card>
          <Card className="p-4 shadow-none">
            <div className="text-4xl font-bold">1</div>
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

        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 w-10">
                  <Checkbox />
                </th>
                <th className="text-left p-4">Report ID</th>
                <th className="text-left p-4">Reported User</th>
                <th className="text-left p-4">Reported By</th>
                <th className="text-left p-4">Reason</th>
                <th className="text-left p-4">Date Reported</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="p-4">
                    <Checkbox />
                  </td>
                  <td className="p-4">{report.id}</td>
                  <td className="p-4">{report.user}</td>
                  <td className="p-4">{report.reportedBy}</td>
                  <td className="p-4">{report.reason}</td>
                  <td className="p-4">{report.date}</td>
                  <td className="p-4">
                    <Badge
                      className={`
                      ${report.status === 'Listing Removed' ? 'bg-red-100 text-red-600' : ''}
                      ${report.status === 'Under Review' ? 'bg-blue-100 text-blue-600' : ''}
                      ${report.status === 'New' ? 'bg-green-100 text-green-600' : ''}
                    shadow-none`}
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-between items-center text-sm text-gray-500">
            <div>1 of 100 row(s) selected.</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
