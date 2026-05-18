import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../services/auth";
import { validateField } from "../../../utils/Validation";
import { toast } from "react-toastify";

import "../../../styles/auth.css";
import "../../../styles/forgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // VALIDATION
  // ======================
  function validate() {
    const emailError = validateField("email", email);
    setError(emailError);
    return !emailError;
  }

  // ======================
  // SUBMIT
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await forgotPassword(email);
      navigate("/check-email", { state: { email } });
    } catch (err) {
      const message = err?.message || err?.errors?.[0] || "";

      if (message.toLowerCase().includes("not registered") || message.toLowerCase().includes("not found")) {
        setError("This email is not registered. Please use a valid email.");
      } else if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("deliverable")) {
        setError("Please enter a valid and active email address.");
      } else {
        setError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="text-center">
        <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />
        <h1 className="fp-title">Forgot Password?</h1>
        <p className="fp-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            id="forgot-password-email"
            className="auth-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email address"
          />
          {error && <p className="error-text">{error}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="forgot-password-submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Back to Login */}
      <p className="register-text">
        <Link to="/login">Back To Login</Link>
      </p>
    </div>
  );
}
