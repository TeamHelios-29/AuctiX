'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for admin actions log
const mockAdminActions = [
  {
    id: 1,
    adminName: 'John Doe',
    action: 'Verified user account',
    target: 'jane.smith@example.com',
    timestamp: '2023-05-09T14:30:00Z',
    actionType: 'Verify Users',
  },
  {
    id: 2,
    adminName: 'Sarah Johnson',
    action: 'Banned user for policy violation',
    target: 'mike.brown@example.com',
    timestamp: '2023-05-09T13:15:00Z',
    actionType: 'Band Users',
  },
  {
    id: 3,
    adminName: 'Mike Brown',
    action: 'Processed refund',
    target: 'Order #38291',
    timestamp: '2023-05-09T12:45:00Z',
    actionType: 'Refund',
  },
  {
    id: 4,
    adminName: 'Jane Smith',
    action: 'Verified user account',
    target: 'alex.wilson@example.com',
    timestamp: '2023-05-08T16:20:00Z',
    actionType: 'Verify Users',
  },
  {
    id: 5,
    adminName: 'Robert Jones',
    action: 'Banned user for suspicious activity',
    target: 'sarah.johnson@example.com',
    timestamp: '2023-05-08T11:10:00Z',
    actionType: 'Band Users',
  },
  {
    id: 6,
    adminName: 'Alex Wilson',
    action: 'Verified user account',
    target: 'john.doe@example.com',
    timestamp: '2023-05-07T09:30:00Z',
    actionType: 'Verify Users',
  },
  {
    id: 7,
    adminName: 'John Doe',
    action: 'Processed refund',
    target: 'Order #42587',
    timestamp: '2023-05-07T08:45:00Z',
    actionType: 'Refund',
  },
  {
    id: 8,
    adminName: 'Sarah Johnson',
    action: 'Banned user for fraudulent activity',
    target: 'david.miller@example.com',
    timestamp: '2023-05-06T15:20:00Z',
    actionType: 'Band Users',
  },
];

type ActionType = 'Verify Users' | 'Band Users' | 'Refund' | 'all';

export function ViewAdminActionsLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionTypes, setSelectedActionTypes] = useState<ActionType[]>([
    'all',
  ]);

  const handleActionTypeChange = (actionType: ActionType) => {
    if (actionType === 'all') {
      setSelectedActionTypes(['all']);
      return;
    }

    // If "all" is currently selected and user selects a specific type
    if (selectedActionTypes.includes('all')) {
      setSelectedActionTypes([actionType]);
      return;
    }

    // Toggle the selected action type
    if (selectedActionTypes.includes(actionType)) {
      const newTypes = selectedActionTypes.filter(
        (type) => type !== actionType,
      );
      setSelectedActionTypes(newTypes.length ? newTypes : ['all']);
    } else {
      setSelectedActionTypes([...selectedActionTypes, actionType]);
    }
  };

  const filteredActions = mockAdminActions.filter((action) => {
    // Apply search filter
    const matchesSearch =
      action.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.target.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply action type filter
    const matchesType =
      selectedActionTypes.includes('all') ||
      selectedActionTypes.includes(action.actionType as ActionType);

    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Admin Action Log</CardTitle>
          <CardDescription>
            View a history of actions performed by administrators
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by admin, action, or target"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={selectedActionTypes.includes('all')}
                  onCheckedChange={() => handleActionTypeChange('all')}
                >
                  All Actions
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedActionTypes.includes('Verify Users')}
                  onCheckedChange={() => handleActionTypeChange('Verify Users')}
                >
                  Create
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedActionTypes.includes('Band Users')}
                  onCheckedChange={() => handleActionTypeChange('Band Users')}
                >
                  Update
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedActionTypes.includes('Refund')}
                  onCheckedChange={() => handleActionTypeChange('Refund')}
                >
                  Delete
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4">
              {filteredActions.length > 0 ? (
                <ul className="space-y-4">
                  {filteredActions.map((action, index) => (
                    <motion.li
                      key={action.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{action.adminName}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.action}:{' '}
                          <span className="font-medium">{action.target}</span>
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-muted-foreground">
                        {formatDate(action.timestamp)}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No actions found matching your filters
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
