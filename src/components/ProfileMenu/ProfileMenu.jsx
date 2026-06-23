import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import {
  Bookmark,
  Settings,
  Bell,
  LifeBuoy,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  ArrowLeftRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useNotifications } from "../../hooks/useNotifications";

import "./ProfileMenu.css";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const role = user?.role?.toLowerCase();
  const [openMenu, setOpenMenu] = useState(false);

  // ✅ Live notification badge — only fetches unread count
  const { unreadCount } = useNotifications({ autoFetch: !!user, pageSize: 1 });

  const menuRef = useRef(null);

  const displayName =
    (profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : user?.name || user?.email) || "User";

  const isAdmin = role === "admin";

  // ✅ Close Menu When Clicking Outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // ✅ If No User Logged In
  if (!user) {
    return (
      <Link to="/login" className="iskan-login-btn">
        LOG IN
      </Link>
    );
  }

  return (
    <div className="pm-wrapper" ref={menuRef}>
      {/* ================= Profile Icon Button ================= */}
      <button
        className={`pm-icon ${openMenu ? "pm-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu(!openMenu);
        }}
      >
        {/* ✅ Avatar with optional unread dot */}
        <div className="pm-avatar-small pm-avatar-small--badge">
          {profile?.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt="avatar" />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
          {unreadCount > 0 && <span className="pm-avatar-dot" />}
        </div>

        <ChevronDown
          size={18}
          className={`pm-chevron ${openMenu ? "rotate" : ""}`}
        />
      </button>

      {/* ================= Dropdown Menu ================= */}
      {openMenu && (
        <div className="pm-menu">
          {/* User Info */}
          {/* User Info */}
          <div
            className={`pm-user ${isAdmin ? "admin-clickable" : ""}`}
            onClick={() => {
              if (isAdmin) {
                navigate("/admin/dashboard");
                setOpenMenu(false);
              }
            }}
          >
            {/* ✅ Avatar Letter */}
            <div className="pm-avatar">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="avatar" />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              {/* ✅ Show Only First 2 Words */}
              <h4>{displayName.split(" ").slice(0, 2).join(" ")}</h4>
              <p>{profile?.email || user.email}</p>
            </div>
          </div>

          <hr />

          {/* Saved */}
          {!isAdmin && (
            <Link to="/saved" className="pm-item">
              <Bookmark size={18} stroke="black" fill="black" />
              Saved Property
            </Link>
          )}

          {/* Profile */}
          <Link
            to={
              role === "owner"
                ? "/owner-dashboard/settings/profile"
                : "/settings/profile"
            }
            className="pm-item"
            onClick={() => setOpenMenu(false)}
          >
            <Settings size={18} stroke="black" />
            Profile Settings
          </Link>

          {/* Notifications */}
          <Link
            to={isAdmin ? "/admin/notifications" : "/notifications"}
            className="pm-item"
            onClick={() => setOpenMenu(false)}
          >
            <span className="pm-notif-icon-wrap">
              <Bell size={18} stroke="black" fill="black" />
              {unreadCount > 0 && (
                <span className="pm-notif-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
            Notifications
          </Link>

          <hr />

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="pm-item"
              onClick={() => setOpenMenu(false)}
            >
              <UserPlus size={18} stroke="black" />
              Dashboard
            </Link>
          )}

          {/* Logout */}
          <button onClick={handleLogout} className="pm-item pm-logout">
            <LogOut size={18} stroke="black" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
