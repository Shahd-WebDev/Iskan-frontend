import React from 'react';
import FormInput from './FormInput';
import MapPicker from './MapPicker';
import styles from '../AddPropertyModal.module.css';
import compStyles from '../AddPropertyModalComponents.module.css';

const Step1_BasicInfo = ({ formData, errors, touched, handleChange, handleBlur, onLocationSelect }) => {
  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "studio", label: "Studio" }
  ];

  return (
    <>
      <FormInput
        label="Property Name"
        name="propertyName"
        value={formData.propertyName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.propertyName}
        touched={touched.propertyName}
        placeholder="e.g., Modern Downtown Apartment"
        required
      />

      <FormInput
        label="Property Type"
        name="propertyType"
        type="select"
        value={formData.propertyType}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.propertyType}
        touched={touched.propertyType}
        placeholder="Select property type"
        options={propertyTypeOptions}
        required
      />

      <div className={compStyles["form-group"]}>
        <label>Street Address *</label>
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
          required
        />
        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.country}
          touched={touched.country}
          required
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
          required
        />
        <FormInput
          label="Zip Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.zipCode}
          touched={touched.zipCode}
          required
        />
      </div>

      <FormInput
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        placeholder="Describe your property..."
        rows={4}
        footer={<span className={compStyles["char-count"]}>{formData.description?.length || 0} chars</span>}
        required
      />
    </>
  );
};

export default Step1_BasicInfo;
