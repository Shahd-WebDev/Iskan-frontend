import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmail, resendConfirmation } from "../../services/auth";
import { validateField } from "../../utils/Validation";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import "../../styles/auth.css";
import "../../styles/forgotPassword.css";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract query parameters
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error', 'resend-form'
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState(emailParam);
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Run confirmation on mount if query params exist
  useEffect(() => {
    if (emailParam && tokenParam) {
      handleVerify();
    } else {
      setStatus("resend-form");
    }
  }, [emailParam, tokenParam]);

  // ======================
  // VERIFY API CALL
  // ======================
  async function handleVerify() {
    setStatus("verifying");
    try {
      await confirmEmail({
        email: emailParam,
        token: tokenParam,
      });
      setStatus("success");
      toast.success("Email verified successfully!");
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Verification failed. The link may be invalid or expired.");
    }
  }

  // ======================
  // RESEND CONFIRMATION
  // ======================
  async function handleResend(e) {
    e.preventDefault();
    const emailError = validateField("email", resendEmail);
    if (emailError) {
      setResendError(emailError);
      return;
    }

    setLoading(true);
    setResendError("");
    setResendSuccess(false);

    try {
      await resendConfirmation(resendEmail);
      setResendSuccess(true);
      toast.success("Verification email resent! Please check your inbox.");
    } catch (err) {
      setResendError(err?.message || "Failed to resend confirmation email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // RENDER PATHS
  // ======================
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="text-center">
        <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />
      </div>

      {/* 1. Verifying State */}
      {status === "verifying" && (
        <div className="text-center" style={{ padding: "20px 0" }}>
          <Loader2 className="spinner" size={48} style={{ margin: "0 auto 20px", color: "#0088FF", animation: "spin 1.5s linear infinite" }} />
          <h1 className="fp-title">Confirming Email</h1>
          <p className="fp-subtitle">
            We are verifying your email address. Please hold on a moment...
          </p>
        </div>
      )}

      {/* 2. Success State */}
      {status === "success" && (
        <div className="text-center">
          <div className="success-icon-wrapper" style={{ marginBottom: 20 }}>
            <CheckCircle2 size={72} strokeWidth={1.5} className="success-check" style={{ color: "#2ec4b6" }} />
          </div>
          <h1 className="fp-title">Email Verified!</h1>
          <p className="fp-subtitle" style={{ marginBottom: 30 }}>
            Your email address has been confirmed. You can now log in and explore available accommodation.
          </p>
          <button
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </button>
        </div>
      )}

      {/* 3. Error State */}
      {status === "error" && (
        <div className="text-center">
          <div className="success-icon-wrapper" style={{ marginBottom: 20 }}>
            <XCircle size={72} strokeWidth={1.5} style={{ color: "#e63946" }} />
          </div>
          <h1 className="fp-title">Verification Failed</h1>
          <p className="fp-subtitle" style={{ color: "#d90429", fontWeight: 500 }}>
            {message || "The verification link is invalid or has expired."}
          </p>
          <p className="fp-subtitle" style={{ marginTop: 0, marginBottom: 25 }}>
            Don't worry, you can request a new verification email below.
          </p>

          <button
            className="auth-btn"
            style={{ marginBottom: 15 }}
            onClick={() => setStatus("resend-form")}
          >
            Resend Verification Email
          </button>
          <button
            className="auth-btn fp-btn-outline"
            style={{ background: "#fff", color: "#333", border: "1.5px solid #D0D5DD" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      )}

      {/* 4. Resend Form State */}
      {status === "resend-form" && (
        <div>
          <div className="text-center">
            <h1 className="fp-title">Resend Verification</h1>
            <p className="fp-subtitle">
              Enter your email address to receive a new confirmation link.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleResend}>
            {/* Email Input */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="auth-input"
                placeholder="Enter email address"
                value={resendEmail}
                onChange={(e) => {
                  setResendEmail(e.target.value);
                  setResendError("");
                  setResendSuccess(false);
                }}
                disabled={loading}
              />
              {resendError && <p className="error-text">{resendError}</p>}
              {resendSuccess && (
                <p className="success-text" style={{ color: "#2ec4b6", fontSize: "0.875rem", marginTop: 8 }}>
                  Verification link sent! Check your inbox.
                </p>
              )}
            </div>

            {/* Actions */}
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Link"}
            </button>
          </form>

          <p className="register-text" style={{ marginTop: 20 }}>
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      )}

      {/* Spinner keyframes stylesheet inject */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
