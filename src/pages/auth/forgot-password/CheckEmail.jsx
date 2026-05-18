import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { forgotPassword } from "../../../services/auth";
import { toast } from "react-toastify";

import "../../../styles/auth.css";
import "../../../styles/forgotPassword.css";

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email;

  const [resending, setResending] = useState(false);

  // Redirect if no email in state (direct URL access)
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  // ======================
  // RESEND LINK
  // ======================
  async function handleResend() {
    setResending(true);

    try {
      await forgotPassword(email);
      toast.success("Reset link sent again! Check your inbox.");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  // ======================
  // OPEN EMAIL APP
  // ======================
  function handleOpenEmail() {
    window.open("https://mail.google.com", "_blank");
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="text-center">
        <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />
        <h1 className="fp-title">Check Your Email</h1>
        <p className="fp-subtitle">
          We sent a password reset link to your email
        </p>
      </div>

      {/* Buttons */}
      <div className="fp-actions">
        <button
          id="open-email-btn"
          className="auth-btn"
          onClick={handleOpenEmail}
        >
          Open Email App
        </button>

        <button
          id="resend-link-btn"
          className="auth-btn fp-btn-outline"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Sending..." : "Resend Link"}
        </button>
      </div>

      {/* Back to Login */}
      <p className="register-text">
        Don't Have An Account?{" "}
        <Link to="/login">Back To Login</Link>
      </p>
    </div>
  );
}
