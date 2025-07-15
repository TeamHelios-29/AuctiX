import { ITableWatchedAuction } from '@/components/organisms/WatchListDataTable';
import { AxiosInstance } from 'axios';

interface GetWatchListParams {
  axiosInstance: AxiosInstance;
  sortBy: string | null;
  order: 'asc' | 'desc';
  limit: number;
  offset: number;
  search: string | null;
}

export const getWatchList = async ({
  axiosInstance,
  sortBy,
  order,
  limit,
  offset,
  search,
}: GetWatchListParams): Promise<{
  data: ITableWatchedAuction[];
  currentPage: number;
  totalPages: number;
  size: number;
}> => {
  const response = await axiosInstance.get('/watchlist/', {
    params: {
      sortby: sortBy,
      order: order,
      limit: limit,
      offset: offset,
      search: search,
    },
  });

  const raw = response.data.content;

  const data: ITableWatchedAuction[] = raw.map((auction: any) => ({
    id: auction.id,
    category: auction.category,
    title: auction.title,
    description: auction.description,
    images: (auction.images || []).map(getImageUrl),
    sellerName: auction.seller?.username || '',
    startingPrice: auction.startingPrice,
    startTime: auction.startTime,
    endTime: auction.endTime,
    currentHighestBidAmount: auction.currentHighestBid?.amount || 0,
    currentHighestBidderName: auction.currentHighestBid?.bidderName || '',
    bidCount: auction.bidHistory?.length || 0,
  }));

  return {
    data,
    currentPage: response.data.pageable.pageNumber,
    totalPages: response.data.totalPages,
    size: response.data.size,
  };
};

const getImageUrl = (uuid: string) => {
  return `${import.meta.env.VITE_API_URL}/auctions/getAuctionImages?file_uuid=${uuid}`;
};

export const addActionToWatchList = async (
  auctionId: string,
  axiosInstance: AxiosInstance,
) => {
  await axiosInstance.post(`/watchlist/${auctionId}`);
};

export const removeAuctionFromWatchList = async (
  auctionId: string,
  axiosInstance: AxiosInstance,
) => {
  await axiosInstance.delete(`/watchlist/${auctionId}`);
};

export const checkIfAuctionIsWatched = async (
  auctionId: string,
  axiosInstance: AxiosInstance,
) => {
  const response = await axiosInstance.get(
    `/watchlist/${auctionId}/is-watched`,
  );
  return response.data;
};
