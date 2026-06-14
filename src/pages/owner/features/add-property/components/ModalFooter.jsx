import React from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import styles from '../AddPropertyModal.module.css';

const ModalFooter = ({ currentStep, totalSteps, onBack, onNext, submitting }) => {
  return (
    <div className={styles["modal-footer"]}>
      <button 
        type="button"
        className={styles["btn-back"]} 
        disabled={currentStep === 1 || submitting}
        onClick={onBack}
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </button>
      <button 
        type="button"
        className={styles["btn-next"]} 
        disabled={submitting}
        onClick={onNext}
      >
        {submitting ? (
          <>
            <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", marginRight: "6px" }} />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>{currentStep === totalSteps ? 'Submit Property for Review' : 'Next'}</span>
            {currentStep !== totalSteps && <ChevronRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
};

export default ModalFooter;
