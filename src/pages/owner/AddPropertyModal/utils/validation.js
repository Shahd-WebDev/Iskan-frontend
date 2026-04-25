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
    case "zipCode":
      if (!valueStr.trim()) error = "Zip code is required";
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
    case "taxLicense":
    case "utilityBill":
      if (!value) error = "Document is required";
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
  checkStep(1, ["propertyName", "propertyType", "streetAddress", "city", "state", "country", "zipCode", "description"]);
  
  // Step 2
  checkStep(2, ["bedrooms", "bathrooms", "sqft", "price", "availableFrom"]);
  
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
  checkStep(4, ["titleDeed", "taxLicense", "utilityBill"]);

  return { errors: newErrors, firstErrorStep };
};
