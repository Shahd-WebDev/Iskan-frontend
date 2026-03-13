import React, { createContext, useContext, useState } from "react";

const ValidationContext = createContext();

export const useValidation = () => useContext(ValidationContext);

export const ValidationProvider = ({ children }) => {
  const [errors, setErrors] = useState({});

  // دالة تحقق لأي حقل
  const validateField = (name, value, countryCode = "") => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (!/^[A-Za-z\s]{3,}$/.test(value))
        error = "Name must contain letters only and at least 3 characters";
    }

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Invalid email format";
    }

    if (name === "phone") {
      if (!value) error = "Phone number is required";
      else {
        // remove non-digits & country code
        const digitsOnly = value.replace(/\D/g, "").replace(countryCode, "");
        if (digitsOnly.length < 10) error = "Phone number too short";
        else if (digitsOnly.length > 10) error = "Phone number too long";
      }
    }
    if (name === "department") {
  if (!value) error = "Please select your department";
}

if (name === "university") {
  if (!value) error = "Please select your university";
}

    // حفظ الخطأ
    setErrors((prev) => ({ ...prev, [name]: error }));

    return error === ""; // true لو صح
  };

  const validateForm = (formData) => {
    const tempErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      const countryCode = formData.countryCode || "";
      const isValid = validateField(key, value, countryCode);
      tempErrors[key] = isValid ? "" : "Invalid";
    });
    return tempErrors;
  };

  return (
    <ValidationContext.Provider value={{ errors, validateField, validateForm }}>
      {children}
    </ValidationContext.Provider>
  );
};