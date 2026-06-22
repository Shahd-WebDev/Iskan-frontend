/**
 * Validates a single field based on its name and value.
 * @param {string} name - Field name
 * @param {any} value - Field value
 * @param {object} formData - Entire form data (needed for some cross-field validation)
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (name, value, formData = {}) => {
  let error = null;
  const valueStr = String(value || "");

  switch (name) {
    case "propertyName":
    case "city":
    case "state":
      if (!valueStr.trim()) error = "This field is required";
      else if (valueStr.trim().length < 3) error = "Minimum 3 characters required";
      else if (/^[\d\s]+$/.test(valueStr.trim())) error = "Cannot contain only numbers";
      break;
    case "streetAddress":
      if (!valueStr.trim()) error = "Address is required";
      else if (!formData.isLocationSelected) error = "Please select a location from the map";
      else if (valueStr.trim().length < 10) error = "Address must be at least 10 characters";
      break;
    case "country":
      if (!valueStr.trim()) error = "Required";
      break;
    case "description":
      if (!valueStr.trim()) error = "Description is required";
      else if (valueStr.trim().length < 20) error = "Minimum 20 characters required";
      break;
    case "propertyType":
      if (!valueStr) error = "Property type is required";
      break;
    case "availableFrom":
      if (!valueStr) error = "Available date is required";
      break;
    case "rooms":
    case "bedrooms":
    case "bathrooms":
    case "sqft":
    case "price":
      const num = Number(value);
      if (valueStr.trim() === "") error = "This field is required";
      else if (isNaN(num)) error = "Must be a valid number";
      else if (num <= 0) error = "Must be greater than 0";
      else if (name === "price" && num > 100000000) error = "Enter a realistic price";
      break;
    case "titleDeed":
      if (!value) error = "Document is required";
      break;
    case "utilityBill":
    case "taxLicense":
      // Optional documents
      break;
    case "firstName":
    case "lastName":
      if (!valueStr.trim()) error = "This field is required";
      else if (!/^[A-Za-z\s]+$/.test(valueStr.trim())) error = "Must contain letters only";
      break;
    case "dateOfBirth":
      if (!valueStr) error = "Date of birth is required";
      else {
        const birthDate = new Date(valueStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age < 15 || age > 100) error = "Age must be between 15 and 100 years";
      }
      break;
    case "phoneNumber":
      if (!valueStr) error = "Phone number is required";
      else if (valueStr.replace(/\D/g, "").length < 10) error = "Phone number must be at least 10 digits";
      break;
    case "currentPassword":
      if (!valueStr) error = "Current password is required";
      break;
    case "newPassword":
      if (!valueStr) error = "New password is required";
      else if (valueStr.length < 8) error = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(valueStr)) error = "Password must contain at least one uppercase letter";
      else if (!/[0-9]/.test(valueStr)) error = "Password must contain at least one number";
      else if (!/[@$!%*?&#]/.test(valueStr)) error = "Password must contain at least one special character (@$!%*?&#)";
      break;
    case "confirmPassword":
      if (!valueStr) error = "Confirm password is required";
      else if (valueStr !== formData.newPassword) error = "Passwords must match";
      break;
    default:
      break;
  }
  return error;
};

/**
 * Validates all fields in the form data.
 * @param {object} formData - Form data object
 * @param {array} selectedAmenities - List of selected amenities
 * @returns {object} - Object containing errors and the first step with an error
 */
export const validateAll = (formData, selectedAmenities = []) => {
  let newErrors = {};
  let firstErrorStep = null;

  // Helper to check fields for a step
  const checkStep = (step, fields) => {
    let stepHasError = false;
    fields.forEach(field => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
        stepHasError = true;
      }
    });
    if (stepHasError && !firstErrorStep) firstErrorStep = step;
  };

  // Step 1
  checkStep(1, ["propertyName", "propertyType", "description", "rooms", "bedrooms", "bathrooms", "price"]);
  
  // Step 2
  checkStep(2, ["streetAddress"]);
  
  // Step 3
  if (selectedAmenities.length === 0) {
    newErrors.amenities = "Please select at least one amenity";
    if (!firstErrorStep) firstErrorStep = 3;
  }
  if (formData.photos.length === 0) {
    newErrors.photos = "Please upload at least one photo";
    if (!firstErrorStep) firstErrorStep = 3;
  }

  // Step 4
  checkStep(4, ["titleDeed"]);

  return { errors: newErrors, firstErrorStep };
};
