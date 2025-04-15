import { ColumnDef } from '@tanstack/react-table';
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
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@radix-ui/react-checkbox';
import { AxiosInstance } from 'axios';
import AxiosReqest from '@/services/axiosInspector';

interface IProfilePhoto {
  category: string;
  id: string;
  fileName: string;
  fileType: string;
  isPublic: boolean;
}
interface ITableUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile_photo: IProfilePhoto;
}

export default function UserDataTable() {
  const axiosInstance: AxiosInstance = AxiosReqest().axiosInstance;
  const [users, setUsers] = useState<ITableUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<null | string>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/user/getUsers', {
        params: {
          sortBy: sortBy,
          order: order,
          limit: limit,
          offset: offset,
          search: search,
        },
      })
      .then((usersData) => {
        setUsers(usersData?.data?.content);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sortBy, order, limit, offset, search]);

  useEffect(() => {
    console.log('Users:', users);
  }, [users]);

  const ProfilePhoto = (id: string | null) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      if (id) {
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
          });
      }

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }, [id, axiosInstance]);

    return (
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
          <img
            src={imageUrl || '/defaultProfilePhoto.jpg'}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  };

  const userColumns: ColumnDef<ITableUser>[] = [
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
      accessorKey: 'profile_photo',
      cell: ({ row }) =>
        ProfilePhoto((row.getValue('profile_photo') as IProfilePhoto)?.id),
    },
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              setSortBy(column.id);
              setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
            }}
          >
            Username
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('username')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <div>{row.getValue('role')}</div>,
      enableHiding: true,
      enableSorting: true,
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
                onClick={() => navigator.clipboard.writeText(user.username)}
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
      <h1 className="text-center text-5xl mt-5">User Data Table</h1>
      <DataTable columns={userColumns} data={users} />
    </>
  );
}
