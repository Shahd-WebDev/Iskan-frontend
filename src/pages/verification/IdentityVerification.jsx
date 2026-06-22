import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitVerification } from "../../services/verificationService";
import { toast } from "react-toastify";
import "./IdentityVerification.css";

/**
 * IdentityVerification Page
 * Used during registration flow after email confirmation
 * Allows owners to submit their national ID and selfie for verification
 */
export default function IdentityVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, verificationStatus, updateVerificationStatus } =
    useAuth();

  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [nationalIdPreview, setNationalIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Upload

  const nationalIdInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // ======================
  // REDIRECT IF ALREADY SUBMITTED
  // Only redirect if NotSubmitted state (user already has a verification record)
  // ======================
  useEffect(() => {
    if (!verificationStatus) return;

    // If NotSubmitted, user should be here - allow the form
    if (verificationStatus === "NotSubmitted") return;

    if (verificationStatus === "Approved") {
      navigate("/owner-dashboard/dashboard", { replace: true });
    } else if (verificationStatus === "Pending") {
      navigate("/verification-pending", { replace: true });
    } else if (verificationStatus === "Rejected") {
      navigate("/verification-rejected", { replace: true });
    }
  }, [verificationStatus, navigate]);

  // ======================
  // FILE VALIDATION
  // ======================
  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file";
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return "File size must be less than 10MB";
    }
    return null;
  };

  // ======================
  // FILE HANDLERS
  // ======================
  const handleNationalIdChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors({ ...errors, nationalId: error });
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
      const error = validateFile(file);
      if (error) {
        setErrors({ ...errors, selfie: error });
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
  // SUBMIT VERIFICATION
  // ======================
  const handleSubmit = async (e) => {
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

    // Guard: ensure the user is authenticated before calling a protected endpoint.
    // SubmitVerification requires a valid JWT token.
    if (!token) {
      toast.error("You must be logged in to submit verification documents.");
      navigate("/login", { replace: true });
      setIsLoading(false);
      return;
    }

    try {
      await submitVerification(nationalIdFile, selfieFile);

      // Update verification status to Pending
      updateVerificationStatus("Pending");

      toast.success(
        "Documents submitted successfully! Your verification is under review.",
      );

      // Redirect to verification pending page
      setTimeout(() => {
        navigate("/verification-pending", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("Error submitting verification:", error);

      // Handle the specific case where a verification record already exists.
      // This can happen if the user submitted before (e.g. during a prior session)
      // but their local status was out of sync. Treat it as already-pending.
      const alreadyExists =
        error.status === 400 &&
        (error.message?.toLowerCase().includes("already exists") ||
          error.originalError?.response?.data?.errors?.some?.((e) =>
            e?.toLowerCase().includes("already exists"),
          ));

      if (alreadyExists) {
        updateVerificationStatus("Pending");
        toast.info(
          "A verification request already exists. Your documents are under review.",
        );
        setTimeout(() => {
          navigate("/verification-pending", { replace: true });
        }, 2000);
        return;
      }

      const errorMessage =
        error.message || "Failed to submit verification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="identity-verification-container">
      <div className="identity-verification-card">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Information</span>
          </div>
          <div
            className={`step-connector ${currentStep >= 2 ? "active" : ""}`}
          />
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Upload Documents</span>
          </div>
        </div>

        {/* Step 1: Information */}
        {currentStep === 1 && (
          <div className="verification-step">
            <div className="step-content">
              <h1 className="verification-title">Identity Verification</h1>
              <p className="verification-subtitle">
                Verify your identity to unlock owner features
              </p>

              <div className="verification-info-box">
                <h3>Why do we need this?</h3>
                <p>
                  We verify the identity of all property owners to ensure
                  platform security and build trust with students.
                </p>

                <h3 style={{ marginTop: "20px" }}>What you need:</h3>
                <ul className="requirements-list">
                  <li>
                    <strong>National ID:</strong> Clear photo of your national
                    identification document
                  </li>
                  <li>
                    <strong>Selfie:</strong> Clear photo of your face with good
                    lighting
                  </li>
                </ul>

                <h3 style={{ marginTop: "20px" }}>Document Requirements:</h3>
                <ul className="requirements-list">
                  <li>Clear, well-lit photos</li>
                  <li>All details must be readable</li>
                  <li>Your face must match the ID photo</li>
                  <li>Image format: PNG, JPG, or GIF</li>
                  <li>Maximum file size: 10MB per image</li>
                </ul>

                <div className="security-note">
                  <p>
                    🔒 Your documents are encrypted and secure. We process them
                    with AI verification and don't store raw copies.
                  </p>
                </div>
              </div>

              <button
                className="continue-btn"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Upload
              </button>

              <p className="skip-option">
                You can also skip this for now and verify later from your owner
                dashboard settings.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {currentStep === 2 && (
          <div className="verification-step">
            <div className="step-header">
              <button
                className="back-btn"
                onClick={() => setCurrentStep(1)}
                title="Go back"
              >
                ← Back
              </button>
              <h1 className="verification-title">Upload Your Documents</h1>
            </div>

            <form onSubmit={handleSubmit} className="verification-form">
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
                className="submit-btn"
                disabled={isLoading || !nationalIdFile || !selfieFile}
              >
                {isLoading ? "Submitting..." : "Submit Verification"}
              </button>

              <p className="verification-note">
                Your documents will be reviewed by our AI verification system
                and processed within 24-48 hours.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
7