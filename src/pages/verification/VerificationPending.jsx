import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyVerification } from "../../services/verificationService";
import { useVerificationPolling } from "../../hooks/useVerificationPolling";
import { toast } from "react-toastify";
import "./VerificationPending.css";

/**
 * VerificationPending
 *
 * Shown after the owner submits verification documents.
 * - Polls backend every 60 seconds for status updates (useVerificationPolling)
 * - Exposes a manual "Check Status Now" button for immediate checks
 * - Does NOT auto-fetch on mount (no startup API call)
 */
export default function VerificationPending() {
  const navigate = useNavigate();
  const { verificationStatus, updateVerificationStatus, user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // ── Background polling (every 60 seconds, only while Pending) ──
  useVerificationPolling({ interval: 60000 });

  // ── Manual check triggered by user clicking the button ──
  const checkVerificationStatus = async () => {
    setIsChecking(true);
    try {
      const response = await getMyVerification();
      const newStatus = response?.verificationStatus || response?.status;

      if (newStatus) {
        updateVerificationStatus(newStatus);

        if (newStatus === "Approved") {
          toast.success("Your identity has been verified! ✓");
          setTimeout(() => {
            navigate("/owner-dashboard/dashboard", { replace: true });
          }, 2000);
        } else if (newStatus === "Rejected") {
          toast.error("Your verification was rejected. Please try again.");
          navigate("/owner-dashboard/verification", { replace: true });
        } else {
          toast.info("Your verification is still under review.");
        }
      }

      setLastChecked(new Date());
    } catch (error) {
      console.error("Error checking verification status:", error);

      if (
        error?.status === 404 ||
        error?.message?.toLowerCase().includes("not found")
      ) {
        updateVerificationStatus("NotSubmitted");
        toast.info(
          "No verification record found. Please submit your identity verification.",
        );
        navigate("/identity-verification", { replace: true });
      } else {
        toast.error("Failed to check verification status. Please try again.");
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="verification-pending-container">
      <div className="verification-pending-card">
        {/* Loading Animation */}
        <div className="verification-pending-animation">
          <div className="spinner"></div>
        </div>

        {/* Content */}
        <div className="verification-pending-content">
          <h1 className="verification-pending-title">
            Identity Verification in Progress
          </h1>

          <p className="verification-pending-subtitle">
            We're reviewing your identity documents
          </p>

          <div className="verification-pending-info">
            <p className="verification-pending-message">
              Hello <strong>{user?.name || "Owner"}</strong>,
            </p>

            <p className="verification-pending-description">
              Your identity verification is currently under review by our team.
              This process typically takes <strong>24-48 hours</strong>.
            </p>

            <div className="verification-pending-status-box">
              <h3>
                Current Status:{" "}
                <span className="status-badge pending">PENDING</span>
              </h3>
              <p>Your application is being processed.</p>
              {lastChecked && (
                <small className="last-checked">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </small>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="verification-pending-tips">
            <h4>What happens next?</h4>
            <ul>
              <li>We verify your identity documents</li>
              <li>We confirm your information matches</li>
              <li>Once approved, you can access all owner features</li>
              <li>
                You'll receive an email notification when verification is
                complete
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            className="verification-pending-refresh-btn"
            onClick={checkVerificationStatus}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Check Status Now"}
          </button>

          <p className="verification-pending-note">
            Status updates automatically every 60 seconds
          </p>
        </div>
      </div>

      {/* Support Section */}
      <div className="verification-pending-support">
        <p>
          Having trouble? <a href="/contact-support">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
