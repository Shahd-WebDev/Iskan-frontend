/**
 * Determines the verification status and rejection reason based on ValidationResultJson
 * @param {Object} validationResult - The ValidationResultJson object from the API
 * @returns {Object} - { status, rejectionReason, isRejectedDueToImages }
 */
export const determineVerificationStatus = (validationResult) => {
  if (!validationResult) {
    return {
      status: "Pending",
      rejectionReason: null,
      isRejectedDueToImages: false,
    };
  }

  const { ownershipVerified, flags } = validationResult;
  const hasImageFlags = flags && Array.isArray(flags) && flags.length > 0;

  // Rule 1: Both successful
  if (ownershipVerified === true && !hasImageFlags) {
    return {
      status: "Approved",
      rejectionReason: null,
      isRejectedDueToImages: false,
    };
  }

  // Rule 2: Ownership verified but images flagged
  if (ownershipVerified === true && hasImageFlags) {
    const rejectionReason = `AI Verification Failed:
The uploaded property images were flagged by image forensic analysis as potentially AI-generated, synthetic, manipulated, or not authentic representations of the actual property.
Please upload real and unedited photos of the property and submit again.`;

    return {
      status: "Rejected",
      rejectionReason,
      isRejectedDueToImages: true,
    };
  }

  // Rule 3: Ownership verification failed
  if (ownershipVerified === false && !hasImageFlags) {
    const rejectionReason = `Ownership verification failed.
The submitted ownership document could not be validated.
Please upload a valid ownership contract and try again.`;

    return {
      status: "Rejected",
      rejectionReason,
      isRejectedDueToImages: false,
    };
  }

  // Rule 4: Both conditions fail
  if (ownershipVerified === false && hasImageFlags) {
    const rejectionReason = `AI Verification Failed:

• Ownership document could not be verified.

• Uploaded property images were flagged as potentially AI-generated, manipulated, or synthetic.

Please upload a valid ownership contract and authentic property photos before resubmitting.`;

    return {
      status: "Rejected",
      rejectionReason,
      isRejectedDueToImages: true,
    };
  }

  // Fallback
  return {
    status: "Pending",
    rejectionReason: null,
    isRejectedDueToImages: false,
  };
};

/**
 * Extracts validation result from the property details API response
 * @param {Object} propertyDetails - The full property details response from the API
 * @returns {Object} - The ValidationResultJson object or null
 */
export const extractValidationResult = (propertyDetails) => {
  if (!propertyDetails) return null;

  // Try various possible paths where ValidationResultJson might be stored
  // Check in order of most likely field names
  const validationResult =
    propertyDetails.validationResultJson ||
    propertyDetails.ValidationResultJson ||
    propertyDetails.validationResult ||
    propertyDetails.ValidationResult ||
    propertyDetails.aiValidationResult ||
    propertyDetails.AiValidationResult ||
    propertyDetails.verification ||
    propertyDetails.Verification ||
    null;

  return validationResult;
};

/**
 * Enriches property object with verification status and rejection reason
 * @param {Object} property - The property object from the API
 * @returns {Object} - The enriched property object
 */
export const enrichPropertyWithVerificationData = (property) => {
  if (!property) return property;

  // First check if verificationStatus is directly in the response
  if (property.verificationStatus) {
    return {
      ...property,
      verificationStatus: property.verificationStatus,
      // If we have validationResultJson, use it to get rejection reason
      rejectionReason: null,
      isRejectedDueToImages: false,
    };
  }

  // Otherwise, compute from validationResultJson
  const validationResult = extractValidationResult(property);
  const { status, rejectionReason, isRejectedDueToImages } =
    determineVerificationStatus(validationResult);

  return {
    ...property,
    verificationStatus: status,
    rejectionReason,
    isRejectedDueToImages,
    validationResult, // Keep the raw validation result for reference
  };
};
