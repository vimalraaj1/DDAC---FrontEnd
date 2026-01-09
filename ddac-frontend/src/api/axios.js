import axios from "axios";

// Backend API URL - must be prefixed with VITE_ to be exposed to client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('Environment check:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL + "/api",
  withCredentials: false,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
      if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
      } else {
          config.headers["Content-Type"] = "application/json";
      }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
