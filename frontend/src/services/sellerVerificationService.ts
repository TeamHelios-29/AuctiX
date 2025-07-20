import { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const getSellerVerificationStatus = async (
  axiosInstance: AxiosInstance,
) => {
  const response = await axiosInstance.get('/seller/sellerVerificationStatus');
  return response.data;
};

export const submitSellerVerificationDocuments = async (
  files: File[],
  axiosInstance: AxiosInstance,
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await axiosInstance.post(
    '/seller/submitSellerVerifications',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
