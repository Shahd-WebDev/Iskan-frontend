import React from "react";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import styles from "./VerificationBanner.module.css";
import { Link } from "react-router-dom";

/**
 * VerificationBanner - Shows verification status messages in the dashboard
 *
 * Displays:
 * - Pending: Banner with warning icon explaining verification is under review
 * - Rejected: Banner with error icon and link to resubmit
 * - Approved: Success message (optional, usually not shown)
 */
export default function VerificationBanner({ verificationStatus }) {
  if (verificationStatus === "Pending") {
    return (
      <div className={`${styles["verification-banner"]} ${styles["pending"]}`}>
        <div className={styles["banner-content"]}>
          <div className={styles["banner-icon"]}>
            <Clock size={24} />
          </div>

          <div className={styles["banner-text"]}>
            <h3 className={styles["banner-title"]}>
              Verification Under Review
            </h3>
            <p className={styles["banner-description"]}>
              Your identity verification is currently under review by our team.
              This typically takes 24-48 hours.
              <strong>
                {" "}
                You can view your dashboard but cannot add or edit properties
                until verification is complete.
              </strong>
            </p>
          </div>

          <Link to="/owner-dashboard/verification" className={styles["banner-action"]}>
            View Details
          </Link>
        </div>
      </div>
    );
  }

  if (verificationStatus === "Rejected") {
    return (
      <div className={`${styles["verification-banner"]} ${styles["rejected"]}`}>
        <div className={styles["banner-content"]}>
          <div className={styles["banner-icon"]}>
            <XCircle size={24} />
          </div>

          <div className={styles["banner-text"]}>
            <h3 className={styles["banner-title"]}>Verification Rejected</h3>
            <p className={styles["banner-description"]}>
              Your identity verification was rejected. Please review the
              requirements and resubmit your documents.
              <strong>
                {" "}
                You can still access your dashboard, but cannot add or edit
                properties until approved.
              </strong>
            </p>
          </div>

          <Link to="/owner-dashboard/verification" className={styles["banner-action"]}>
            Resubmit Now
          </Link>
        </div>
      </div>
    );
  }

  if (verificationStatus === "Approved") {
    return (
      <div className={`${styles["verification-banner"]} ${styles["approved"]}`}>
        <div className={styles["banner-content"]}>
          <div className={styles["banner-icon"]}>
            <CheckCircle2 size={24} />
          </div>

          <div className={styles["banner-text"]}>
            <h3 className={styles["banner-title"]}>Verification Approved</h3>
            <p className={styles["banner-description"]}>
              Your identity has been verified successfully. You now have full
              access to all owner features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
