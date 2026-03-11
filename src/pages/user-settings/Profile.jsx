import React, { useState } from "react";
import styles from "./settings.module.css";
import { Camera } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useValidation } from "../../components/context/ValidationContext";

function Profile() {
  const { errors, validateField } = useValidation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    university: ""
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

  // handle change لكل الحقول
 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  validateField(name, value); // ده هيتحقق لأي select أو input
};

  // اختيار الصورة والتحقق من الحجم
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
    const isValid = validateField(key, formData[key], formData.countryCode || "");
    if (!isValid) allValid = false;
  });

  if (allValid) {
    console.log(formData);
    alert("Profile saved successfully!");
  }
};
  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Profile Information</h3>
        <p className={styles.subtitle}>Manage your personal information</p>
      </div>

      {/* Profile Image */}
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
          {errors.name && <span className={styles.error}>{errors.name}</span>}
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
          {errors.email && <span className={styles.error}>{errors.email}</span>}
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
    validateField("phone", phone, country.dialCode);
  }}
/>
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>

        {/* Department & University */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dep, index) => (
                <option key={index} value={dep}>{dep}</option>
              ))}
            </select>
            {errors.department && <span className={styles.error}>{errors.department}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>University</label>
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
            >
              <option value="">Select University</option>
              {universities.map((uni, index) => (
                <option key={index} value={uni}>{uni}</option>
              ))}
            </select>
            {errors.university && <span className={styles.error}>{errors.university}</span>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.actions}>
        <button type="button" className={styles.btnOutline}>Cancel</button>
        <button type="submit" className={styles.btnPrimary}>Save Changes</button>
      </div>
    </form>
  );
}

export default Profile;