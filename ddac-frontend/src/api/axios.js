import axios from "axios";
 const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL + "/api",
  withCredentials: false,
});

export default api;
