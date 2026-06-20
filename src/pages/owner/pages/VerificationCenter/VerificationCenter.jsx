import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../context/AuthContext";
import {
  getMyVerification,
  resubmitVerification,
  triggerAiVerification,
} from "../../../../services/verificationService";
import { toast } from "react-toastify";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
  AlertTriangle,
  Info,
} from "lucide-react";
import styles from "./VerificationCenter.module.css";

export default function VerificationCenter() {
  const { verificationStatus, updateVerificationStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState({
    status: "",
    nationalIdImageUrl: "",
    selfieImageUrl: "",
    rejectionReason: "",
  });

  // Files selected by user for replacement
  const [files, setFiles] = useState({
    nationalIdImage: null,
    selfieImage: null,
  });

  // Local object URLs for previews
  const [previews, setPreviews] = useState({
    nationalIdImage: null,
    selfieImage: null,
  });

  const frontInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  useEffect(() => {
    fetchVerificationDetails();
  }, []);

  const fetchVerificationDetails = async () => {
    setLoading(true);
    try {
      const data = await getMyVerification();

      const rawStatus =
        data?.verificationStatus || data?.status || "NotSubmitted";
      // Capitalize to match local convention
      let normalizedStatus = "NotSubmitted";
      if (rawStatus.toLowerCase() === "pending") normalizedStatus = "Pending";
      if (rawStatus.toLowerCase() === "approved") normalizedStatus = "Approved";
      if (rawStatus.toLowerCase() === "rejected") normalizedStatus = "Rejected";

      setVerificationData({
        status: normalizedStatus,
        nationalIdImageUrl: data?.nationalIdImageUrl || "",
        selfieImageUrl: data?.selfieImageUrl || "",
        rejectionReason: data?.rejectionReason || "",
      });

      // Update global context if there is a mismatch
      if (normalizedStatus && normalizedStatus !== verificationStatus) {
        updateVerificationStatus(normalizedStatus);
      }
    } catch (error) {
      console.error("Error fetching verification details:", error);
      if (
        error?.status === 404 ||
        error?.message?.toLowerCase().includes("not found")
      ) {
        setVerificationData({
          status: "NotSubmitted",
          nationalIdImageUrl: "",
          selfieImageUrl: "",
          rejectionReason: "",
        });
        updateVerificationStatus("NotSubmitted");
      } else {
        toast.error("Failed to load verification details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setFiles((prev) => ({ ...prev, [key]: file }));

    // Create local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => {
      // Clean up old preview object URL to avoid memory leak
      if (prev[key]) {
        URL.revokeObjectURL(prev[key]);
      }
      return { ...prev, [key]: previewUrl };
    });
  };

  const triggerInput = (ref) => {
    if (verificationData.status === "Approved") return;
    ref.current?.click();
  };

  const hasChanges = Object.values(files).some((file) => file !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSubmitting(true);
    try {
      await resubmitVerification({
        nationalIdImage: files.nationalIdImage,
        selfieImage: files.selfieImage,
      });

      toast.success("Verification documents updated successfully!");

      // Update global & local status to Pending
      updateVerificationStatus("Pending");
      setVerificationData((prev) => ({
        ...prev,
        status: "Pending",
        rejectionReason: "",
      }));

      // Reset local changes
      setFiles({
        nationalIdImage: null,
        selfieImage: null,
      });

      // Clear previews explicitly
      setPreviews({
        nationalIdImage: null,
        selfieImage: null,
      });

      // Immediately run AI Verification
      toast.info("Triggering AI Identity Verification check...");
      try {
        const aiResult = await triggerAiVerification();
        const isMatch = aiResult?.is_match || aiResult?.isMatch || false;
        const nationalId = aiResult?.national_id || aiResult?.nationalId || "";

        if (isMatch) {
          toast.success(
            `AI Verification succeeded! Match confirmed (ID: ${nationalId}).`,
          );
          updateVerificationStatus("Approved");
        } else {
          toast.error(
            "AI Verification failed. The document data or face did not match.",
          );
          updateVerificationStatus("Rejected");
        }
      } catch (aiErr) {
        console.warn(
          "Immediate AI trigger failed, status remains Pending:",
          aiErr,
        );
        toast.warning(
          "AI check initiated. Results will update in the background shortly.",
        );
      }

      // Re-fetch details to sync the UI with new state
      await fetchVerificationDetails();
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update verification documents.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.shimmerHeader}></div>
        <div className={styles.shimmerAlert}></div>
        <div className={styles.shimmerGrid}>
          <div className={styles.shimmerCard}></div>
          <div className={styles.shimmerCard}></div>
          <div className={styles.shimmerCard}></div>
        </div>
      </div>
    );
  }

  const { status, nationalIdImageUrl, selfieImageUrl, rejectionReason } =
    verificationData;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Identity Verification Center</h1>
          <p className={styles.subtitle}>
            Manage your KYC verification documents and track review status
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div
        className={`${styles.statusCard} ${styles[status.toLowerCase()] || styles.notsubmitted}`}
      >
        <div className={styles.statusHeader}>
          <div className={styles.statusIcon}>
            {status === "Approved" && (
              <ShieldCheck size={36} className={styles.iconApproved} />
            )}
            {status === "Pending" && (
              <Shield size={36} className={styles.iconPending} />
            )}
            {status === "Rejected" && (
              <ShieldAlert size={36} className={styles.iconRejected} />
            )}
            {status === "NotSubmitted" && (
              <ShieldAlert size={36} className={styles.iconNotSubmitted} />
            )}
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusBadgeArea}>
              <span className={styles.statusLabel}>Current Status:</span>
              <span
                className={`${styles.badge} ${styles[`badge_${status.toLowerCase()}`]}`}
              >
                {status === "NotSubmitted" ? "Not Submitted" : status}
              </span>
            </div>
            <p className={styles.statusDesc}>
              {status === "Approved" &&
                "Your profile is fully verified. You have complete access to list and lease properties."}
              {status === "Pending" &&
                "Documents are currently being verified by AI and our compliance team. This normally takes less than an hour."}
              {status === "Rejected" &&
                "There was an issue verifying your identity. Please see details below and update your documents."}
              {status === "NotSubmitted" &&
                "Please submit your verification documents to unlock listing creation and other features."}
            </p>
          </div>
        </div>

        {status === "Rejected" && rejectionReason && (
          <div className={styles.rejectionReasonBox}>
            <div className={styles.rejectionTitle}>
              <AlertTriangle size={18} />
              <span>Reason for Rejection:</span>
            </div>
            <p className={styles.rejectionText}>{rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Form and Document Cards */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.sectionTitle}>Verification Documents</h2>
        <p className={styles.sectionSubtitle}>
          {status === "Approved"
            ? "Your verified documents are listed below."
            : "Review your documents. Click any card to upload or replace it."}
        </p>

        <div className={styles.grid}>
          {/* ID Front */}
          <div
            className={`${styles.docCard} ${status === "Approved" ? styles.disabledCard : ""}`}
            onClick={() => triggerInput(frontInputRef)}
          >
            <input
              type="file"
              ref={frontInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange("nationalIdImage", e)}
              disabled={status === "Approved"}
            />
            <div className={styles.imageContainer}>
              {previews.nationalIdImage ? (
                <img
                  src={previews.nationalIdImage}
                  alt="National ID Front Preview"
                  className={styles.image}
                />
              ) : nationalIdImageUrl ? (
                <img
                  src={normalizeImageUrl(nationalIdImageUrl)}
                  alt="National ID Front"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <Upload size={32} />
                  <span>Upload ID Front</span>
                </div>
              )}
              {status !== "Approved" && (
                <div className={styles.overlay}>
                  <Upload size={20} />
                  <span>Replace Front</span>
                </div>
              )}
            </div>
            <div className={styles.docInfo}>
              <h3 className={styles.docTitle}>National ID Front</h3>
              <p className={styles.docDesc}>
                Must be clear and show your photo, full name, and document
                number.
              </p>
              {files.nationalIdImage && (
                <span className={styles.pendingUploadBadge}>Changed</span>
              )}
            </div>
          </div>

          {/* Selfie */}
          <div
            className={`${styles.docCard} ${status === "Approved" ? styles.disabledCard : ""}`}
            onClick={() => triggerInput(selfieInputRef)}
          >
            <input
              type="file"
              ref={selfieInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange("selfieImage", e)}
              disabled={status === "Approved"}
            />
            <div className={styles.imageContainer}>
              {previews.selfieImage ? (
                <img
                  src={previews.selfieImage}
                  alt="Selfie Preview"
                  className={styles.image}
                />
              ) : selfieImageUrl ? (
                <img
                  src={normalizeImageUrl(selfieImageUrl)}
                  alt="Selfie"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <Upload size={32} />
                  <span>Upload Selfie</span>
                </div>
              )}
              {status !== "Approved" && (
                <div className={styles.overlay}>
                  <Upload size={20} />
                  <span>Replace Selfie</span>
                </div>
              )}
            </div>
            <div className={styles.docInfo}>
              <h3 className={styles.docTitle}>Selfie</h3>
              <p className={styles.docDesc}>
                Make sure your face is well-lit and fully visible. No hats or
                sunglasses.
              </p>
              {files.selfieImage && (
                <span className={styles.pendingUploadBadge}>Changed</span>
              )}
            </div>
          </div>
        </div>

        {status !== "Approved" && (
          <div className={styles.actionArea}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!hasChanges || submitting}
            >
              {submitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Submitting Changes...
                </>
              ) : (
                "Save and Resubmit Verification"
              )}
            </button>
            {!hasChanges && (
              <span className={styles.noChangesHint}>
                Select at least one document image to replace before submitting.
              </span>
            )}
          </div>
        )}
      </form>

      {/* Info Block */}
      <div className={styles.infoBlock}>
        <div className={styles.infoIcon}>
          <Info size={24} />
        </div>
        <div className={styles.infoContent}>
          <h3 className={styles.infoTitle}>
            Verification Guidelines & Information
          </h3>
          <ul className={styles.infoList}>
            <li>
              Identity documents must be valid, not expired, and free of
              physical damage.
            </li>
            <li>
              Take photos in a well-lit environment and avoid camera flash
              reflections on the ID cards.
            </li>
            <li>
              All details on the document including your full name, date of
              birth, and photo must be completely legible.
            </li>
            <li>
              Our automated system checks these documents asynchronously. Status
              updates will automatically apply in the background.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
