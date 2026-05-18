import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Mail, UserRound } from "lucide-react";
import "../../../../styles/auth.css";
import "../../../../styles/verification.css";

export default function SuccessStep({ email }) {
  const navigate = useNavigate();

  return (
    <div className="auth-container success-container">
      {/* Logo */}
      <img src="/logo.png" alt="ISKAN Logo" className="iskan-logo" />

      {/* Big title */}
      <p className="small-top-text" style={{ fontSize: 20, marginBottom: 16 }}>
        Create an account
      </p>

      {/* Animated check icon */}
      <div className="success-icon-wrapper">
        <CheckCircle2 size={72} strokeWidth={1.5} className="success-check" />
        <div className="success-badge">
          <CheckCircle2 size={12} color="#fff" />
        </div>
      </div>

      <h1 className="success-title">Application Submitted Successfully!</h1>
      <p className="success-sub">
        Thank you for submitting your verification documents. Your application
        is now under review.
      </p>

      {/* Info cards */}
      <div className="success-info-cards">
        <div className="success-info-card blue">
          <div className="success-info-card-icon">
            <Clock size={18} />
          </div>
          <div className="success-info-card-body">
            <h4>Review Processing Time</h4>
            <p>Our team will review your documents within 24–48 hours.</p>
          </div>
        </div>

        <div className="success-info-card green">
          <div className="success-info-card-icon">
            <Mail size={18} />
          </div>
          <div className="success-info-card-body">
            <h4>Email Notification</h4>
            <p>
              When the review is complete, we will send a notification to{" "}
              {email || "your email"}.
            </p>
          </div>
        </div>

        <div className="success-info-card red">
          <div className="success-info-card-icon">
            <UserRound size={18} />
          </div>
          <div className="success-info-card-body">
            <h4>Check Your Status</h4>
            <p>
              You can log in anytime to check your verification status in your
              account dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <button
        className="auth-btn"
        style={{ marginBottom: 12 }}
        onClick={() => navigate("/owner-dashboard/dashboard")}
      >
        Go to Dashboard
      </button>

      <button
        className="auth-btn"
        style={{ background: "#fff", color: "#333", border: "1.5px solid #D0D5DD" }}
        onClick={() => navigate("/register")}
      >
        Register Another Account
      </button>
    </div>
  );
}