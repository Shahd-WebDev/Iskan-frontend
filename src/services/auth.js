import api from "./api";

// ======================
// LOGIN
// ======================
export const login = async (email, password) => {
  try {
    const { data } = await api.post("/Authentication/Login", {
      Email: email,
      Password: password,
    });

    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// ======================
// GOOGLE REGISTER / LOGIN
// ======================
export const registerByGoogle = async (payload) => {
  try {
    // payload هيكون:
    // { idToken: "...", role: "Owner" أو "Student" }

    const { data } = await api.post(
      "/Authentication/RegisterByGoogle",
      payload
    );

    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// ======================
// FORGOT PASSWORD
// ======================
export const forgotPassword = async (email) => {
  try {
    const { data } = await api.post("/Authentication/ForgotPassword", {
      email,
    });

    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// ======================
// RESET PASSWORD
// ======================
export const resetPassword = async (payload) => {
  console.log("RESET PASSWORD API CALLED", payload);
  try {
    // payload: { email, token, newPassword, confirmNewPassword }
    const { data } = await api.post("/Authentication/ResetPassword", payload);

    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};