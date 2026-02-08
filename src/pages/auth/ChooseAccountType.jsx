import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout/AuthLayout";
import "../../styles/auth.css";

import { User, Building2 } from "lucide-react";

export default function ChooseAccountType() {
  const [selected, setSelected] = useState("student");
  const navigate = useNavigate();

  function handleContinue() {
    // نخزن نوع الحساب
    localStorage.setItem("accountType", selected);

    // ✅ Routing صح حسب الاختيار
    if (selected === "student") {
      navigate("/home");
    } else {
      navigate("/owner-dashboard");
    }
  }

  return (
    <AuthLayout>
      <div className="auth-container choose-page">
        {/* Logo */}
        <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />

        {/* Text فوق */}
        <p className="small-top-text">Create an account</p>
        <p className="welcome-sub">Welcome</p>

        {/* Title */}
        <h1 className="choose-title">Choose Your Account Type</h1>

        {/* Options */}
        <div className="account-options">
          {/* Student */}
          <div
            className={`account-card ${
              selected === "student" ? "active" : ""
            }`}
            onClick={() => setSelected("student")}
          >
            <div className="icon-circle">
              <User size={26} />
            </div>

            <h3>Student</h3>
            <p>I’m looking for accommodation</p>
          </div>

          {/* Owner */}
          <div
            className={`account-card ${
              selected === "owner" ? "active" : ""
            }`}
            onClick={() => setSelected("owner")}
          >
            <div className="icon-circle">
              <Building2 size={26} />
            </div>

            <h3>Owner</h3>
            <p>I want to list my property</p>
          </div>
        </div>

        {/* Continue */}
        <button className="auth-btn choose-btn" onClick={handleContinue}>
          Continue
        </button>

        {/* Login */}
        <p className="register-text">
          Don’t Have An Account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
