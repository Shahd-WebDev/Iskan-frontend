import { jwtDecode } from "jwt-decode";
import { login } from "../../services/auth";
import { useSignIn } from "../../context/SignInContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
const { login: loginContext } = useSignIn();


  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  }

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

  
     // admin api
async function handleSubmit(e) {
  e.preventDefault();

  if (!validate()) return;

  try {
    const res = await login(formData.email, formData.password);

    console.log("Login response:", res.data);

    const token = res.data.token;

if (!token) {
  alert("No token received ❌");
  return;
}

localStorage.setItem("token", token);


// 🔥 فك التوكن
const decoded = jwtDecode(token);
console.log("Decoded token:", decoded);

// 🔥 هات role من التوكن
const role =
  decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
  "Student";

// بيانات المستخدم
const userData = {
  email: res.data?.email || formData.email,
  name: res.data?.name || "User",
  role: role,
};

// حفظ في الكونتكست
loginContext(userData, role);

localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("userRole", role);

// تحديد لو أدمن
if (role === "Admin") {
  navigate("/admin/dashboard");
} else if (role === "Owner") {
  navigate("/owner-dashboard/dashboard");
} else {
  navigate("/");
}


  } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);
  console.log("DATA:", error.response?.data);

console.log("ERROR:", error);

alert("Login failed ❌");}
}
   

  return (
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
          <label>Email </label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group password-wrapper">
          <label>Password </label>

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

          {errors.password && <p className="error-text">{errors.password}</p>}
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
  );
}
