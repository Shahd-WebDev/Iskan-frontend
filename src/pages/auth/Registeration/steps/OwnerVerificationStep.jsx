import { useState, useRef } from "react";
import { Upload, CheckCircle2, UserRound, Clock } from "lucide-react";
import "../../../../styles/auth.css";
import "../../../../styles/verification.css";

// ─── Single file upload slot ───────────────────────────────────────────────
function FileUploadSlot({ label, sublabel, file, onChange, id }) {
  const inputRef = useRef(null);
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="upload-slot" onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />

      {preview ? (
        <img src={preview} alt={label} className="upload-preview" />
      ) : (
        <>
          <Upload size={20} className="upload-icon" />
          <span className="upload-label">{label}</span>
          {sublabel && <span className="upload-sublabel">{sublabel}</span>}
        </>
      )}

      {file && (
        <CheckCircle2 size={14} className="upload-check" />
      )}
    </div>
  );
}

// ─── Wide file upload button (for commercial register / tax card) ──────────
function FileUploadButton({ label, file, onChange, id }) {
  const inputRef = useRef(null);

  return (
    <button
      type="button"
      className={`upload-wide-btn ${file ? "uploaded" : ""}`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />
      <Upload size={16} />
      <span>{file ? file.name : label}</span>
      {file && <CheckCircle2 size={14} className="upload-check-inline" />}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function OwnerVerificationStep({
  onSubmit,
  onBack,
  isLoading,
  apiError,
}) {
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
    commercialRegister: null,
    taxCard: null,
  });
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});

  const setFile = (key) => (file) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

  // Identity files are required; business docs are optional per the UI
  const identityReady =
    files.idFront && files.idBack && files.selfie;

  const canSubmit = identityReady && confirmed;

  const validate = () => {
    const errs = {};
    if (!files.idFront) errs.idFront = "Required";
    if (!files.idBack) errs.idBack = "Required";
    if (!files.selfie) errs.selfie = "Required";
    if (!confirmed) errs.confirmed = "You must confirm data accuracy";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(files);
  };

  return (
    <div className="auth-container verification-container">
      {/* Step indicator */}
      <div className="step-bar">
        <div className="step-bar-item completed">
          <div className="step-bar-dot completed" />
          <span>Basic Info</span>
        </div>
        <div className="step-bar-line active" />
        <div className="step-bar-item active">
          <div className="step-bar-dot active" />
          <span>Verification</span>
        </div>
      </div>

      {/* Info banner */}
      <div className="verification-banner">
        <p className="verification-banner-title">Complete Owner Verification Process</p>
        <p className="verification-banner-sub">
          For everyone's safety, please submit the following documents to
          complete the verification process.
        </p>
      </div>

      {/* ── Section 1: Identity ── */}
      <div className="verification-section">
        <h3 className="verification-section-title">
          1. Identity &amp; Security Verification
        </h3>
        <p className="verification-section-desc">
          Capture a selfie holding your personal ID card near your face. This
          practice, common in financial and secure applications, prevents forgery
          and ensures the cardholder is genuine.
        </p>

        {/* Selfie placeholder icon */}
        <div className="selfie-placeholder">
          <UserRound size={48} strokeWidth={1.2} color="#0088FF" />
        </div>

        {/* Three upload slots */}
        <div className="upload-slots-row">
          <div className="upload-slot-wrapper">
            <FileUploadSlot
              id="idFront"
              label="ID Card (Front)"
              sublabel="Click to upload (jpg, png, max)"
              file={files.idFront}
              onChange={setFile("idFront")}
            />
            {errors.idFront && (
              <p className="error-text">{errors.idFront}</p>
            )}
          </div>

          <div className="upload-slot-wrapper">
            <FileUploadSlot
              id="idBack"
              label="ID Card (Back)"
              sublabel="Click to upload (jpg, png, max)"
              file={files.idBack}
              onChange={setFile("idBack")}
            />
            {errors.idBack && (
              <p className="error-text">{errors.idBack}</p>
            )}
          </div>

          <div className="upload-slot-wrapper">
            <FileUploadSlot
              id="selfie"
              label="Selfie with ID"
              sublabel="Click to upload (jpg, png, max)"
              file={files.selfie}
              onChange={setFile("selfie")}
            />
            {errors.selfie && (
              <p className="error-text">{errors.selfie}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 2: Business ── */}
      <div className="verification-section">
        <h3 className="verification-section-title">
          2. Commercial &amp; Tax Data{" "}
          <span className="optional-badge">Optional</span>
        </h3>
        <p className="verification-section-desc">
          If the owner is a real estate marketing company or office rather than
          an individual, you must upload the Commercial Register and Tax Card.
        </p>

        <div className="upload-wide-row">
          <FileUploadButton
            id="commercialRegister"
            label="Commercial Register"
            file={files.commercialRegister}
            onChange={setFile("commercialRegister")}
          />
          <FileUploadButton
            id="taxCard"
            label="Tax Card"
            file={files.taxCard}
            onChange={setFile("taxCard")}
          />
        </div>
      </div>

      {/* ── Section 3: Confirmation ── */}
      <div className="verification-section">
        <h3 className="verification-section-title">
          3. Data Accuracy &amp; Responsibility Acknowledgment
        </h3>

        <label className="confirm-label">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span>
            I confirm the accuracy of all submitted data and documents, and I
            assume full legal responsibility for any errors.
          </span>
        </label>
        {errors.confirmed && (
          <p className="error-text">{errors.confirmed}</p>
        )}
      </div>

      {apiError && (
        <p className="error-text" style={{ textAlign: "center", marginBottom: 12 }}>
          {apiError}
        </p>
      )}

      {/* Buttons */}
      <div className="verification-actions">
        <button
          type="button"
          className="auth-btn"
          style={{ background: "#fff", color: "#333", border: "1.5px solid #D0D5DD", flex: 1 }}
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="button"
          className="auth-btn"
          style={{ flex: 2, opacity: canSubmit ? 1 : 0.6 }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}
