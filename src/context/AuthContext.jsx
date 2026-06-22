import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";
import { getMyVerification, triggerAiVerification } from "../services/verificationService";

const AuthContext = createContext();

// ======================
// STATUS NORMALIZATION HELPER
// ======================
const normalizeStatus = (status) => {
  if (!status) return null;
  const lower = status.toLowerCase();
  if (lower === "pending") return "Pending";
  if (lower === "approved") return "Approved";
  if (lower === "rejected") return "Rejected";
  if (lower === "notsubmitted") return "NotSubmitted";
  return status;
};

// ======================
// CONTEXT PROVIDER
// ======================
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => localStorage.getItem("userRole"));
  const [verificationStatus, setVerificationStatus] = useState(
    () => normalizeStatus(localStorage.getItem("verificationStatus"))
  );
  const [isLoading, setIsLoading] = useState(true);

  // ======================
  // ROLE EXTRACTOR (ONLY PLACE)
  // ======================
  const getRoleFromToken = (decoded) => {
    const claim =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    return decoded?.[claim] || decoded?.role || "Student";
  };

  // ======================
  // INIT AUTH ON APP LOAD
  // ======================
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
      logout();
      setIsLoading(false);
      return;
    }

    const userRole = getRoleFromToken(decoded);

    setRole(userRole);
    localStorage.setItem("userRole", userRole);

    setIsLoading(false);
    const initializeAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      const decoded = decodeToken(token);

      if (!decoded) {
        logout();
        setIsLoading(false);
        return;
      }

      const userRole = getRoleFromToken(decoded);

      setRole(userRole);
      localStorage.setItem("userRole", userRole);

      // Read status from localStorage (cached status)
      let currentStatus = normalizeStatus(localStorage.getItem("verificationStatus"));

      // Optional background sync with /me endpoint
      if (userRole === "Owner" || userRole === "owner") {
        try {
          const response = await getMyVerification();
          let backendStatus = normalizeStatus(response?.verificationStatus || response?.status);
          
          if (backendStatus === "Pending") {
            try {
              // Trigger AI verification immediately
              const aiResult = await triggerAiVerification();
              const isMatch = aiResult?.is_match || aiResult?.isMatch || false;
              backendStatus = isMatch ? "Approved" : "Rejected";
            } catch (aiError) {
              console.warn("Auto-trigger AI verification failed:", aiError);
            }
          }

          if (backendStatus) {
            currentStatus = backendStatus;
            localStorage.setItem("verificationStatus", backendStatus);
          }
        } catch (error) {
          console.warn("Failed to sync verification status on startup:", error);
          // If 404 (not found), then they haven't submitted yet
          if (
            error?.status === 404 ||
            error?.message?.toLowerCase().includes("not found")
          ) {
            currentStatus = "NotSubmitted";
            localStorage.setItem("verificationStatus", "NotSubmitted");
          }
        }
      }

      // If we still don't have a status for Owner, fallback to "NotSubmitted"
      if ((userRole === "Owner" || userRole === "owner") && !currentStatus) {
        currentStatus = "NotSubmitted";
        localStorage.setItem("verificationStatus", "NotSubmitted");
      }

      setVerificationStatus(currentStatus);
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  // ======================
  // LOGIN (SINGLE SOURCE OF TRUTH)
  // ======================
  const login = (newToken, userData = {}, refreshToken = null) => {
    const decoded = decodeToken(newToken);

    if (!decoded) {
      console.error("Invalid token during login");
      return;
    }

    const userRole = getRoleFromToken(decoded);

    const finalUser = {
      email: userData.email || decoded.email || "",
      name: userData.name || "User",
      role: userRole,
    };

    const rawStatus = userData.verificationStatus || userData.status || null;
    const verificationStatusFromResponse = normalizeStatus(rawStatus) || "NotSubmitted";

    setToken(newToken);
    setUser(finalUser);
    setRole(userRole);
    setVerificationStatus(verificationStatusFromResponse);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("verificationStatus", verificationStatusFromResponse);
  };

  // ======================
  // UPDATE VERIFICATION STATUS
  // ======================
  const updateVerificationStatus = (status) => {
    const normalized = normalizeStatus(status);
    setVerificationStatus(normalized);
    localStorage.setItem("verificationStatus", normalized);
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    setVerificationStatus(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("verificationStatus");
  };

  // ======================
  // CONTEXT VALUE
  // ======================
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        verificationStatus,
        login,
        logout,
        updateVerificationStatus,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================
// HOOK
// ======================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
