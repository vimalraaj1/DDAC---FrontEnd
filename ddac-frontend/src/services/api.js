import axios from "axios";

// Backend API URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://wellspringbackend-env.eba-y8szthex.us-east-1.elasticbeanstalk.com";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
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