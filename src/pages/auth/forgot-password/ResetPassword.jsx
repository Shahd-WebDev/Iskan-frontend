import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/auth";
import { validatePassword } from "../../../utils/Validation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

import "../../../styles/auth.css";
import "../../../styles/forgotPassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token & email from URL query params
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ======================
  // INPUT HANDLER
  // ======================
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  // ======================
  // VALIDATION
  // ======================
  function validate() {
    const newErrors = {};

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ======================
  // SUBMIT
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    if (!token || !email) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        token,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });

      setSuccess(true);
    } catch (err) {
      toast.error(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // SUCCESS VIEW
  // ======================
  if (success) {
    return (
      <div className="auth-container">
        <div className="text-center">
          <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />

          <div className="fp-success-icon">
            <CheckCircle size={48} />
          </div>

          <h1 className="fp-title">Password Reset Successful!</h1>
          <p className="fp-subtitle">
            Your password has been successfully updated. You can now log in to
            your account with your new credentials.
          </p>
        </div>

        <div className="fp-actions">
          <button
            id="continue-to-login-btn"
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Continue To Login
          </button>
        </div>
      </div>
    );
  }

  // ======================
  // RESET FORM VIEW
  // ======================
  return (
    <div className="auth-container">
      {/* Logo */}
      <div className="text-center">
        <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />
        <h1 className="fp-title">Create New Password</h1>
        <p className="fp-subtitle">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="form-group password-wrapper">
          <label>New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            id="reset-new-password"
            className="auth-input"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          {errors.newPassword && (
            <p className="error-text">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group password-wrapper">
          <label>Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmNewPassword"
            id="reset-confirm-password"
            className="auth-input"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          {errors.confirmNewPassword && (
            <p className="error-text">{errors.confirmNewPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="reset-password-submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* Back to Login */}
      <p className="register-text">
        <Link to="/login">Back To Login</Link>
      </p>
    </div>
  );
}
