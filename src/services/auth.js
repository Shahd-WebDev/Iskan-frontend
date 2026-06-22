import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/Authentication/Login", {
    Email: email,
    Password: password,
  });
  return data;
};

export const registerByGoogle = async (payload) => {
  const { data } = await api.post("/Authentication/RegisterByGoogle", payload);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/Authentication/ForgotPassword", { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/Authentication/ResetPassword", payload);
  return data;
};

export const register = async (formData) => {
  const { data } = await api.post("/Authentication/Register", formData);
  return data;
};

export const confirmEmail = async (payload) => {
  const { data } = await api.post("/Authentication/ConfirmEmail", payload);
  return data;
};

export const resendConfirmation = async (email) => {
  const { data } = await api.post("/Authentication/ResendConfirmation", { email });
  return data;
};
