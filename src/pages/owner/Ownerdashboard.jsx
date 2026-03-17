import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Building2, MessageSquare, Settings } from "lucide-react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import "./Ownerdashboard.css";

const NAV_ITEMS = [
  { to: "/owner-dashboard/dashboard",  label: "Dashboard",           icon: LayoutDashboard },
  { to: "/owner-dashboard/properties", label: "My Properties",       icon: Building2       },
  { to: "/owner-dashboard/messages",   label: "Messages & Bookings", icon: MessageSquare },
  { to: "/owner-dashboard/settings",   label: "Settings",            icon: Settings        },
];

export default function OwnerDashboard() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const user = {
    name: stored.name || "User",
    email: stored.email || "",
    avatar: stored.avatar || null,
    initials: stored.name
      ? stored.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U",
  };

  return (
    <div className="od-root">

      <Navbar variant="dashboard" />

      <div className="od-body">
        <aside className="od-sidebar">
          <nav className="od-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `od-nav-item ${isActive ? "od-nav-item--active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
                {badge && <span className="od-nav-badge">{badge}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Profile */}
          <div className="od-sidebar-profile">
            <div className="od-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="od-sidebar-user">
              <span className="od-profile-name">{user.name}</span>
              <span className="od-profile-email">{user.email}</span>
            </div>
          </div>
        </aside>

        <main className="od-main">
          <div className="od-content">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}