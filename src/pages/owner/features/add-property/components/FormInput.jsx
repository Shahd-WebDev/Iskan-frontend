import React from 'react';
import styles from '../AddPropertyModalComponents.module.css';

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  options = [],
  rows = 4,
  readOnly = false,
  className = "",
  footer,
  required = false
}) => {
  const isError = touched && error;
  const isSuccess = touched && !error && value;
  
  const inputClass = `${styles["form-control"]} ${isError ? styles["input-error"] : (isSuccess ? styles["input-success"] : "")} ${className}`;

  return (
    <div className={styles["form-group"]}>
      {label && <label>{label} {required && "*"}</label>}
      
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
          placeholder={placeholder}
          rows={rows}
          readOnly={readOnly}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
          disabled={readOnly}
        >
          <option value="">{placeholder || "Select option"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}
      
      {footer ? (
        <div className={styles["description-footer"]}>
          {isError ? <span className={styles["error-text"]}>{error}</span> : <span></span>}
          {footer}
        </div>
      ) : (
        isError && <span className={styles["error-text"]}>{error}</span>
      )}
    </div>
  );
};

export default FormInput;
