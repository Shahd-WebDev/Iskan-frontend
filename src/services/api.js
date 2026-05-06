import axios from "axios";

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

export default api;