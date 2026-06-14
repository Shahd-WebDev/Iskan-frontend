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
  ArrowLeftRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import "./ProfileMenu.css";

export default function ProfileMenu() {
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase();
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const displayName = user?.name || user?.email || "User";

  const isAdmin = role === "admin";

  // ✅ Close Menu When Clicking Outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ Logout
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
        {/* ✅ Avatar Letter Instead Of Image */}
        <div className="pm-avatar-small">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" />
          ) : (
<span>{displayName.charAt(0).toUpperCase()}</span>
          )}
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
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
<span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              {/* ✅ Show Only First 2 Words */}
<h4>{displayName.split(" ").slice(0, 2).join(" ")}</h4>
              <p>{user.email}</p>
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
            to={role === "owner" ? "/owner-dashboard/settings/profile" : "/settings/profile"} 
            className="pm-item" 
            onClick={() => setOpenMenu(false)}
          >
            <Settings size={18} stroke="black" />
            Profile Settings
          </Link>

          {/* Notifications */}
          <Link
  to={
    isAdmin
      ? "/admin/notifications"
      : "/notifications"
  }
  className="pm-item"
  onClick={() => setOpenMenu(false)}
>
  <Bell size={18} stroke="black" fill="black" />
  Notifications
</Link>

          <hr />
{!isAdmin && (
  <>
    {/* Help */}
    <Link to="/help" className="pm-item">
      <LifeBuoy size={18} stroke="black" />
      Help
      <ChevronRight className="pm-arrow" size={18} />
    </Link>

    <hr />
  </>
)}



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
