import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Mail, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { resendConfirmation } from "../../../../services/auth";
import "../../../../styles/auth.css";
import "../../../../styles/verification.css";

export default function SuccessStep({ email, role }) {
  const navigate = useNavigate();
  const isOwner = role === "owner";
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendVerificationEmail = async () => {
    if (isSending) return;

    setIsSending(true);
    setSendError("");
    setSendSuccess(false);

    try {
      await resendConfirmation(email);
      setSendSuccess(true);
      toast.success("Verification email sent successfully. Please check your inbox.");
    } catch (err) {
      const message = err?.message || "Failed to send verification email. Please try again.";
      setSendError(message);
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

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

      <h1 className="success-title">
        {isOwner ? "Pending Approval" : "Your account has been created successfully."}
      </h1>
      <p className="success-sub">
        {isOwner
          ? "Thank you for submitting your verification documents. Your application is now under review. Please verify your email address."
          : "Please verify your email before logging in."}
      </p>

      {/* Resend verification email CTA */}
      <div className="success-resend-wrapper" style={{ margin: "24px 0", textAlign: "center" }}>
        <button
          className="auth-btn"
          disabled={isSending}
          onClick={handleSendVerificationEmail}
          style={{ minWidth: 240 }}
        >
          {isSending ? "Sending..." : "Send Verification Email"}
        </button>
        {sendError && (
          <p className="error-text" style={{ marginTop: 12 }}>
            {sendError}
          </p>
        )}
        {sendSuccess && (
          <p className="success-text" style={{ marginTop: 12, color: "#2ec4b6" }}>
            Verification email sent successfully. Please check your inbox.
          </p>
        )}
      </div>

      {/* Info cards */}
      <div className="success-info-cards">
        {isOwner ? (
          <>
            <div className="success-info-card blue">
              <div className="success-info-card-icon">
                <Clock size={18} />
              </div>
              <div className="success-info-card-body">
                <h4>Review Processing Time</h4>
                <p>Our team will review your documents and trust score within 24–48 hours.</p>
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
          </>
        ) : (
          <>
            <div className="success-info-card blue">
              <div className="success-info-card-icon">
                <Mail size={18} />
              </div>
              <div className="success-info-card-body">
                <h4>Verify Your Email Address</h4>
                <p>
                  Please click the link in the verification email sent to{" "}
                  <strong>{email}</strong> to activate your account.
                </p>
              </div>
            </div>

            <div className="success-info-card red">
              <div className="success-info-card-icon">
                <Clock size={18} />
              </div>
              <div className="success-info-card-body">
                <h4>Didn't Receive the Email?</h4>
                <p>
                  Check your junk or spam folder. If you still don't see it, you can request a new link at the login page.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA buttons */}
      {isOwner ? (
        <>
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
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </>
      ) : (
        <>
          <button
            className="auth-btn"
            style={{ marginBottom: 12 }}
            onClick={() => window.open("https://mail.google.com", "_blank")}
          >
            Open Email App
          </button>

          <button
            className="auth-btn"
            style={{ background: "#fff", color: "#333", border: "1.5px solid #D0D5DD" }}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </>
      )}
    </div>
  );
}