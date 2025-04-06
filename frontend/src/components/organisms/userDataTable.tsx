import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
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

interface ITableUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function UserDataTable() {
  const userData: ITableUser[] = [
    {
      id: '1',
      username: 'John Doe',
      email: 'test1@test.com',
      role: 'ADMIN',
    },
    {
      id: '2',
      username: 'Jane Doe',
      email: 'test2@test.com',
      role: 'USER',
    },
    {
      id: '3',
      username: 'James Doe',
      email: 'test3@test.com',
      role: 'SELLER',
    },
  ];

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
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
      <DataTable columns={userColumns} data={userData} />
    </>
  );
}
