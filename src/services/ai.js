// services/ai.js

import api from "./api";

export const validateProperty = async (propertyId) => {
  const response = await api.post(
    `/Ai/ValidateProperty/property/validate/${propertyId}`
  );

  return response.data;
};

export const getRecommendations = async (propertyId) => {
  const response = await api.get(
    `/Ai/GetRecommendations/recommend/${propertyId}`
  );

  return response.data;
};

export const getAdminOversight = async (propertyId) => {
  const response = await api.get(
    `/Ai/GetAdminOversight/admin/oversight/${propertyId}`
  );

  return response.data;
};