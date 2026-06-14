import React from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";
import styles from "./ConfirmDeleteModal.module.css";

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  propertyName,
  isLoading
}) {
  if (!isOpen) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-card"]}>
        <div className={styles["modal-header"]}>
          <div className={styles["warning-icon-wrapper"]}>
            <AlertTriangle size={24} className={styles["warning-icon"]} />
          </div>
          <button className={styles["close-btn"]} onClick={onCancel} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        <div className={styles["modal-body"]}>
          <h3>Delete Property Listing</h3>
          <p>
            Are you sure you want to delete <strong>{propertyName || "this property"}</strong>?
            This action is permanent and cannot be undone. All linked photos, documents, and details will be deleted.
          </p>
        </div>
        <div className={styles["modal-footer"]}>
          <button 
            className={styles["btn-cancel"]} 
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={styles["btn-delete"]} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className={styles["spinner"]} />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Property</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
