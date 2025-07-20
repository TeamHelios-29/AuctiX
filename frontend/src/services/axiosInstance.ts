import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      try {
        const { token } = JSON.parse(authUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth user from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (e.g., expired token)
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
