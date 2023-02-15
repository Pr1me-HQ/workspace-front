import axios from 'axios';

// Create axios client, pre-configured with baseURL
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`, // https://api.example.com/api/v1
});

// Add a request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  const {
      response
  } = error;
  if (response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN')
      window.location.reload();
  }

  throw error;
});

export default axiosClient;