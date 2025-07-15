import { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export interface IProfileUpdateData {
  bio: string;
  urls: string[];
  firstName: string;
  lastName: string;
  address: {
    number: string;
    addressLine1: string;
    addressLine2: string;
    country: string;
  };
}

export const updateProfileInfo = async (
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

export const uploadVerificationDocs = async (
  files: File[],
  axiosInstance: AxiosInstance,
) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file);
  });

  const response = await axiosInstance.post(
    `${baseURL}/user/uploadVerificationDocs`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteProfilePhoto = async (
  username: string,
  axiosInstance: AxiosInstance,
) => {
  const response = await axiosInstance.delete(
    `${baseURL}/user/deleteUserProfilePhoto`,
    {
      params: {
        username,
      },
    },
  );
  return response.data;
};

export const updateBannerPhoto = async (
  file: File,
  axiosInstance: AxiosInstance,
) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post(
    `${baseURL}/user/uploadUserBannerPhoto`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteBannerPhoto = async (
  username: string,
  axiosInstance: AxiosInstance,
) => {
  const response = await axiosInstance.delete(
    `${baseURL}/user/deleteBannerPhoto`,
    {
      params: {
        username,
      },
    },
  );
  return response.data;
};
