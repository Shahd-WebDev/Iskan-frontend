import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  resubmitVerification,
} from "../../services/verificationService";
import { toast } from "react-toastify";
import "./VerificationRejected.css";

export default function VerificationRejected() {
  const navigate = useNavigate();
  const { user, updateVerificationStatus } = useAuth();

  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [nationalIdPreview, setNationalIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const nationalIdInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // ======================
  // FILE HANDLERS
  // ======================
  const handleNationalIdChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, nationalId: "Please upload an image file" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors({
          ...errors,
          nationalId: "File size must be less than 10MB",
        });
        return;
      }

      setNationalIdFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNationalIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, nationalId: "" });
    }
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, selfie: "Please upload an image file" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors({ ...errors, selfie: "File size must be less than 10MB" });
        return;
      }

      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, selfie: "" });
    }
  };

  // ======================
  // REMOVE FILE
  // ======================
  const removeNationalId = () => {
    setNationalIdFile(null);
    setNationalIdPreview(null);
    if (nationalIdInputRef.current) {
      nationalIdInputRef.current.value = "";
    }
  };

  const removeSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
    if (selfieInputRef.current) {
      selfieInputRef.current.value = "";
    }
  };

  // ======================
  // SUBMIT RESUBMISSION
  // ======================
  const handleResubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!nationalIdFile) {
      newErrors.nationalId = "National ID image is required";
    }
    if (!selfieFile) {
      newErrors.selfie = "Selfie image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await resubmitVerification(nationalIdFile, selfieFile);

      // Update verification status
      updateVerificationStatus("Pending");

      toast.success("Documents resubmitted successfully! ✓");

      // Redirect to pending page
      setTimeout(() => {
        navigate("/verification-pending", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Error resubmitting verification:", error);
      const errorMessage =
        error.message || "Failed to resubmit verification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-rejected-container">
      <div className="verification-rejected-card">
        {/* Icon */}
        <div className="verification-rejected-icon">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#ff6b6b" strokeWidth="2" />
            <path
              d="M12 7v5m0 4v1"
              stroke="#ff6b6b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1" fill="#ff6b6b" />
          </svg>
        </div>

        {/* Content */}
        <div className="verification-rejected-content">
          <h1 className="verification-rejected-title">Verification Failed</h1>

          <p className="verification-rejected-subtitle">
            We couldn't verify your identity
          </p>

          <div className="verification-rejected-message">
            <p>
              Hello <strong>{user?.name || "Owner"}</strong>,
            </p>

            <p>
              Unfortunately, your identity verification was{" "}
              <strong>rejected</strong>. This could be due to:
            </p>

            <ul className="rejection-reasons">
              <li>Blurry or unclear images</li>
              <li>Documents not matching your face</li>
              <li>Incomplete or invalid documents</li>
              <li>Poor lighting in photos</li>
            </ul>

            <p>
              No worries! You can <strong>resubmit your documents</strong> and
              try again. Please ensure:
            </p>

            <ul className="tips">
              <li>Clear, well-lit photos</li>
              <li>Your face is clearly visible</li>
              <li>National ID is fully visible</li>
              <li>All details are readable</li>
            </ul>
          </div>

          {/* Form */}
          <form
            onSubmit={handleResubmit}
            className="verification-rejected-form"
          >
            {/* National ID Upload */}
            <div className="form-group">
              <label className="form-label">National ID Image *</label>
              {nationalIdPreview ? (
                <div className="preview-container">
                  <img
                    src={nationalIdPreview}
                    alt="National ID Preview"
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="preview-remove-btn"
                    onClick={removeNationalId}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="upload-area"
                  onClick={() => nationalIdInputRef.current?.click()}
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
                    <path
                      d="M12 2v14m0 0l-4-4m4 4l4-4"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="upload-text">
                    Click to upload or drag and drop
                  </p>
                  <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                ref={nationalIdInputRef}
                type="file"
                accept="image/*"
                onChange={handleNationalIdChange}
                style={{ display: "none" }}
                aria-label="Upload national ID"
              />
              {errors.nationalId && (
                <span className="form-error">{errors.nationalId}</span>
              )}
            </div>

            {/* Selfie Upload */}
            <div className="form-group">
              <label className="form-label">Selfie Image *</label>
              {selfiePreview ? (
                <div className="preview-container">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="preview-remove-btn"
                    onClick={removeSelfie}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="upload-area"
                  onClick={() => selfieInputRef.current?.click()}
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
                    <path
                      d="M12 2v14m0 0l-4-4m4 4l4-4"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="upload-text">
                    Click to upload or drag and drop
                  </p>
                  <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelfieChange}
                style={{ display: "none" }}
                aria-label="Upload selfie"
              />
              {errors.selfie && (
                <span className="form-error">{errors.selfie}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="resubmit-btn"
              disabled={isLoading || !nationalIdFile || !selfieFile}
            >
              {isLoading ? "Submitting..." : "Resubmit Verification"}
            </button>
          </form>

          <p className="verification-rejected-note">
            Your documents are important to us. We'll review them carefully.
          </p>
        </div>
      </div>
    </div>
  );
}
