import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ModalFooter = ({ currentStep, totalSteps, onBack, onNext }) => {
  return (
    <div className="modal-footer">
      <button 
        type="button"
        className="btn-back" 
        disabled={currentStep === 1}
        onClick={onBack}
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </button>
      <button 
        type="button"
        className="btn-next" 
        onClick={onNext}
      >
        <span>{currentStep === totalSteps ? 'Submit Property for Review' : 'Next'}</span>
        {currentStep !== totalSteps && <ChevronRight size={18} />}
      </button>
    </div>
  );
};

export default ModalFooter;
