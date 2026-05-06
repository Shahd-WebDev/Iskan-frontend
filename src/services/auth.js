import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/Authentication/Login", {
    Email: email,
    Password: password,
  });

  return response;
};