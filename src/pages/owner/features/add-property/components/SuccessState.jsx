import React from 'react';
import { CheckCircle } from 'lucide-react';
import styles from '../AddPropertyModal.module.css';
import stepStyles from '../AddPropertyModalSteps.module.css';

const SuccessState = ({ onClose }) => {
  return (
    <div className={`${styles["modal-container"]} ${stepStyles["success-container"]}`}>
      <div className={stepStyles["success-content"]}>
        <div className={stepStyles["success-icon-wrapper"]}>
          <CheckCircle size={64} className={stepStyles["success-icon"]} />
        </div>
        <h2 className={stepStyles["success-title"]}>Property Submitted!</h2>
        <p className={stepStyles["success-text"]}>Your property has been successfully submitted and sent to our team for verification. You will be notified once it is approved.</p>
        <button type="button" className={stepStyles["btn-success"]} onClick={onClose}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessState;
