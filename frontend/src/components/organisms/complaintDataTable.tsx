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
import { Skeleton } from '../ui/skeleton';

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
  const [complaints, setComplaints] = useState<IComplaint[] | null>(null);
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
          setComplaints(complaintsData?.data?.content);
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

  {
    /*const ProfilePhoto = (id: string | null) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (id) {
        setIsLoading(true);
        axiosInstance
          .get(`/user/getUserProfilePhoto?file_uuid=${id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const url = URL.createObjectURL(response.data);
            setImageUrl(url);
          })
          .catch((error) => {
            console.error('Error fetching profile image:', error);
            setImageUrl(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }, [id, axiosInstance]);

    return (
      <div className="flex items-center justify-center">
        {!isLoading ? (
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
            <img
              src={imageUrl || '/defaultProfilePhoto.jpg'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <Skeleton className="h-10 w-10 rounded-full" />
        )}
      </div>
    );
  };
  */
  }

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
      accessorKey: 'reportID',
      header: 'Report ID',
      cell: ({ row }) => <div>{row.getValue('reportID')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'reportedUser',
      header: 'Reported User',
      cell: ({ row }) => <div>{row.getValue('reportedUser')}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'reportedBy',
      header: 'Reported By',
      cell: ({ row }) => <div>{row.getValue('reportedBy')}</div>,
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
      cell: ({ row }) => <div>{row.getValue('dateReported')}</div>,
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
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
      <h1 className="text-center text-5xl mt-5">All Complaints</h1>
      <DataTableForServerSideFiltering
        columns={complaintsColumns}
        data={complaints}
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
