import React from 'react';
import { X } from 'lucide-react';

const ModalHeader = ({ title, currentStep, totalSteps, onClose }) => {
  return (
    <div className="modal-header">
      <div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-subtitle">Step {currentStep} of {totalSteps}</p>
      </div>
      <button type="button" className="modal-close" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};

export default ModalHeader;
