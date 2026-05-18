import { validateField, validatePassword } from "../../../../utils/Validation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../../../../styles/auth.css";
import "../../../../styles/verification.css";

export default function BasicInfoStep({
  role,
  data,
  updateData,
  next,
  prev,
  isLoading,
  apiError,
}) {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    newErrors.firstName = validateField("name", data.firstName);
    newErrors.lastName = validateField("name", data.lastName);
    newErrors.email = validateField("email", data.email);
    newErrors.password = validatePassword(data.password);

    // Both roles need DOB + gender
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!data.gender) newErrors.gender = "Please select your gender";

    const filtered = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => v)
    );

    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleNext = () => {
    if (validate()) next();
  };

  const isOwner = role === "owner";

  return (
    <div className="auth-container">
      {/* Step indicator — only shown for owner (who has 2 steps) */}
      {isOwner && (
        <div className="step-bar" style={{ marginBottom: 20 }}>
          <div className="step-bar-item active">
            <div className="step-bar-dot active" />
            <span>Basic Info</span>
          </div>
          <div className="step-bar-line" />
          <div className="step-bar-item">
            <div className="step-bar-dot" />
            <span>Verification</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="login-title">Basic Information</h1>
        <p className="welcome-sub" style={{ marginBottom: "30px" }}>
          Please fill in your details
        </p>
      </div>

      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        {/* First + Last name */}
        <div className="two-inputs">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              className="auth-input"
              placeholder="First Name"
              value={data.firstName}
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
              placeholder="Last Name"
              value={data.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Date of Birth + Gender (both roles) */}
        <div className="two-inputs">
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              className="auth-input"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <p className="error-text">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select
              className="auth-input"
              name="gender"
              value={data.gender}
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
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Email Address"
            value={data.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group password-wrapper">
          <label>Password *</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="auth-input"
            placeholder="Password"
            value={data.password}
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

        {apiError && (
          <p className="error-text" style={{ textAlign: "center", marginBottom: 12 }}>
            {apiError}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            className="auth-btn"
            style={{ background: "#6c757d", flex: 1 }}
            onClick={prev}
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="button"
            className="auth-btn"
            style={{ flex: 2 }}
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLoading && !isOwner
              ? "Submitting..."
              : isOwner
              ? "Continue"
              : "Register Now"}
          </button>
        </div>
      </form>
    </div>
  );
}