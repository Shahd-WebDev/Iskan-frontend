import { NavLink, Outlet } from "react-router-dom";
import styles from "./SettingsLayout.module.css";
import { User, ShieldCheck, Bell } from "lucide-react";


function SettingsLayout() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>
      <p className={styles.subtitle}>
        Manage your account and access permissions
      </p>

      <div className={styles.tabs}>
        <NavLink
          to="profile"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
        >
          <User size={18} /> {/* أيقونة البروفايل [cite: 8, 76] */}
          Profile
        </NavLink>

        <NavLink
          to="security"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
        >
          <ShieldCheck size={18} /> {/* أيقونة الحماية  */}
          Security
        </NavLink>

        <NavLink
          to="notifications"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ""}`}
        >
          <Bell size={18} /> {/* أيقونة التنبيهات  */}
          Notifications
        </NavLink>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;