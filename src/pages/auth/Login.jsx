import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Errors
  const [errors, setErrors] = useState({});

  // تحديث القيم
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // امسح الخطأ أول ما يكتب
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  }

  // ✅ Validation
  function validate() {
    let newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // ✅ Submit
  function handleSubmit(e) {
    e.preventDefault();

    if (validate()) {
      // 🔥 بعدين هنا هنربط API Login
      navigate("/home");
    }
  }

  return (
    <AuthLayout>
      <div className="auth-container">
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />

          <p className="welcome-text">Welcome back</p>
          <h1 className="login-title">Login to your account</h1>
        </div>

        {/* Google Button */}
        <button className="google-btn" type="button">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width="18"
          />
          Google
        </button>

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
            <label>Email *</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group password-wrapper">
            <label>Password *</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="auth-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
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

          {/* Login Button */}
          <button type="submit" className="auth-btn">
            Login now
          </button>
        </form>

        {/* Register */}
        <p className="register-text">
          Don’t Have An Account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
