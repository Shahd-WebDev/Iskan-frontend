import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

const AuthContext = createContext();

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
  }, [token]);

  // ======================
  // LOGIN (SINGLE SOURCE OF TRUTH)
  // ======================
  const login = (newToken, userData = {}) => {
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
      status: userData.status || decoded.status || null,
    };

    setToken(newToken);
    setUser(finalUser);
    setRole(userRole);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("userRole", userRole);
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
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
        login,
        logout,
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