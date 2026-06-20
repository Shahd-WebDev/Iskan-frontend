import api from "./api";

/**
 * Submit initial identity verification with National ID and Selfie images
 * @param {File} nationalIdImage - Binary file of national ID
 * @param {File} selfieImage - Binary file of selfie
 * @returns {Promise<Object>} Response from backend
 */
export const submitVerification = async (nationalIdImage, selfieImage) => {
  const formData = new FormData();

  formData.append("nationalIdImage", nationalIdImage);
  formData.append("selfieImage", selfieImage);

  const { data } = await api.post(
    "/IdentityVerification/SubmitVerification/submit",
    formData
  );

  return data;
};

/**
 * Resubmit identity verification (when initially rejected)
 * @param {File|Object} nationalIdImage - Binary file of national ID (or options object)
 * @param {File} [selfieImage] - Binary file of selfie
 * @param {File} [nationalIdBackImage] - Binary file of back of national ID
 * @returns {Promise<Object>} Response from backend
 */
export const resubmitVerification = async (nationalIdImage, selfieImage, nationalIdBackImage) => {
  let front = nationalIdImage;
  let selfie = selfieImage;
  let back = nationalIdBackImage;

  // Handle object-based argument signature
  if (
    nationalIdImage &&
    typeof nationalIdImage === "object" &&
    !(nationalIdImage instanceof File)
  ) {
    front = nationalIdImage.nationalIdImage;
    selfie = nationalIdImage.selfieImage;
    back = nationalIdImage.nationalIdBackImage;
  }

  const formData = new FormData();
  if (front) formData.append("nationalIdImage", front);
  if (selfie) formData.append("selfieImage", selfie);
  if (back) formData.append("nationalIdBackImage", back);

  const { data } = await api.post(
    "/IdentityVerification/ResubmitVerification/resubmit",
    formData
  );

  return data;
};

/**
 * Get current verification status
 * @returns {Promise<Object>} Current verification status and details
 */
export const getMyVerification = async () => {
  const { data } = await api.get("/IdentityVerification/GetMyVerification/me");
  return data;
};

/**
 * Trigger AI identity verification directly
 * @returns {Promise<Object>} Verification result from AI
 */
export const triggerAiVerification = async () => {
  const { data } = await api.post("/Ai/VerifyIdentity/identity/verify");
  return data;
};
