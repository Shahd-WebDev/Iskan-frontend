// Security.jsx
import React, { useState } from "react";
import { Monitor, Smartphone, Eye, EyeOff } from "lucide-react";
import styles from "./settings.module.css";
import { usePasswordValidation } from "../../components/context/PasswordValidationContext";

function Security() {
  // ------------------ Show/Hide Password ------------------
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ------------------ Active Sessions ------------------
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome (Windows)",
      location: "Seoul, South Korea",
      time: "Active now",
      isCurrent: true,
      icon: <Monitor size={22} />,
    },
    {
      id: 2,
      device: "Safari (iPhone)",
      location: "Seoul, South Korea",
      time: "2 hours ago",
      isCurrent: false,
      icon: <Smartphone size={22} />,
    },
    {
      id: 3,
      device: "Chrome (MacOS)",
      location: "Busan, South Korea",
      time: "1 day ago",
      isCurrent: false,
      icon: <Monitor size={22} />,
    },
  ]);

  // ------------------ Form State ------------------
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const { validatePassword } = usePasswordValidation();

  // ------------------ Handlers ------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    const pwdError = validatePassword(formData.newPassword);
    if (pwdError) newErrors.newPassword = pwdError;

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // مؤقتًا رسالة نجاح
    setMessage("Password changed successfully!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogoutSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // ------------------ JSX ------------------
  return (
    <div className={styles.container}>
      {/* ================= Change Password ================= */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Change Password</h3>
          <p className={styles.subtitle}>
            Regularly update your password to enhance security
          </p>
        </div>

        <form className={styles.formContent} onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
              
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <span
                className={styles.showHideBtn}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.currentPassword && (
              <p className={styles.error}>{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className={styles.formGroup}>
            <label>New Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
               
                value={formData.newPassword}
                onChange={handleChange}
              />
              <span
                className={styles.showHideBtn}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.newPassword && (
              <p className={styles.error}>{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className={styles.formGroup}>
            <label>Confirm New Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className={styles.showHideBtn}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              type="submit"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* ================= Active Sessions ================= */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Active Sessions</h3>
          <p className={styles.subtitle}>Manage currently logged in devices</p>
        </div>

        <div className={styles.sessionsList}>
          {sessions.map((session) => (
            <div key={session.id} className={styles.sessionItem}>
              <div className={styles.sessionLeft}>
                <div className={styles.deviceIcon}>{session.icon}</div>
                <div className={styles.deviceInfo}>
                  <p className={styles.deviceName}>
                    {session.device}
                    {session.isCurrent && (
                      <span className={styles.currentBadge}>Current Device</span>
                    )}
                  </p>
                  <p className={styles.deviceMeta}>
                    {session.location} • {session.time}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  className={styles.btnOutline}
                  onClick={() => handleLogoutSession(session.id)}
                >
                  Log Out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Security;