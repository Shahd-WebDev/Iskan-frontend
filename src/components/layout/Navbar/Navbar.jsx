import { NavLink, Link } from "react-router-dom";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import "./Navbar.css";

export default function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);

  // 👇 Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`iskan-header ${scrolled ? "scrolled" : ""}`}>
      
      {/* ✅ Top Bar */}
      {showTopBar && (
        <div className="iskan-topbar-wrapper">
          <div className="iskan-topbar">
            ✨ Discover Your Dream Property with Iskan{" "}
            <a href="#" className="iskan-learn">
              Learn More
            </a>
            <button
              className="iskan-close"
              onClick={() => setShowTopBar(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ Main Navbar */}
      <nav className="iskan-navbar">
<div className="iskan-nav-content">          
          {/* Logo */}
          <Link to="/" className="iskan-logo">
            <img src="/logo.png" alt="ISKAN Logo" />
          </Link>

          {/* Desktop Links */}
          <ul className="iskan-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-item-link active-link" : "nav-item-link"
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  isActive ? "nav-item-link active-link" : "nav-item-link"
                }
              >
                Properties
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/faqs"
                className={({ isActive }) =>
                  isActive ? "nav-item-link active-link" : "nav-item-link"
                }
              >
                FAQ’s
              </NavLink>
            </li>
          </ul>

          {/* Right Side */}
          <div className="iskan-right">
            
            {/* Profile */}
            <ProfileMenu />

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setOpenMobile(!openMobile)}
            >
              {openMobile ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {openMobile && (
          <div className="mobile-dropdown">
            <NavLink
              to="/"
              className="mobile-link"
              onClick={() => setOpenMobile(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/properties"
              className="mobile-link"
              onClick={() => setOpenMobile(false)}
            >
              Properties
            </NavLink>

            <NavLink
              to="/faqs"
              className="mobile-link"
              onClick={() => setOpenMobile(false)}
            >
              FAQ’s
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}