import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import "./AIVerificationWarning.css";

export default function AIVerificationWarning({
  rejectionReason,
  isRejectedDueToImages,
  onResubmit,
}) {
  if (!rejectionReason || !isRejectedDueToImages) return null;

  return (
    <div className="ai-verification-warning">
      <div className="warning-header">
        <AlertTriangle size={20} className="warning-icon" />
        <h3>AI Verification Failed</h3>
      </div>
      <div className="warning-content">
        <p className="warning-text">{rejectionReason}</p>
      </div>
      <div className="warning-actions">
        <button
          className="resubmit-btn"
          onClick={onResubmit}
          title="Replace images and resubmit for verification"
        >
          <RefreshCw size={16} />
          Replace Images & Resubmit
        </button>
      </div>
    </div>
  );
}
