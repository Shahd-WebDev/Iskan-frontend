const BASE_URL = "https://isskan-1.runasp.net";
const FALLBACK_IMAGE = "/img.webp";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return FALLBACK_IMAGE;

  if (/^(https?:\/\/|data:)/i.test(imagePath)) {
    return imagePath;
  }

  return `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const fallbackImage = FALLBACK_IMAGE;

