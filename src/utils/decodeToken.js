import { jwtDecode } from "jwt-decode";

/**
 * Safely decodes JWT token and checks expiration only.
 * @param {string} token
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // Check expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token expired");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};