import api from "./api";

export const getUsers = (params) =>
  api.get("/api/AdminUser/GetAll", { params });

export const blockUser = (id) =>
  api.patch(`/api/AdminUser/Block/${id}/block`);

export const deleteUser = (id) =>
  api.delete(`/api/AdminUser/Delete/${id}`);