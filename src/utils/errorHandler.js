export const handleApiError = (error) => {
  // Prevent double normalization
  if (error && error.isNormalized) {
    return error;
  }

  let message = "Something went wrong. Please try again.";
  let status = null;
  let endpoint = "unknown";

  try {
    if (error && typeof error === "object") {
      // Log endpoint for debugging
      if (error.config) {
        endpoint = `${error.config.method?.toUpperCase() || "GET"} ${error.config.url || ""}`;
      }

      if (error.response) {
        status = error.response.status;
        const data = error.response.data;

        if (data) {
          // 1. Backend message (highest priority)
          if (data.errorMessage && typeof data.errorMessage === "string") {
            message = data.errorMessage;
          } else if (data.message && typeof data.message === "string") {
            message = data.message;
          } else if (data.title && typeof data.title === "string") {
            message = data.title;
          } else if (data.errors && typeof data.errors === "object") {
            const firstKey = Object.keys(data.errors)[0];
            const errorGroup = data.errors[firstKey];

            if (Array.isArray(errorGroup) && errorGroup.length > 0) {
              message = errorGroup[0];
            } else if (typeof errorGroup === "string") {
              message = errorGroup;
            }
          }
        }

        const hasBackendMessage = Boolean(
          data?.errorMessage || data?.message || data?.title || data?.errors
        );

        if (!hasBackendMessage) {
          switch (status) {
            case 400:
              message = "Invalid request data.";
              break;
            case 401:
              message = "Unauthorized.";
              break;
            case 403:
              message = "Not allowed.";
              break;
            case 404:
              message = "Not found.";
              break;
            case 500:
              message = "Server error.";
              break;
            default:
              break;
          }
        }
      }

      // Network error (no response)
      else if (error.request) {
        if (
          error.code === "ECONNABORTED" ||
          error.message?.toLowerCase().includes("timeout")
        ) {
          message = "Request timed out.";
        } else if (typeof navigator !== "undefined" && !navigator.onLine) {
          message = "You are offline.";
        } else {
          message = "Network error.";
        }
      }

      // JS error fallback
      else if (error.message) {
        message = error.message;
      }
    }
  } catch (e) {
    console.error("Error handler failed:", e);
    message = "Something went wrong. Please try again.";
  }

  // Normalize error object
  const normalizedError = new Error(message);
  normalizedError.status = status;
  normalizedError.isNormalized = true;
  normalizedError.originalError = error;

  // Dev logs only
  if (import.meta.env.DEV) {
    console.log(`[API ERROR] ${endpoint}`);
    console.log("Raw error:", error);
    console.log("Normalized:", normalizedError);
  }

  return normalizedError;
};