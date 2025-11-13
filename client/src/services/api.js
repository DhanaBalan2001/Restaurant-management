import axios from 'axios';

// Update this to use environment variables or detect environment
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://restaurant-management-backend-5s96.onrender.com/api'
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
// Add this to your api.js file
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);


export default api;