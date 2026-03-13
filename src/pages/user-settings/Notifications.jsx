import React, { useState } from "react";
import styles from "./settings.module.css";

function Notifications() {
  // State لكل notification
  const [emailNotifications, setEmailNotifications] = useState({
    securityAlerts: true,
    productUpdates: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    messages: true,
    reminders: true,
  });

  // Toggle function
  const toggleEmail = (type) => {
    setEmailNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const togglePush = (type) => {
    setPushNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const turnOffAll = () => {
    setEmailNotifications({ securityAlerts: false, productUpdates: false });
    setPushNotifications({ messages: false, reminders: false });
  };

  const saveSettings = () => {
    console.log("Saved Email Notifications:", emailNotifications);
    console.log("Saved Push Notifications:", pushNotifications);
    alert("Settings saved successfully!");
    // هنا ممكن بعد كده تعمل API call للمخدم
  };

  return (
    <div className={styles.container}>
      {/* Email Notifications */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Email Notifications</h3>
          <p className={styles.subtitle}>Choose which notifications to receive via email.</p>
        </div>

        <div className={styles.sessionsList}>
          <div className={styles.sessionItem}>
            <div className={styles.deviceInfo}>
              <p className={styles.deviceName}>Security Alerts</p>
              <p className={styles.deviceMeta}>Login attempts and security events</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={emailNotifications.securityAlerts}
                onChange={() => toggleEmail("securityAlerts")}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.sessionItem}>
            <div className={styles.deviceInfo}>
              <p className={styles.deviceName}>Product Updates</p>
              <p className={styles.deviceMeta}>New features and improvements</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={emailNotifications.productUpdates}
                onChange={() => toggleEmail("productUpdates")}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Push Notifications</h3>
          <p className={styles.subtitle}>Configure real-time notifications</p>
        </div>

        <div className={styles.sessionsList}>
          <div className={styles.sessionItem}>
            <div className={styles.deviceInfo}>
              <p className={styles.deviceName}>Messages</p>
              <p className={styles.deviceMeta}>New message arrivals</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={pushNotifications.messages}
                onChange={() => togglePush("messages")}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.sessionItem}>
            <div className={styles.deviceInfo}>
              <p className={styles.deviceName}>Reminders</p>
              <p className={styles.deviceMeta}>Important event reminders</p>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={pushNotifications.reminders}
                onChange={() => togglePush("reminders")}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnOutline} style={{marginRight: '10px'}} onClick={turnOffAll}>Turn Off All</button>
          <button className={styles.btnPrimary} onClick={saveSettings}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;