import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedOwnerRoute - Protects owner-specific routes
 *
 * BUSINESS RULES:
 * - Pending: Can access dashboard, but actions are restricted by component-level checks
 * - Approved: Full access to all owner features
 * - Rejected: Can access dashboard to see rejection & resubmit
 * - NotSubmitted: Must complete identity verification first
 *
 * Route behaviors:
 * - Not authenticated → Redirect to /login
 * - Not an owner → Redirect to /
 * - NotSubmitted → Redirect to /identity-verification
 * - Pending, Approved, Rejected → Allow dashboard access
 */
const ProtectedOwnerRoute = ({ redirectTo = "/login" }) => {
  const { role, isAuthenticated, isLoading, verificationStatus } = useAuth();

  // Show loading indicator while auth state is being verified
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Not an owner - redirect to home
  if (role !== "Owner" && role !== "owner") {
    return <Navigate to="/" replace />;
  }

  // Owner but verification status not yet resolved
  if (verificationStatus === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Resolving verification status...</span>
        </div>
      </div>
    );
  }

  // Owner but verification NOT YET submitted
  if (verificationStatus === "NotSubmitted") {
    return <Navigate to="/identity-verification" replace />;
  }

  // ========================================
  // PENDING, APPROVED, REJECTED → ALLOW ACCESS
  // Component-level checks will restrict actions
  // ========================================
  if (
    verificationStatus === "Pending" ||
    verificationStatus === "Approved" ||
    verificationStatus === "Rejected"
  ) {
    return <Outlet />;
  }

  // Fallback: If verificationStatus is missing or invalid, require verification submission
  return <Navigate to="/identity-verification" replace />;
};

export default ProtectedOwnerRoute;
