import { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export interface IProfileUpdateData {
  bio: string;
  urls: { value: string }[];
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    number: string;
    addressLine1: string;
    addressLine2: string;
    country: string;
  };
}

export const updateProfile = async (
  profileData: IProfileUpdateData,
  axiosInstance: AxiosInstance,
) => {
  const response = await axiosInstance.post(
    `${baseURL}/user/updateProfile`,
    profileData,
  );
  return response.data;
};

export const updateProfilePhoto = async (
  file: File,
  axiosInstance: AxiosInstance,
) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post(
    `${baseURL}/user/uploadUserProfilePhoto`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
