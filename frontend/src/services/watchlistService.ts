import { AxiosInstance } from 'axios';

export const getWatchList = async (
  axiosInstance: AxiosInstance,
  page = 0,
  size = 10,
) => {
  const response = await axiosInstance.get('/watchlist', {
    params: { page, size },
  });
  return response.data;
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
