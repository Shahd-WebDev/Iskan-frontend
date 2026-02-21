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
} from "lucide-react";

import "./ProfileMenu.css";

export default function ProfileMenu() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  // ✅ Load User From LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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
    localStorage.removeItem("user");
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
            <span>{user.name.charAt(0).toUpperCase()}</span>
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
          <div className="pm-user">
            {/* ✅ Avatar Letter */}
            <div className="pm-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              {/* ✅ Show Only First 2 Words */}
              <h4>{user.name.split(" ").slice(0, 2).join(" ")}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          <hr />

          {/* Saved */}
          <Link to="/saved" className="pm-item">
            <Bookmark size={18} stroke="black" fill="black" />
            Saved Property
          </Link>

          {/* Profile */}
          <Link to="/profile" className="pm-item">
            <Settings size={18} stroke="black" />
            Profile Settings
          </Link>

          {/* Notifications */}
          <Link to="/notifications" className="pm-item">
            <Bell size={18} stroke="black" fill="black" />
            Notifications
          </Link>

          <hr />

          {/* Help */}
          <Link to="/help" className="pm-item">
            <LifeBuoy size={18} stroke="black" />
            Help
            <ChevronRight className="pm-arrow" size={18} />
          </Link>

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
