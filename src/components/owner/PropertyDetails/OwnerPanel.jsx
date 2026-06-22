import React, { useState, useEffect } from "react";
import {
  addPropertyImages,
  getPropertyImages,
  removePropertyImage,
  removeAllImages,
  setMainImage,
  uploadPropertyDocument,
  getPropertyDocuments,
  removePropertyDocument,
  validateProperty,
} from "../../../services/ownerProperties";
import {
  Upload,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  Activity,
} from "lucide-react";
import AIVerificationWarning from "./AIVerificationWarning";
import {
  determineVerificationStatus,
  extractValidationResult,
} from "../../../utils/verificationUtils";
import "./OwnerPanel.css";
import toast from "react-hot-toast";

export default function OwnerPanel({ property, onUpdate }) {
  const [images, setImages] = useState(property.images || []);
  const [documents, setDocuments] = useState(property.documents || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [validating, setValidating] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [isRejectedDueToImages, setIsRejectedDueToImages] = useState(false);

  // Extract verification data from property on mount
  useEffect(() => {
    const verificationData = determineVerificationStatus(
      extractValidationResult(property),
    );
    setRejectionReason(verificationData.rejectionReason);
    setIsRejectedDueToImages(verificationData.isRejectedDueToImages);
  }, [property?.id]);

  const buildUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://isskan-1.runasp.net${url}`;
  };

  const normalizeArrayResponse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.documents)) return data.documents;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.documents)) return data.data.documents;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data?.items)) return data.data.items;
    return [];
  };

  const getDocumentTypeFromDoc = (doc) => doc?.documentType || doc?.type || "";

  const isUtilityBillType = (type) =>
    type === "UtilityBill" || type === "Other";

  const getNextDocumentType = (currentDocs) => {
    const hasOwnership = currentDocs.some(
      (doc) => getDocumentTypeFromDoc(doc) === "OwnershipContract",
    );
    const hasTitleDeed = currentDocs.some(
      (doc) => getDocumentTypeFromDoc(doc) === "TaxCertificate",
    );
    const hasUtilityBill = currentDocs.some((doc) =>
      isUtilityBillType(getDocumentTypeFromDoc(doc)),
    );

    if (!hasOwnership) return "OwnershipContract";
    if (!hasTitleDeed) return "TaxCertificate";
    if (!hasUtilityBill) return "UtilityBill";
    return null;
  };

  const getDocumentLabel = (type) => {
    if (type === "OwnershipContract") return "Ownership Contract";
    if (type === "TaxCertificate") return "Title Deed";
    if (type === "UtilityBill" || type === "Other") return "Utility Bill";
    return "Document";
  };

  const getDocumentLabelFromDoc = (doc) => {
    const documentType = getDocumentTypeFromDoc(doc);
    if (documentType === "OwnershipContract") return "Ownership Contract";
    if (documentType === "TaxCertificate") return "Title Deed";
    if (isUtilityBillType(documentType)) return "Utility Bill";
    return documentType || "Unknown";
  };

  const hasDocumentType = (type) =>
    documents.some((doc) => {
      const documentType = getDocumentTypeFromDoc(doc);
      return type === "UtilityBill"
        ? isUtilityBillType(documentType)
        : documentType === type;
    });

  const hasOwnershipDocument = () =>
    documents.some(
      (doc) => getDocumentTypeFromDoc(doc) === "OwnershipContract",
    );

  const loadImages = async () => {
    if (!property?.id) return;
    setLoadingImages(true);
    try {
      const data = await getPropertyImages(property.id);
      setImages(normalizeArrayResponse(data));
    } catch (err) {
      console.error("Failed to load property images:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  const loadDocuments = async () => {
    if (!property?.id) return;
    setLoadingDocuments(true);
    try {
      const data = await getPropertyDocuments(property.id);
      setDocuments(normalizeArrayResponse(data));
    } catch (err) {
      console.error("Failed to load property documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadImages();
    loadDocuments();
  }, [property.id]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("Images", files[i]);
    }

    try {
      setUploadingImage(true);
      await addPropertyImages(property.id, formData);
      toast.success("Images uploaded successfully");
      await loadImages();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImage(false);
      e.target.value = null; // reset input
    }
  };

  const handleRemoveImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await removePropertyImage(imageId);
      toast.success("Image removed");
      await loadImages();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove image");
    }
  };

  const handleRemoveAllImages = async () => {
    if (!window.confirm("Delete all property images? This cannot be undone."))
      return;
    try {
      await removeAllImages(property.id);
      toast.success("All images removed");
      setImages([]);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove all images");
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      await setMainImage(property.id, imageId);
      toast.success("Cover image updated");
      await loadImages();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set cover image");
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/csv",
      "application/rtf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid document file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, RTF, JPG, PNG.",
      );
      e.target.value = null;
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Document must be under 10MB.");
      e.target.value = null;
      return;
    }

    const nextDocumentType = getNextDocumentType(documents);
    if (!nextDocumentType) {
      toast.error(
        "All verification document slots are filled. Remove a document to upload a replacement.",
      );
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append("Document", file);
    formData.append(
      "DocumentType",
      nextDocumentType === "UtilityBill" ? "Other" : nextDocumentType,
    );

    try {
      setUploadingDoc(true);
      await uploadPropertyDocument(property.id, formData);
      toast.success("Document uploaded successfully");
      await loadDocuments();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload document");
    } finally {
      setUploadingDoc(false);
      e.target.value = null;
    }
  };

  const handleRemoveDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    try {
      await removePropertyDocument(documentId);
      toast.success("Document removed");
      await loadDocuments();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove document");
    }
  };

  const handleTriggerValidation = async () => {
    if (!hasOwnershipDocument()) {
      toast.error(
        "AI validation cannot be submitted until an ownership contract is uploaded.",
      );
      return;
    }

    try {
      setValidating(true);
      toast.success("Validation started");
      await validateProperty(property.id);
      toast.success("AI Validation triggered successfully!");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to trigger validation");
    } finally {
      setValidating(false);
    }
  };

  const handleResubmitWithNewImages = async () => {
    // Alert the user to upload new images first
    toast.error(
      "Please upload replacement images using the Images Management section above.",
    );
    // Scroll to images section
    const imagesSection = document.querySelector(".owner-panel-card");
    if (imagesSection) {
      imagesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openImagePreview = (url) => {
    if (!url) return;
    setPreviewImage(url);
  };

  const closeImagePreview = () => setPreviewImage(null);

  // Safely parse validationResultJson — comes from API as string or object
  const rawValResult =
    property.validationResultJson ||
    property.ValidationResultJson ||
    property.validationResult ||
    property.ValidationResult ||
    extractValidationResult(property);

  let validationResult = null;
  if (rawValResult) {
    if (typeof rawValResult === "object") {
      validationResult = rawValResult;
    } else {
      try {
        validationResult = JSON.parse(rawValResult);
      } catch (e) {
        console.error("Failed to parse validationResultJson:", e);
      }
    }
  }

  // hasAiResult — true only when there is an actual AI analysis result
  const hasAiResult = validationResult !== null;

  const ownershipVerified = validationResult?.ownership_verified ?? validationResult?.ownershipVerified;
  const imageForensicsFlags = validationResult?.image_forensics_flags ?? validationResult?.imageForensicsFlags;
  const extraFlags = validationResult?.Flags ?? validationResult?.flags;

  // Fraud score: prefer from validationResult, then top-level property fields
  const fraudScore =
    validationResult?.fraudScore ??
    validationResult?.fraud_score ??
    property?.fraudScore ??
    property?.fraud_score ??
    null;

  // Trust score: top-level trustScoreJson from API, or inside validationResult
  let trustScore = null;
  if (property?.trustScoreJson) {
    try {
      const ts = typeof property.trustScoreJson === "object"
        ? property.trustScoreJson
        : JSON.parse(property.trustScoreJson);
      trustScore = ts?.score ?? ts?.trustScore ?? ts?.trust_score ?? ts;
    } catch (_) {
      trustScore = null;
    }
  }
  if (trustScore === null) {
    trustScore =
      validationResult?.trustScore ??
      validationResult?.trust_score ??
      property?.trustScore ??
      property?.trust_score ??
      null;
  }

  // Forensics flags mapping
  let forensicsFlagsList = [];
  if (imageForensicsFlags) {
    if (Array.isArray(imageForensicsFlags)) {
      forensicsFlagsList = imageForensicsFlags;
    } else if (typeof imageForensicsFlags === "object") {
      forensicsFlagsList = Object.entries(imageForensicsFlags)
        .filter(([_, val]) => val === true || val === "true" || String(val).toLowerCase() === "true")
        .map(([key]) => key);
    }
  }
  const hasForensicsFlags = forensicsFlagsList.length > 0;

  // Extra flags mapping
  let extraFlagsList = [];
  if (extraFlags && Array.isArray(extraFlags)) {
    extraFlagsList = extraFlags;
  }
  const hasExtraFlags = extraFlagsList.length > 0;

  // Ownership status display — 4 cases
  const verStatus = property.verificationStatus;
  const renderOwnershipStatus = () => {
    // Case A: AI result exists — use it
    if (hasAiResult) {
      if (ownershipVerified === true) {
        return <span style={{ color: "#166534", fontWeight: "600" }}>✓ Ownership Verified by AI</span>;
      } else if (ownershipVerified === false) {
        return <span style={{ color: "#991b1b", fontWeight: "600" }}>✗ Ownership Verification Failed</span>;
      }
      return <span style={{ color: "#854d0e" }}>⚠ Ownership Verification Pending</span>;
    }
    // Case B: No AI result + Admin approved
    if (verStatus === "Approved") {
      return (
        <span style={{ color: "#166534", fontWeight: "600" }}>
          ✓ Property reviewed and approved by Admin
        </span>
      );
    }
    // Case D: Rejected
    if (verStatus === "Rejected") {
      return <span style={{ color: "#991b1b", fontWeight: "600" }}>✗ Property Rejected</span>;
    }
    // Case C: Pending
    return <span style={{ color: "#854d0e" }}>⚠ Ownership Verification Pending</span>;
  };

  return (
    <div className="owner-panel-container">
      <div className="owner-panel-header">
        <h2 className="owner-panel-title">Owner Management Panel</h2>
        <span
          className={`status-badge ${property.verificationStatus?.toLowerCase()}`}
        >
          {property.verificationStatus || "Pending"}
        </span>
      </div>

      <div className="owner-panel-grid">
        {/* Images Management */}
        <div className="owner-panel-card">
          <div className="card-header">
            <ImageIcon size={20} />
            <h3>Images Management</h3>
          </div>
          <div className="card-content">
            <div className="upload-btn-wrapper">
              <button className="upload-btn" disabled={uploadingImage}>
                {uploadingImage ? "Uploading..." : "Upload Images"}
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="items-list">
              {loadingImages ? (
                <p className="no-data">Loading images...</p>
              ) : images && images.length > 0 ? (
                images.map((img) => (
                  <div
                    key={img.id || img.imageUrl || img.url}
                    className="list-item"
                  >
                    <img
                      src={buildUrl(img.imageUrl || img.url)}
                      alt="property"
                      className="item-thumb clickable-thumb"
                      onClick={() =>
                        openImagePreview(buildUrl(img.imageUrl || img.url))
                      }
                      title="Click to preview"
                    />
                    <div className="item-actions">
                      <button
                        className={`action-btn ${img.isMain ? "active" : ""}`}
                        onClick={() => handleSetMainImage(img.id)}
                        title="Set as Cover"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="action-btn text-danger"
                        onClick={() => handleRemoveImage(img.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {img.isMain && <span className="main-badge">Main</span>}
                  </div>
                ))
              ) : (
                <p className="no-data">No images uploaded.</p>
              )}
            </div>
            {images.length > 0 && (
              <button
                className="remove-all-btn"
                onClick={handleRemoveAllImages}
              >
                Remove All Images
              </button>
            )}
          </div>
        </div>

        {/* Documents Management */}
        <div className="owner-panel-card">
          <div className="card-header">
            <FileText size={20} />
            <h3>Documents Management</h3>
          </div>
          <div className="card-content">
            <div className="document-status">
              {[
                { type: "OwnershipContract", label: "Ownership Contract" },
                { type: "TaxCertificate", label: "Title Deed" },
                { type: "UtilityBill", label: "Utility Bill" },
              ].map((item) => (
                <span
                  key={item.type}
                  className={`status-pill ${hasDocumentType(item.type) ? "filled" : ""}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <p className="upload-note">
              {getNextDocumentType(documents)
                ? `Next upload will be: ${getDocumentLabel(getNextDocumentType(documents))}.`
                : "All required verification documents are uploaded. Remove one to replace it."}
            </p>
            <div className="upload-btn-wrapper">
              <button
                className="upload-btn"
                disabled={uploadingDoc || !getNextDocumentType(documents)}
              >
                {uploadingDoc ? "Uploading..." : "Upload Document"}
              </button>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,image/jpeg,image/png,image/jpg"
                onChange={handleDocumentUpload}
                disabled={!getNextDocumentType(documents)}
              />
            </div>

            <div className="items-list">
              {loadingDocuments ? (
                <p className="no-data">Loading documents...</p>
              ) : documents && documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="list-item doc-item">
                    <div className="doc-info">
                      <span className="doc-name">
                        {doc.fileName ||
                          doc.documentName ||
                          "Untitled document"}
                      </span>
                      <span className="doc-type">
                        {getDocumentLabelFromDoc(doc)}
                      </span>
                    </div>
                    <div className="item-actions">
                      <a
                        href={buildUrl(
                          doc.documentUrl || doc.url || doc.fileUrl,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="action-btn"
                      >
                        View
                      </a>
                      <button
                        className="action-btn text-danger"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No documents uploaded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className="owner-panel-card">
          <div className="card-header">
            <Activity size={20} />
            <h3>AI Verification</h3>
          </div>
          <div className="card-content">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <p className="validation-text" style={{ margin: 0 }}>
                Verification Status:{" "}
                <span className={`status-badge ${property.verificationStatus?.toLowerCase() || "pending"}`} style={{ marginLeft: "6px" }}>
                  {property.verificationStatus || "Pending"}
                </span>
              </p>
              {/* Only render Fraud/Trust scores when AI analysis has actually run */}
              {hasAiResult && fraudScore !== null && (
                <p style={{ margin: 0 }}>
                  Fraud Score: <strong>{fraudScore}%</strong>
                </p>
              )}
              {hasAiResult && trustScore !== null && (
                <p style={{ margin: 0 }}>
                  Trust Score: <strong>{trustScore}/100</strong>
                </p>
              )}
            </div>

            <div className="validation-status-details" style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0", fontSize: "14px" }}>
              {/* Ownership status — 4 cases */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {renderOwnershipStatus()}
              </div>

              {/* Forensics lines only shown when AI analysis exists */}
              {hasAiResult && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {!hasForensicsFlags ? (
                      <span style={{ color: "#166534", fontWeight: "600" }}>✓ No Image Forensics Issues Detected</span>
                    ) : (
                      <span style={{ color: "#991b1b", fontWeight: "600" }}>✗ Image Forensics Issues Detected</span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {!hasForensicsFlags ? (
                      <span style={{ color: "#166534", fontWeight: "600" }}>✓ Images Appear Authentic</span>
                    ) : (
                      <span style={{ color: "#991b1b", fontWeight: "600" }}>✗ Images May Be AI-Generated/Manipulated</span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* List Forensics Flags */}
            {hasForensicsFlags && (
              <div className="forensics-flags-box" style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "6px", padding: "12px", marginBottom: "12px", fontSize: "13px" }}>
                <strong style={{ color: "#991b1b", display: "block", marginBottom: "6px" }}>Detected Image Forensic Flags:</strong>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#991b1b" }}>
                  {forensicsFlagsList.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* General Flags Warning Section */}
            {hasExtraFlags && (
              <div className="warning-flags-box" style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "6px", padding: "12px", marginBottom: "12px", fontSize: "13px" }}>
                <strong style={{ color: "#854d0e", display: "block", marginBottom: "6px" }}>AI Flags Warnings:</strong>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#854d0e" }}>
                  {extraFlagsList.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show rejection reason if available */}
            {rejectionReason && (
              <div className="rejection-reason-section">
                <h4 className="rejection-title">Rejection Reason:</h4>
                <div className="rejection-reason">
                  {rejectionReason.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Show warning banner for image-flagged rejections */}
            <AIVerificationWarning
              rejectionReason={rejectionReason}
              isRejectedDueToImages={isRejectedDueToImages}
              onResubmit={handleResubmitWithNewImages}
            />

            {property.verificationStatus !== "Rejected" && (
              <p className="validation-help" style={{ marginTop: "12px" }}>
                To get your property listed faster, you can trigger the AI
                verification process manually.
              </p>
            )}

            {!hasOwnershipDocument() && (
              <p className="validation-warning">
                Ownership contract is missing. AI validation will not be
                submitted until you upload an ownership document.
              </p>
            )}

            <button
              className="validate-btn"
              onClick={handleTriggerValidation}
              disabled={
                validating ||
                property.verificationStatus === "Approved" ||
                !hasOwnershipDocument()
              }
              title={
                !hasOwnershipDocument()
                  ? "Upload an ownership document first"
                  : property.verificationStatus === "Approved"
                    ? "Property is already approved"
                    : "Trigger AI verification"
              }
            >
              {validating ? "Validating..." : "Trigger AI Validation"}
            </button>
          </div>
        </div>
      </div>
      {previewImage && (
        <div className="image-preview-overlay" onClick={closeImagePreview}>
          <div
            className="image-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="preview-close-btn" onClick={closeImagePreview}>
              ×
            </button>
            <img src={previewImage} alt="Preview" className="preview-image" />
          </div>
        </div>
      )}
    </div>
  );
}
