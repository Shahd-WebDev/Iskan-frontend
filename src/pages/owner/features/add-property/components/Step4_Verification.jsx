import React from "react";
import { CheckCircle } from "lucide-react";
import stepStyles from "../AddPropertyModalSteps.module.css";
import compStyles from "../AddPropertyModalComponents.module.css";

const Step4_Verification = ({ formData, errors, handleDocUpload }) => {
  const DocumentItem = ({ id, name, label, subtitle, error }) => {
    const isUploaded = !!(formData[name]?.fileName || formData[name]);
    const displayFileName =
      formData[name]?.fileName ||
      (typeof formData[name] === "string" ? formData[name] : "");

    return (
      <div
        className={`${stepStyles["document-upload-item"]} ${error ? stepStyles["has-error"] : ""}`}
      >
        <div className={stepStyles["doc-header"]}>
          <div>
            <h5 className={stepStyles["doc-title"]}>{label}</h5>
            <p className={stepStyles["doc-subtitle"]}>{subtitle}</p>
          </div>
          <span
            className={`${stepStyles["doc-badge"]} ${isUploaded ? stepStyles["uploaded"] : stepStyles["pending"]}`}
          >
            {isUploaded ? (
              <CheckCircle size={14} />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            )}
            {isUploaded ? "Uploaded" : "Pending"}
          </span>
        </div>
        <div
          className={`${stepStyles["photo-upload-zone"]} ${stepStyles["small-zone"]} ${isUploaded ? stepStyles["zone-success"] : error ? stepStyles["zone-error"] : ""}`}
          onClick={() => document.getElementById(id).click()}
        >
          <input
            type="file"
            id={id}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,image/jpeg,image/png,image/jpg"
            style={{ display: "none" }}
            onChange={(e) => handleDocUpload(name, e)}
          />
          <div className={stepStyles["upload-icon-wrapper"]}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={stepStyles["upload-icon"]}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className={stepStyles["upload-title"]}>
            {displayFileName || "Click to upload or drag and drop"}
          </p>
          <p className={stepStyles["upload-subtitle"]}>
            PDF, JPG, PNG (max 10MB)
          </p>
        </div>
        {error && <span className={compStyles["error-text"]}>{error}</span>}
      </div>
    );
  };

  return (
    <>
      <div className={stepStyles["verification-alert"]}>
        <h4 className={stepStyles["alert-title"]}>
          Property Verification Documents Required
        </h4>
        <p className={stepStyles["alert-desc"]}>
          Upload the following documents to verify your property. All documents
          will be reviewed by our team within 24-48 hours.
        </p>
      </div>

      <DocumentItem
        id="ownership-upload"
        name="titleDeed"
        label="Ownership Contract *"
        subtitle="Upload a signed ownership contract or official ownership document"
        error={errors.titleDeed}
      />

      <DocumentItem
        id="deed-upload"
        name="taxLicense"
        label="Title Deed (optional)"
        subtitle="Upload a clear copy of the property title deed"
        error={errors.taxLicense}
      />

      <DocumentItem
        id="utility-upload"
        name="utilityBill"
        label="Recent Utility Bill (optional)"
        subtitle="Upload a utility bill from the last 3 months"
        error={errors.utilityBill}
      />

      <div className={stepStyles["submission-note"]}>
        <p>
          <strong>Note:</strong> Once you submit, the property will be created
          and marked as "Pending" immediately. AI verification is not required
          at submission time — you can request a fast AI check later from the
          Owner Management Panel.
        </p>
      </div>
    </>
  );
};

export default Step4_Verification;
