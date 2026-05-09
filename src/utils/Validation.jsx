
// FIELD VALIDATION
// -----------------------------
export const validateField = (name, value, countryCode = "") => {
  let error = "";

  if (name === "name") {
    if (!value.trim()) {
      error = "Name is required";
    } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
      error = "Name must contain letters only and at least 3 characters";
    }
  }

  if (name === "email") {
    if (!value) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }
  }

  if (name === "phone") {
    if (!value) {
      error = "Phone number is required";
    } else {
      const digitsOnly = value.replace(/\D/g, "").replace(countryCode, "");

      if (digitsOnly.length < 10) {
        error = "Phone number too short";
      } else if (digitsOnly.length > 10) {
        error = "Phone number too long";
      }
    }
  }

  if (name === "department") {
    if (!value) {
      error = "Please select your department";
    }
  }

  if (name === "university") {
    if (!value) {
      error = "Please select your university";
    }
  }

  return error;
};

// -----------------------------
// FORM VALIDATION (ALL FIELDS)
// -----------------------------
export const validateForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach((key) => {
    const error = validateField(
      key,
      formData[key],
      formData.countryCode || ""
    );

    errors[key] = error;
  });

  return errors;
};

// -----------------------------
// PASSWORD VALIDATION
// -----------------------------
export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[@$!%*?&#]/.test(password)) {
    return "Password must contain at least one special character (@$!%*?&#)";
  }

  return "";
};