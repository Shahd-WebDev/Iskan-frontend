
import React, { useState } from "react";
import styles from "./settings.module.css";
import { Camera, CheckCircle } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { validateField } from "../../utils/Validation";
function Profile({ role = "student", showSuccessMessage = false }) {

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
  const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});


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

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });

  const error = validateField(name, value);

  setErrors((prev) => ({
    ...prev,
    [name]: error
  }));
};
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

  const handleSubmit = (e) => {
    e.preventDefault();

    let allValid = true;

    Object.keys(formData).forEach((key) => {
      const isValid = validateField(
        key,
        formData[key],
        formData.countryCode || ""
      );

      if (!isValid) allValid = false;
    });

    if (allValid) {
      console.log(formData);

      if (showSuccessMessage) {
        setMessage("Profile saved successfully!");
      } else {
        alert("Profile saved successfully!");
      }
    }
  };

  return (
    <>
      <form className={styles.card} onSubmit={handleSubmit}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Profile Information
          </h3>

          <p className={styles.subtitle}>
            Manage your personal information
          </p>
        </div>

        {/* Profile Image */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {image ? (
              <img
                src={image}
                alt="profile"
                className={styles.avatarImg}
              />
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

        {/* Form Fields */}
        <div className={styles.formContent}>

          {/* Name */}
          <div className={styles.formGroup}>
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            {errors.name && (
              <span className={styles.error}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {errors.email && (
              <span className={styles.error}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <label>Phone Number</label>

            <PhoneInput
              country={"eg"}
              value={formData.phone}
              onChange={(phone, country) => {
                setFormData({
                  ...formData,
                  phone: phone,
                  countryCode: country.dialCode
                });

               const error = validateField(
  "phone",
  phone,
  country.dialCode
);

setErrors((prev) => ({
  ...prev,
  phone: error
}));
              }}
            />

            {errors.phone && (
              <span className={styles.error}>
                {errors.phone}
              </span>
            )}
          </div>

          {/* Student Fields */}
          {role === "student" ? (
            <div className={styles.row}>

              <div className={styles.formGroup}>
                <label>Department</label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((dep, index) => (
                    <option
                      key={index}
                      value={dep}
                    >
                      {dep}
                    </option>
                  ))}
                </select>

                {errors.department && (
                  <span className={styles.error}>
                    {errors.department}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>University</label>

                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                >
                  <option value="">
                    Select University
                  </option>

                  {universities.map((uni, index) => (
                    <option
                      key={index}
                      value={uni}
                    >
                      {uni}
                    </option>
                  ))}
                </select>

                {errors.university && (
                  <span className={styles.error}>
                    {errors.university}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Bio */}
              <div className={styles.formGroup}>
                <label>Bio</label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio about yourself..."
                />
              </div>

              {/* Address & City */}
              <div className={styles.row}>

                <div className={styles.formGroup}>
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>

              </div>
            </>
          )}
        </div>

        {/* Owner Verification Section */}
        {role === "owner" && (
          <div className={styles.verificationSection}>
            <h4>Owner Verification</h4>

            <p>
              Upload your government ID for account
              verification (one-time)
            </p>

            <div className={styles.verifiedBox}>
              <div className={styles.verifiedHeader}>
                <CheckCircle size={18} />
                Account Verified
              </div>

              <p className={styles.verifiedText}>
                Your identity has been verified on{" "}
                {new Date().toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }
                )}
              </p>
            </div>
          </div>
        )}
     

      {/* OWNER SECTION */}
             {/* Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnOutline}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.btnPrimary}
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Success Message */}
      {showSuccessMessage && message && (
        <div
          className={styles.card}
          style={{ marginTop: "16px" }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>
              Owner Verification
            </h3>

            <p className={styles.subtitle}>
              Upload your government ID for account
              verification (one-time)
            </p>
          </div>

          <div className={styles.verifiedBox}>
            <p className={styles.verifiedTitle}>
              <CheckCircle
                size={16}
                color="#16a34a"
                style={{ marginRight: "6px" }}
              />
              Account Verified
            </p>

            <p className={styles.verifiedSubtitle}>
              Your identity has been verified on{" "}
              {new Date().toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
