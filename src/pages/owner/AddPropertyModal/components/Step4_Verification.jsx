import React from 'react';
import { CheckCircle } from 'lucide-react';

const Step4_Verification = ({ formData, errors, handleDocUpload }) => {
  const DocumentItem = ({ id, name, label, subtitle, error }) => (
    <div className={`document-upload-item ${error ? 'has-error' : ''}`}>
      <div className="doc-header">
        <div>
          <h5 className="doc-title">{label}</h5>
          <p className="doc-subtitle">{subtitle}</p>
        </div>
        <span className={`doc-badge ${formData[name] ? 'uploaded' : 'pending'}`}>
          {formData[name] ? <CheckCircle size={14} /> : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          )}
          {formData[name] ? 'Uploaded' : 'Pending'}
        </span>
      </div>
      <div 
        className={`photo-upload-zone small-zone ${formData[name] ? 'zone-success' : (error ? 'zone-error' : '')}`} 
        onClick={() => document.getElementById(id).click()}
      >
        <input type="file" id={id} accept=".pdf, image/jpeg, image/png, image/jpg" style={{display: 'none'}} onChange={(e) => handleDocUpload(name, e)} />
        <div className="upload-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <p className="upload-title">{formData[name] || 'Click to upload or drag and drop'}</p>
        <p className="upload-subtitle">PDF, JPG, PNG (max 10MB)</p>
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );

  return (
    <>
      <div className="verification-alert">
        <h4 className="alert-title">Property Verification Documents Required</h4>
        <p className="alert-desc">Upload the following documents to verify your property. All documents will be reviewed by our team within 24-48 hours.</p>
      </div>

      <DocumentItem 
        id="deed-upload"
        name="titleDeed"
        label="Title Deed *"
        subtitle="Upload a clear copy of the property title deed"
        error={errors.titleDeed}
      />

      <DocumentItem 
        id="tax-upload"
        name="taxLicense"
        label="Proof of Ownership (Tax License) *"
        subtitle="Upload a valid tax license for the property"
        error={errors.taxLicense}
      />

      <DocumentItem 
        id="utility-upload"
        name="utilityBill"
        label="Recent Utility Bill *"
        subtitle="Upload a utility bill from the last 3 months"
        error={errors.utilityBill}
      />

      <div className="submission-note">
        <p><strong>Note:</strong> Your property will be marked as "Pending AI Review" until all required documents are verified. You'll receive an email notification once the review is complete.</p>
      </div>
    </>
  );
};

export default Step4_Verification;
