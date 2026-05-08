import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessState = ({ onClose }) => {
  return (
    <div className="modal-container success-container">
      <div className="success-content">
        <div className="success-icon-wrapper">
          <CheckCircle size={64} className="success-icon" />
        </div>
        <h2 className="success-title">Property Submitted!</h2>
        <p className="success-text">Your property has been successfully submitted and sent to our team for verification. You will be notified once it is approved.</p>
        <button type="button" className="btn-success" onClick={onClose}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessState;
