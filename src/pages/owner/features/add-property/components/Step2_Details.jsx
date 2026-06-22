import React from 'react';
import FormInput from './FormInput';
import MapPicker from './MapPicker';
import styles from '../AddPropertyModal.module.css';
import compStyles from '../AddPropertyModalComponents.module.css';

const Step2_Details = ({ formData, errors, touched, handleChange, handleBlur, onLocationSelect }) => {
  return (
    <>
      <div className={compStyles["form-group"]}>
        <label>Location Map *</label>
        <MapPicker
          location={formData.location}
          isLocationSelected={formData.isLocationSelected}
          onLocationSelect={onLocationSelect}
        />
        <FormInput
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.streetAddress}
          touched={touched.streetAddress}
          placeholder="Address will be auto-filled from map"
          readOnly={formData.isLocationSelected}
          className={compStyles["mt-2"]}
        />
      </div>

      <div className={styles["form-row-2"]}>
        <FormInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.city}
          touched={touched.city}
          readOnly
        />
        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.country}
          touched={touched.country}
          readOnly
        />
      </div>

      <div className={styles["form-row-2"]}>
        <FormInput
          label="State/Region"
          name="state"
          value={formData.state}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.state}
          touched={touched.state}
          readOnly
        />
        <FormInput
          label="Zip Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.zipCode}
          touched={touched.zipCode}
          readOnly
        />
      </div>
    </>
  );
};

export default Step2_Details;
