import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import "../../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
  });

  // ✅ Errors State
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

  // ✅ Validation Function
  function validate() {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // ✅ DOB Required
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

   // ✅ Strong Password Validation
if (formData.password.length < 8) {
  newErrors.password = "Password must be at least 8 characters";
} else if (!/[A-Z]/.test(formData.password)) {
  newErrors.password = "Password must contain at least one uppercase letter";
} else if (!/[0-9]/.test(formData.password)) {
  newErrors.password = "Password must contain at least one number";
} else if (!/[@$!%*?&#]/.test(formData.password)) {
  newErrors.password =
    "Password must contain at least one special character (@$!%*?&#)";
}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // ✅ Submit
  function handleSubmit(e) {
    e.preventDefault();

    if (validate()) {
      navigate("/choose-account");
    }
  }

  return (
    <AuthLayout>
      <div className="auth-container">
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />
          <h1 className="login-title">Create an account</h1>
        </div>

        {/* Divider */}
        <div className="divider">
          <hr />
          <span>Or</span>
          <hr />
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* First + Last */}
          <div className="two-inputs">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                className="auth-input"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="error-text">{errors.firstName}</p>
              )}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="auth-input"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* DOB */}
          <div className="form-group">
            <label>Date Of Birth *</label>
            <input
              type="date"
              name="dob"
              className="auth-input"
              value={formData.dob}
              onChange={handleChange}
            />

            {/* ✅ Error Message */}
            {errors.dob && <p className="error-text">{errors.dob}</p>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              className="auth-input"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {errors.gender && (
              <p className="error-text">{errors.gender}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Enter your email"
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
<p className="hint-text">
  Must be 8+ characters, include uppercase, number, and special character.
</p>

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

          {/* Button */}
          <button type="submit" className="auth-btn">
            Register now
          </button>
        </form>

        {/* Login */}
        <p className="register-text">
          Already Have An Account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
