import AxiosRequest from '@/services/axiosInspector';

const axiosInstance = AxiosRequest().axiosInstance;

export const getWatchList = async (page = 0, size = 10) => {
  const response = await axiosInstance.get('/api/watchlist', {
    params: { page, size },
  });
  return response.data;
};

export const addActionToWatchList = async (auctionId: string) => {
  await axiosInstance.post(`/api/watchlist/${auctionId}`);
};

export const removeAuctionFromWatchList = async (auctionId: string) => {
  await axiosInstance.delete(`/api/watchlist/${auctionId}`);
};
