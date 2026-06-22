import React from "react";
import FormInput from "./FormInput";
import styles from "../AddPropertyModal.module.css";
import compStyles from "../AddPropertyModalComponents.module.css";

const Step1_BasicInfo = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const propertyTypeOptions = [
    { value: "Room", label: "Room" },
    { value: "Studio", label: "Studio" },
    { value: "Apartment", label: "Apartment" },
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

      <div className={styles["form-row-3"]}>
        <FormInput
          label="Rooms"
          name="rooms"
          type="number"
          value={formData.rooms}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.rooms}
          touched={touched.rooms}
          required
        />
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
        footer={
          <span className={compStyles["char-count"]}>
            {formData.description?.length || 0} chars
          </span>
        }
        required
      />
    </>
  );
};

export default Step1_BasicInfo;
