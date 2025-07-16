import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpDown, Eye, EyeOff, Info, MoreHorizontal } from 'lucide-react';
import { DataTable } from '@/components/molecules/DataTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@radix-ui/react-checkbox';
import { AxiosInstance } from 'axios';
import AxiosReqest from '@/services/axiosInspector';
import UnwatchAuctionModal from '../molecules/UnwatchAuctionModal';
import {
  getWatchList,
  removeAuctionFromWatchList,
} from '@/services/watchlistService';
import { useNavigate } from 'react-router-dom';

export interface ITableWatchedAuction {
  id: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  sellerName: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  currentHighestBidAmount?: number;
  currentHighestBidderName?: string;
  bidCount: number;
}

export default function WatchListDataTable() {
  const axiosInstance: AxiosInstance = AxiosReqest().axiosInstance;
  const [watchedAuctions, setWatchedAuctions] = useState<
    ITableWatchedAuction[] | null
  >(null);
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
  const [isUnwatchModalOpen, setIsUnwatchModalOpen] = useState(false);
  const [auctionToUnwatch, setAuctionToUnwatch] =
    useState<ITableWatchedAuction | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      if (!isInSearchDelay) {
        try {
          const { data, currentPage, totalPages, size } = await getWatchList({
            axiosInstance,
            sortBy,
            order,
            limit,
            offset,
            search,
          });

          setWatchedAuctions(data);
          setCurrentPage(currentPage);
          setPageCount(totalPages);
          setPageSize(size);
        } catch (error) {
          console.error('Error fetching watchlist:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWatchlist();
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

  const sortableColumnHeader = ({
    columnId,
    label,
  }: {
    columnId: string;
    label: string;
  }) => {
    const isActive = sortBy === columnId;
    const direction = isActive ? order : undefined;

    return (
      <Button
        variant="ghost"
        onClick={() => {
          setSortBy(columnId);
          setOrder((prev) => (isActive && prev === 'asc' ? 'desc' : 'asc'));
        }}
      >
        {label}
        <ArrowUpDown
          className={`ml-2 h-4 w-4 transition-transform ${
            isActive ? (direction === 'asc' ? 'rotate-180' : '') : 'opacity-50'
          }`}
        />
      </Button>
    );
  };

  const dataColumns: ColumnDef<ITableWatchedAuction>[] = [
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
    // {
    //   accessorKey: 'images',
    //   header: '',
    //   enableSorting: false,
    //   enableHiding: true,
    //   cell: ({ row }) => {
    //     const images = row.getValue('images') as string[] | undefined;
    //     return <ImageSlider images={images || []} size={40} />;
    //   },
    // },
    {
      accessorKey: 'title',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Title',
        }),
      cell: ({ row }) => {
        const auction = row.original;
        return (
          <button
            onClick={() => navigate(`/auction-details/${auction.id}`)}
            className="font-medium text-left text-blue-600 hover:underline cursor-pointer w-full truncate"
            title={row.getValue('title')}
          >
            {row.getValue('title')}
          </button>
        );
      },

      enableSorting: true,
    },
    {
      accessorKey: 'category',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Category',
        }),
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'sellerName',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Seller',
        }),
      cell: ({ row }) => <div>{row.getValue('sellerName')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'startingPrice',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Starting Price',
        }),
      cell: ({ row }) => <div>${row.getValue('startingPrice')}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'currentHighestBidAmount',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Current Bid',
        }),
      cell: ({ row }) => (
        <div>${row.getValue('currentHighestBidAmount') || 0}</div>
      ),
      enableSorting: true,
    },
    // {
    //   accessorKey: 'currentHighestBidderName',
    //   header: 'Highest Bidder',
    //   cell: ({ row }) => (
    //     <div>{row.getValue('currentHighestBidderName') || '-'}</div>
    //   ),
    //   enableSorting: false,
    // },
    // {
    //   accessorKey: 'bidCount',
    //   header: ({ column }) =>
    //     sortableColumnHeader({
    //       columnId: column.id,
    //       label: 'Bids',
    //     }),
    //   cell: ({ row }) => <div>{row.getValue('bidCount')}</div>,
    //   enableSorting: true,
    // },
    {
      accessorKey: 'endTime',
      header: ({ column }) =>
        sortableColumnHeader({
          columnId: column.id,
          label: 'Ends In',
        }),
      cell: ({ row }) => {
        const endTime = new Date(row.getValue('endTime'));
        return <div>{endTime.toLocaleString()}</div>;
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const auction = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUnwatchClick(auction)}
            >
              <EyeOff className="h-4 w-4" />
              <span className="sr-only">Unwatch</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const offsetHandler = useCallback(
    (offset: number) => {
      setOffset(offset);
    },
    [setOffset],
  );

  const pageSizeHandler = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize);
    },
    [pageSize],
  );

  const searchHandler = useCallback(
    (search: string) => {
      setSearch(search);
    },
    [setSearch],
  );

  const confirmUnwatch = useCallback(async () => {
    if (!auctionToUnwatch) return;

    try {
      await removeAuctionFromWatchList(auctionToUnwatch.id, axiosInstance);
      setWatchedAuctions(
        (prev) => prev?.filter((a) => a.id !== auctionToUnwatch.id) || [],
      );
    } catch (error) {
      console.error('Failed to unwatch auction:', error);
    } finally {
      setIsUnwatchModalOpen(false);
      setAuctionToUnwatch(null);
    }
  }, [auctionToUnwatch]);

  const handleUnwatchClick = useCallback((auction: ITableWatchedAuction) => {
    setAuctionToUnwatch(auction);
    setIsUnwatchModalOpen(true);
  }, []);

  return (
    <>
      <div className="p-6 border rounded-lg mb-8">
        <DataTable
          columns={dataColumns}
          data={watchedAuctions}
          pageCount={pageCount}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={offsetHandler}
          setPageSize={pageSizeHandler}
          setSearchText={searchHandler}
          searchText={search}
          searchPlaceholderText="Search by Auction name"
        />
        {auctionToUnwatch && (
          <UnwatchAuctionModal
            isOpen={isUnwatchModalOpen}
            onClose={() => setIsUnwatchModalOpen(false)}
            onConfirm={confirmUnwatch}
            auctionTitle={auctionToUnwatch.title}
          />
        )}
      </div>
    </>
  );
}
