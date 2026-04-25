import React from 'react';
import { X } from 'lucide-react';
import styles from '../AddPropertyModal.module.css';

const ModalHeader = ({ title, currentStep, totalSteps, onClose }) => {
  return (
    <div className={styles["modal-header"]}>
      <div>
        <h2 className={styles["modal-title"]}>{title}</h2>
        <p className={styles["modal-subtitle"]}>Step {currentStep} of {totalSteps}</p>
      </div>
      <button type="button" className={styles["modal-close"]} onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};

export default ModalHeader;
