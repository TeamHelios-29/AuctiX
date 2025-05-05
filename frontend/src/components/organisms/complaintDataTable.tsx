import { ColumnDef, Table } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { DataTableForServerSideFiltering } from '@/components/molecules/DataTableForServerSideFiltering';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@radix-ui/react-checkbox';
import { AxiosInstance } from 'axios';
import AxiosReqest from '@/services/axiosInspector';

interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profile_photo: string | null;
  role: string;
}
interface IComplaint {
  id: string;
  reportedUser: IUser;
  reportedBy: IUser;
  reason: string;
  dateReported: string;
  status: string;
}

export default function ComplaintDataTable() {
  const axiosInstance: AxiosInstance = AxiosReqest().axiosInstance;
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<null | string>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isInSearchDelay, setIsInSearchDelay] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    if (!isInSearchDelay) {
      axiosInstance
        .get('/complaints', {
          params: {
            sortby: sortBy,
            order: order,
            limit: limit,
            offset: offset,
            search: search,
          },
        })
        .then((complaintsData) => {
          setComplaints(complaintsData?.data?.content || []);
          setCurrentPage(complaintsData?.data?.pageable?.pageNumber);
          setPageCount(complaintsData?.data?.totalPages);
          setPageSize(complaintsData?.data?.size);
          console.log('Complaints Data:', complaintsData);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [sortBy, order, limit, offset, isInSearchDelay]);

  let delay = null;
  useEffect(() => {
    if (!isInSearchDelay) {
      setIsInSearchDelay(true);
      delay = setTimeout(() => {
        setOffset(0);
        setCurrentPage(0);
        setIsInSearchDelay(false);
      }, 800);
    }
  }, [search]);

  useEffect(() => {
    console.log('Complaints:', complaints);
  }, [complaints]);

  const complaintsColumns: ColumnDef<IComplaint>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'readableId',
      header: 'Report ID',
      cell: ({ row }) => <div>{row.getValue('readableId')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'reportedUser.username',
      header: 'Reported User',
      cell: ({ row }) => <div>{row.original.reportedUser.username}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'reportedBy.username',
      header: 'Reported By',
      cell: ({ row }) => <div>{row.original.reportedBy.username}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => <div>{row.getValue('reason')}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'dateReported',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              setSortBy(column.id);
              setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
            }}
          >
            Date Reported
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{new Date(row.getValue('dateReported')).toLocaleDateString()}</div>
      ),
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusStyles;
        const statusStyles = {
          PENDING: 'bg-yellow-100 text-yellow-600',
          UNDER_REVIEW: 'bg-blue-100 text-blue-600',
          RESOLVED: 'bg-green-100 text-green-600',
          REJECTED: 'bg-red-100 text-red-600',
        };

        return (
          <span
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              statusStyles[status] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {status}
          </span>
        );
      },
      enableHiding: true,
      enableGrouping: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy Username
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sample Menu Item 1</DropdownMenuItem>
              <DropdownMenuItem>Sample Menu Item 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTableForServerSideFiltering
        columns={complaintsColumns}
        data={complaints || []}
        pageCount={pageCount}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setOffset}
        setPageSize={setPageSize}
        setSearchText={setSearch}
        searchText={search}
      />
    </>
  );
}
