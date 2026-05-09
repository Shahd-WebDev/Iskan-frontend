import React, { useState } from "react";
import styles from "./settings.module.css";
import { Camera, CheckCircle } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { validateField } from "../../utils/validation";

function Profile({ role = "student" }) {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    university: "",
    bio: "",
    address: "",
    city: "",
    countryCode: "" // optional لو هتستخدميه
  });

  const [image, setImage] = useState(null);

  const universities = [
    "Tanta University",
    "Mansoura University",
    "Alexandria University",
    "Cairo University",
    "Ain Shams University"
  ];

  const departments = [
    "Computer Science",
    "Information Technology",
    "Information Systems",
    "Artificial Intelligence"
  ];

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2000000) {
        alert("Image must be less than 2MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // ---------------- PHONE ----------------
  const handlePhoneChange = (phone, country) => {
    setFormData({
      ...formData,
      phone,
      countryCode: country.dialCode
    });

    const error = validateField("phone", phone, country.dialCode);

    setErrors((prev) => ({
      ...prev,
      phone: error
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key,
        formData[key],
        formData.countryCode
      );

      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    const allValid = Object.values(newErrors).every((err) => !err);

    if (allValid) {
      console.log(formData);
      alert("Profile saved successfully!");
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      {/* HEADER */}
      <div className={styles.header}>
        <h3 className={styles.title}>Profile Information</h3>
        <p className={styles.subtitle}>Manage your personal information</p>
      </div>

      {/* IMAGE */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarCircle}>
          {image ? (
            <img src={image} alt="profile" className={styles.avatarImg} />
          ) : (
            "JS"
          )}

          <label className={styles.cameraBtn}>
            <Camera size={14} color="#fff" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className={styles.avatarInfo}>
          <h4>Profile Picture</h4>
          <p>JPG or PNG (max 2MB)</p>
        </div>
      </div>

      {/* FORM */}
      <div className={styles.formContent}>
        {/* NAME */}
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        {/* EMAIL */}
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        {/* PHONE */}
        <div className={styles.formGroup}>
          <label>Phone Number</label>

          <PhoneInput
            country={"eg"}
            value={formData.phone}
            onChange={handlePhoneChange}
          />

          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>

        {/* ROLE FIELDS */}
        {role === "student" ? (
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((dep, i) => (
                  <option key={i} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>

              {errors.department && (
                <span className={styles.error}>{errors.department}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>University</label>
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
              >
                <option value="">Select University</option>
                {universities.map((uni, i) => (
                  <option key={i} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>

              {errors.university && (
                <span className={styles.error}>{errors.university}</span>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* BIO */}
            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* ADDRESS */}
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* OWNER SECTION */}
      {role === "owner" && (
        <div className={styles.verificationSection}>
          <h4>Owner Verification</h4>

          <div className={styles.verifiedBox}>
            <div className={styles.verifiedHeader}>
              <CheckCircle size={18} />
              Account Verified
            </div>
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className={styles.actions}>
        <button type="button" className={styles.btnOutline}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default Profile;