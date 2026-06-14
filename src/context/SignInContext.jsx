import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";

const SignInContext = createContext();

export const SignInProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("userRole") || "Student";
  });

  // "pending" | "approved" | null
  const [status, setStatus] = useState(() => {
    return localStorage.getItem("userStatus") || null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");
    const storedStatus = localStorage.getItem("userStatus");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setRole(storedRole);
    if (storedStatus) setStatus(storedStatus);
  }, []);

  const login = (userData, userRole, userStatus = null) => {
    setUser(userData);
    setRole(userRole);
    setStatus(userStatus);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userRole);
    if (userStatus) {
      localStorage.setItem("userStatus", userStatus);
    } else {
      localStorage.removeItem("userStatus");
    }
  };

  const logout = () => {
    setUser(null);
    setRole("Student");
    setStatus(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("token");
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  // Call after approval is confirmed (e.g. polling or notification)
  const markApproved = () => {
    setStatus("approved");
    localStorage.setItem("userStatus", "approved");
    const updatedUser = { ...user, status: "approved" };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isPending = role === "Owner" && status === "pending";

  return (
    <SignInContext.Provider
      value={{ user, role, status, isPending, login, logout, switchRole, markApproved }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export const useSignIn = () => {
  const context = useContext(SignInContext);
  if (!context) {
    throw new Error("useSignIn must be used within a SignInProvider");
  }
  return context;
};
