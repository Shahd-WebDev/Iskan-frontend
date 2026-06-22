import api from "./api";

// 1. Get user profile details
export const getProfile = async () => {
  const response = await api.get("/Settings/GetProfile");
  return response.data;
};

// 2. Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put("/Settings/UpdateProfile", profileData);
  return response.data;
};

// 3. Change user password
export const changePassword = async (passwordData) => {
  const response = await api.patch("/Settings/ChangePassword", passwordData);
  return response.data;
};

// 4. Get active sessions
export const getSessions = async () => {
  const response = await api.get("/Settings/GetSessions");
  return response.data;
};

// 5. Revoke a session
export const revokeSession = async (sessionId) => {
  const response = await api.delete("/Settings/RevokeSession", { params: { sessionId } });
  return response.data;
};
