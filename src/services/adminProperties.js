import api from "./api";

export const getPendingProperties = async (pageIndex = 1, pageSize = 5) => {
  const response = await api.get(
    `/AdminProperties/GetAllForVerification?PageIndex=${pageIndex}&PageSize=${pageSize}`
  );

  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(
    `/AdminProperties/GetProperty/${id}`
  );

  return response.data;
};