import { login as loginApi } from "../../services/auth";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { decodeToken } from "../../utils/decodeToken";

import "../../styles/auth.css";
import "../../styles/forgotPassword.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const { handleGoogleSuccess } = useGoogleAuth();

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

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ======================
  // SUBMIT LOGIN
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await loginApi(formData.email, formData.password);

      const token = res.token;

      if (!token) {
        toast.error("No token received ❌");
        return;
      }

      // ======================
      // SAFE decode (centralized util)
      // ======================
      const decoded = decodeToken(token);

      console.log(decoded);
console.log("decoded.role =", decoded.role);
console.log(
  "claim role =",
  decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
);

      if (!decoded) {
        toast.error("Invalid or expired token");
        return;
      }

const role =
  decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
  decoded.role ||
  "Student";
  
      const userData = {
        email: res.data?.email || formData.email,
        name: res.data?.name || "User",
        role,
        status: res.data?.status || decoded.status || null,
      };

      // ======================
      // SINGLE SOURCE OF TRUTH
      // ======================
      login(token, userData);

      toast.success("Login successful!");

      // ======================
      // NAVIGATION (UNCHANGED LOGIC)
      // ======================
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Owner") {
        navigate("/owner-dashboard/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed ❌");
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
        <p className="welcome-text">Welcome back</p>
        <h1 className="login-title">Login to your account</h1>
      </div>

      {/* Google Login */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Login Failed")}
          theme="filled_black"
          shape="rectangular"
          text="continue_with"
          size="large"
          width="300"
        />
      </div>

      {/* Divider */}
      <div className="divider">
        <hr />
        <span>Or</span>
        <hr />
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group password-wrapper">
          <label>Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>

          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        {/* Submit */}
        <button type="submit" className="auth-btn">
          Login now
        </button>
      </form>

      {/* Register */}
      <p className="register-text">
        Don’t Have An Account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}