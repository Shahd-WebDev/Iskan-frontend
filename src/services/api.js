import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const api = axios.create({
  //مشكله الcors
  // baseURL: "https://isskan-1.runasp.net/api",
  //لو اتحلت غير اللينك
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

export default api;