import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Building2,
  MessageSquare,
  Settings,
  Star,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../../../components/layout/Navbar/Navbar";
import Footer from "../../../components/layout/Footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "../../../context/ProfileContext";
import { useVerificationPolling } from "../../../hooks/useVerificationPolling";
import styles from "./OwnerLayout.module.css";

export default function OwnerLayout() {
  const { verificationStatus } = useAuth();

  // Activate polling globally inside the Owner Dashboard
  useVerificationPolling({ interval: 45000 });

  const { profile } = useProfile();
  const { user: authUser } = useAuth();
  const user = {
    name: profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : authUser?.name || "User",
    email: profile?.email || authUser?.email || "",
    avatar: profile?.profileImageUrl || null,
    initials:
      profile && (profile.firstName || profile.lastName)
        ? `${(profile.firstName || "").charAt(0)}${(profile.lastName || "").charAt(0)}`.toUpperCase()
        : authUser?.name
          ? authUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : "U",
  };

  const navItems = [
    { to: "/owner-dashboard/dashboard", label: "Dashboard", icon: Home },
    {
      to: "/owner-dashboard/properties",
      label: "My Properties",
      icon: Building2,
    },
    {
      to: "/owner-dashboard/messages",
      label: "Messages & Bookings",
      icon: MessageSquare,
    },
    { to: "/owner-dashboard/reviews", label: "Reviews", icon: Star },
    {
      to: "/owner-dashboard/verification",
      label: "Verification Center",
      icon: ShieldCheck,
      badge: verificationStatus === "Rejected" ? "!" : null,
    },
    { to: "/owner-dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={styles["od-root"]}>
      <Navbar variant="dashboard" />

      <div className={styles["od-body"]}>
        <aside className={styles["od-sidebar"]}>
          <nav className={styles["od-nav"]}>
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles["od-nav-item"]} ${isActive ? styles["od-nav-item--active"] : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
                {badge && (
                  <span className={styles["od-nav-badge"]}>{badge}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Profile */}
          <div className={styles["od-sidebar-profile"]}>
            <div className={styles["od-avatar"]}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className={styles["od-sidebar-user"]}>
              <span className={styles["od-profile-name"]}>{user.name}</span>
              <span className={styles["od-profile-email"]}>{user.email}</span>
            </div>
          </div>
        </aside>

        <main className={styles["od-main"]}>
          <div className={styles["od-content"]}>
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
