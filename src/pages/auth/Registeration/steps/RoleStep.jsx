import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../../../hooks/useGoogleAuth";
import "../../../../styles/auth.css";

export default function RoleStep({ onSelect, onGoogleOwnerPrefill }) {
  const [selected, setSelected] = useState("student");

  // onGoogleOwnerPrefill is passed down from Register.jsx so that when an
  // owner clicks Google on the role-selection screen, we can skip BasicInfo
  // and jump straight to OwnerDetailsStep with pre-filled name/email.
  const { handleGoogleSuccess } = useGoogleAuth({
    onOwnerNeedDetails: onGoogleOwnerPrefill,
  });

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="auth-container choose-page">
      {/* Logo */}
      <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />

      {/* Text above */}
      <p className="small-top-text">Create an account</p>
      <p className="welcome-sub">Welcome</p>

      {/* Title */}
      <h1 className="choose-title">Choose Your Account Type</h1>

      {/* Options */}
      <div className="account-options">
        {/* Student */}
        <div
          className={`account-card ${selected === "student" ? "active" : ""}`}
          onClick={() => setSelected("student")}
        >
          <div className="icon-circle">
            <User size={26} />
          </div>
          <h3>Student</h3>
          <p>I'm looking for accommodation</p>
        </div>

        {/* Owner */}
        <div
          className={`account-card ${selected === "owner" ? "active" : ""}`}
          onClick={() => setSelected("owner")}
        >
          <div className="icon-circle">
            <Building2 size={26} />
          </div>
          <h3>Owner</h3>
          <p>I want to list my property</p>
        </div>
      </div>

      <button
        className="auth-btn choose-btn"
        onClick={handleContinue}
        disabled={!selected}
      >
        Continue
      </button>

      {/* OR divider */}
      <div className="divider" style={{ margin: "16px 0" }}>
        <hr />
        <span>Or</span>
        <hr />
      </div>


      <div className="register-text" style={{ marginTop: "16px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}