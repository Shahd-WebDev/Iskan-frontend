import React from 'react';
import FormInput from './FormInput';
import styles from '../AddPropertyModal.module.css';

const Step2_Details = ({ formData, errors, touched, handleChange, handleBlur }) => {
  return (
    <>
      <div className={styles["form-row-2"]}>
        <FormInput
          label="Bedrooms"
          name="bedrooms"
          type="number"
          value={formData.bedrooms}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.bedrooms}
          touched={touched.bedrooms}
          required
        />
        <FormInput
          label="Bathrooms"
          name="bathrooms"
          type="number"
          value={formData.bathrooms}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.bathrooms}
          touched={touched.bathrooms}
          required
        />
      </div>

      <FormInput
        label="Square Feet"
        name="sqft"
        type="number"
        value={formData.sqft}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.sqft}
        touched={touched.sqft}
        placeholder="e.g., 1200"
        required
      />

      <FormInput
        label="Monthly Price (EGP)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.price}
        touched={touched.price}
        placeholder="e.g., 2400"
        required
      />

      <FormInput
        label="Available From"
        name="availableFrom"
        type="date"
        value={formData.availableFrom}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.availableFrom}
        touched={touched.availableFrom}
        required
      />
    </>
  );
};

export default Step2_Details;
