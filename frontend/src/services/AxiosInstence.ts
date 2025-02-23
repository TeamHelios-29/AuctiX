import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AxiosReqest = () => {
  const navigate = useNavigate();
  // Axios instance with default configurations
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Attach token when available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        navigate('/login');
      }
      return Promise.reject(error);
    },
  );

  return { axiosInstance };
};

export default AxiosReqest;
