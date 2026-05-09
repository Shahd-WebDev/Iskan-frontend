import api from "./api";

export const getDashboardStats = async () => {
  const response = await api.get("/AdminDashboard/GetStats");
  return response.data;
};

export const getBookingTrends = async () => {
  const response = await api.get("/AdminDashboard/GetBookingTrends");
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get("/AdminDashboard/GetRecentActivity");
  return response.data;
};

