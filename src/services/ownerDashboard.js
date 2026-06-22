import api from "./api";

export const getOwnerDashboard = async () => {
  const response = await api.get("/OwnerDashboard/GetDashboard");
  return response.data;
};
