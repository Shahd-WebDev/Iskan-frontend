import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * A wrapper component to protect routes based on authentication and roles.
 * @param {Array} allowedRoles - Array of roles allowed to access the route (e.g., ["Owner", "Student"]).
 * @param {string} redirectTo - Fallback redirection if the user is not authenticated.
 */
const ProtectedRoute = ({ allowedRoles = [], redirectTo = "/login" }) => {
  const { role, isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while the token is being verified
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the user is not authenticated at all, send them to the login page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If allowedRoles is specified, ensure the user has one of the allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Determine the best redirect based on their actual role
    if (role === "Owner") {
      return <Navigate to="/owner-dashboard/dashboard" replace />;
    } else if (role === "Student") {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/" replace />; // Fallback
    }
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
