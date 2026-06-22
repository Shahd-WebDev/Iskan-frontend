import React, { useState } from "react";
import { Monitor, Smartphone, Eye, EyeOff } from "lucide-react";
import styles from "./settings.module.css";


import { useEffect } from "react";
import { toast } from "react-toastify";
import { changePassword, getSessions, revokeSession } from "../../services/settings";
import { validateField } from "../owner/features/add-property/utils/validation";

function Security() {
  // ------------------ Show/Hide Password ------------------
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ------------------ Active Sessions ------------------
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Fetch active sessions
  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        setLoadingSessions(true);
        const data = await getSessions();
        // Assuming data is an array of sessions mapping to SessionDto
        const mappedSessions = (data || []).map(s => ({
          id: s.sessionId,
          device: s.deviceName || "Unknown Device",
          location: s.location || "Unknown Location",
          time: s.lastActive || "Recently",
          isCurrent: s.isCurrentDevice,
          icon: s.deviceName?.toLowerCase().includes("phone") ? <Smartphone size={22} /> : <Monitor size={22} />,
        }));
        setSessions(mappedSessions);
      } catch (err) {
        console.error("Failed to load sessions:", err);
        toast.error("Could not load active sessions.");
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchActiveSessions();
  }, []);

  // ------------------ Form State ------------------
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // ------------------ Handlers ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setMessage("");
  };

  // ------------------ VALIDATION ------------------
  const validateForm = () => {
    const newErrors = {};

    const currentError = validateField("currentPassword", formData.currentPassword, formData);
    if (currentError) newErrors.currentPassword = currentError;

    const newError = validateField("newPassword", formData.newPassword, formData);
    if (newError) newErrors.newPassword = newError;

    const confirmError = validateField("confirmPassword", formData.confirmPassword, formData);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ------------------ SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword
      });

      setMessage("Password changed successfully!");
      toast.success("Password changed successfully!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Failed to change password:", err);
      setErrors({ ...errors, currentPassword: err.response?.data?.message || "Failed to change password." });
    }
  };

  // ------------------ SESSION LOGOUT ------------------
  const handleLogoutSession = async (id) => {
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session revoked successfully.");
    } catch (err) {
      console.error("Failed to revoke session:", err);
      toast.error("Failed to revoke session.");
    }
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

          {/* Confirm Password */}
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
            <button className={styles.btnPrimary} type="submit">
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* ================= Active Sessions ================= */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Active Sessions</h3>
          <p className={styles.subtitle}>
            Manage currently logged in devices
          </p>
        </div>

        <div className={styles.sessionsList}>
          {loadingSessions ? (
            <p style={{ padding: "16px", color: "#6b7280" }}>Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p style={{ padding: "16px", color: "#6b7280" }}>No active sessions found.</p>
          ) : sessions.map((session) => (
            <div key={session.id} className={styles.sessionItem}>
              <div className={styles.sessionLeft}>
                <div className={styles.deviceIcon}>{session.icon}</div>

                <div className={styles.deviceInfo}>
                  <p className={styles.deviceName}>
                    {session.device}
                    {session.isCurrent && (
                      <span className={styles.currentBadge}>
                        Current Device
                      </span>
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