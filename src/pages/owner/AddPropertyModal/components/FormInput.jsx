import React from 'react';

/**
 * Reusable input component for the AddPropertyModal form.
 * Handles labels, error messages, and success styling.
 * @param {object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type (text, number, date, select, textarea)
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {function} props.onBlur - Blur handler
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the field has been touched
 * @param {string} props.placeholder - Input placeholder
 * @param {array} props.options - Options for select input
 * @param {number} props.rows - Rows for textarea
 * @param {boolean} props.readOnly - Whether the input is read-only
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.footer - Optional footer content (e.g. char count)
 */
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
  
  const inputClass = `form-control ${isError ? "input-error" : (isSuccess ? "input-success" : "")} ${className}`;

  return (
    <div className="form-group">
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
        <div className="description-footer">
          {isError ? <span className="error-text">{error}</span> : <span></span>}
          {footer}
        </div>
      ) : (
        isError && <span className="error-text">{error}</span>
      )}
    </div>
  );
};

export default FormInput;
