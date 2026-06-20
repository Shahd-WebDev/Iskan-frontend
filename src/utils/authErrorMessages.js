export function getRegisterErrorMessage(error) {
  const status = error?.status;
  const data = error?.originalError?.response?.data || error?.data;

  if (data?.errorMessage) return data.errorMessage;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  if (status === 409) {
    return "The email you entered is already registered. Please use a different email or log in.";
  }

  if (status === 401) {
    return "Invalid credentials or unauthorized request.";
  }

  if (status === 400 || status === 422) {
    if (data?.errors) {
      const msgs = Object.values(data.errors)
        .flatMap((item) => (Array.isArray(item) ? item : [item]))
        .filter(Boolean);
      if (msgs.length) return msgs.join(" ");
    }
    return "Invalid registration details. Please check your input.";
  }

  return error?.message || "Registration failed.";
}

export function getLoginErrorMessage(error) {
  const status = error?.status || error?.response?.status;
  const data = error?.originalError?.response?.data || error?.data;

  if (data?.errorMessage) return data.errorMessage;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  if (status === 401) {
    return "Incorrect email or password. Please verify your credentials and try again.";
  }
  if (status === 404) {
    return "No account found with the provided email. Please register first.";
  }
  if (status === 423) {
    return "Your account is locked. Please contact support for assistance.";
  }

  return error?.message || "Login failed. Please try again later.";
}
