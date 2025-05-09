import { IAuthUser } from '@/types/IAuthUser';
import { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IJwtData } from '@/types/IJwtData';
import { login } from '@/store/slices/authSlice';
import { Dispatch } from '@reduxjs/toolkit';

export const getStoredAuthUser = () => {
  console.log('getStoredAuthUser called');
  let validAuthUser: IAuthUser | null = null;
  try {
    const storedAuthUser = localStorage.getItem('authUser');
    if (storedAuthUser != 'undefined' && storedAuthUser != null) {
      validAuthUser = JSON.parse(storedAuthUser) as IAuthUser;
    }
  } catch (e) {
    console.error('AuthData corrupted');
    localStorage.removeItem('authUser');
  }
  return validAuthUser;
};

export interface IRegisterUser {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'SELLER' | 'BIDDER';
}

export const registerUser = async (
  userdata: IRegisterUser,
  axiosInstance: AxiosInstance,
  dispatch: Dispatch<any>,
): Promise<IJwtData> => {
  try {
    const response = await axiosInstance.post('/auth/register', {
      email: userdata.email,
      password: userdata.password,
      username: userdata.username,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      role: userdata.role,
    });

    console.log('Registered', response);
    const token = response.data;
    console.log('token:', token);
    const decoded = jwtDecode(token) as IJwtData;
    console.log('decoded token:', decoded);

    dispatch(
      login({
        token: token,
        username: decoded.username,
        role: decoded.role,
      } as IAuthUser),
    );
    console.log('Logged in');

    return decoded;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Unknown error');
  }
};

export interface ILoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (
  credentials: ILoginCredentials,
  axiosInstance: AxiosInstance,
  dispatch: Dispatch<any>,
): Promise<IJwtData> => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const token = response.data;
    console.log('token:', token);
    const decoded = jwtDecode(token) as IJwtData;
    console.log('decoded token:', decoded);

    dispatch(
      login({
        token: token,
        username: decoded.username,
        role: decoded.role,
      } as IAuthUser),
    );

    return decoded;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'Unknown error');
  }
};
