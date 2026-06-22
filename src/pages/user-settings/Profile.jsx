import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { Camera } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useProfile } from "../../context/ProfileContext";
import { validateField } from "../owner/features/add-property/utils/validation";

function Profile() {
  const { profile, loading, updateProfile } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setDateOfBirth(
        profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
      );
      setPhoneNumber(profile.phoneNumber || "");
      setImagePreview(profile.profileImageUrl || null);
    }
  }, [profile]);

  const handleFirstNameChange = (val) => {
    setFirstName(val);
    if (errors.firstName) {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const handleLastNameChange = (val) => {
    setLastName(val);
    if (errors.lastName) {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const handleDOBChange = (val) => {
    setDateOfBirth(val);
    if (errors.dateOfBirth) {
      setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    }
  };

  const handlePhoneChange = (val) => {
    setPhoneNumber(val);
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      alert("Image must be less than 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    const firstNameError = validateField("firstName", firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateField("lastName", lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const dobError = validateField("dateOfBirth", dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;

    const phoneError = validateField("phoneNumber", phoneNumber, "20");
    if (phoneError) newErrors.phoneNumber = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      await updateProfile({
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        profileImageFile: imageFile,
      });
      setImageFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      {loading && <div className={styles.loadingOverlay}>Loading...</div>}

      <div className={styles.header}>
        <h3 className={styles.title}>Profile Information</h3>
        <p className={styles.subtitle}>Manage your personal information</p>
      </div>

      <div className={styles.avatarSection}>
        <div className={styles.avatarCircle}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="profile"
              className={styles.avatarImg}
            />
          ) : (
            `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase()
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

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
          />
          {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
          />
          {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="email" value={email} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => handleDOBChange(e.target.value)}
          />
          {errors.dateOfBirth && <span className={styles.error}>{errors.dateOfBirth}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <PhoneInput
            country={"eg"}
            value={phoneNumber}
            onChange={(val) => handlePhoneChange(val)}
          />
          {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnOutline}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default Profile;
