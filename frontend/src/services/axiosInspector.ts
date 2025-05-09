import { IAuthUser } from '@/types/IAuthUser';
import axios from 'axios';
import { useAppSelector } from '../hooks/hooks';
import { logout } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

const AxiosRequest = () => {
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_API_URL;

  // Axios instance with default configurations
  const axiosInstance = axios.create({
    baseURL: baseURL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  const authUser: IAuthUser = useAppSelector(
    (state) => state.auth as IAuthUser,
  );
  axiosInstance.interceptors.request.use(
    (config) => {
      // Attach token when available
      if (authUser && authUser.token) {
        config.headers.Authorization = `Bearer ${authUser.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized! Redirecting to login...');
        dispatch(logout());
      }
      return Promise.reject(error);
    },
  );

  return { axiosInstance };
};

export default AxiosRequest;
