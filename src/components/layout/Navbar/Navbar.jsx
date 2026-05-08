// import { NavLink, Link } from "react-router-dom";
// import ProfileMenu from "../../ProfileMenu/ProfileMenu";
// import { Menu, X } from "lucide-react";
// import { useState, useEffect } from "react";

// import "./Navbar.css";

// export default function Navbar() {
//   const [openMobile, setOpenMobile] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [showTopBar, setShowTopBar] = useState(true);

//   // 👇 Detect Scroll
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className={`iskan-header ${scrolled ? "scrolled" : ""}`}>
      
//       {/* ✅ Top Bar */}
//       {showTopBar && (
//         <div className="iskan-topbar-wrapper">
//           <div className="iskan-topbar">
//             ✨ Discover Your Dream Property with Iskan{" "}
//             <a href="#" className="iskan-learn">
//               Learn More
//             </a>
//             <button
//               className="iskan-close"
//               onClick={() => setShowTopBar(false)}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ✅ Main Navbar */}
//       <nav className="iskan-navbar">
// <div className="iskan-nav-content">          
//           {/* Logo */}
//           <Link to="/" className="iskan-logo">
//             <img src="/logo.png" alt="ISKAN Logo" />
//           </Link>

//           {/* Desktop Links */}
//           <ul className="iskan-links">
//             <li>
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   isActive ? "nav-item-link active-link" : "nav-item-link"
//                 }
//               >
//                 Home
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/properties"
//                 className={({ isActive }) =>
//                   isActive ? "nav-item-link active-link" : "nav-item-link"
//                 }
//               >
//                 Properties
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/faqs"
//                 className={({ isActive }) =>
//                   isActive ? "nav-item-link active-link" : "nav-item-link"
//                 }
//               >
//                 FAQ’s
//               </NavLink>
//             </li>
//           </ul>

//           {/* Right Side */}
//           <div className="iskan-right">
            
//             {/* Profile */}
//             <ProfileMenu />

//             {/* Mobile Menu Button */}
//             <button
//               className="mobile-menu-btn"
//               onClick={() => setOpenMobile(!openMobile)}
//             >
//               {openMobile ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>

//         {/* ✅ Mobile Dropdown Menu */}
//         {openMobile && (
//           <div className="mobile-dropdown">
//             <NavLink
//               to="/"
//               className="mobile-link"
//               onClick={() => setOpenMobile(false)}
//             >
//               Home
//             </NavLink>

//             <NavLink
//               to="/properties"
//               className="mobile-link"
//               onClick={() => setOpenMobile(false)}
//             >
//               Properties
//             </NavLink>

//             <NavLink
//               to="/faqs"
//               className="mobile-link"
//               onClick={() => setOpenMobile(false)}
//             >
//               FAQ’s
//             </NavLink>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }


import { NavLink, Link } from "react-router-dom";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import { Menu, X, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

import { useSignIn } from "../../../context/SignInContext";
import "./Navbar.css";

export default function Navbar({ variant }) {
  const { role } = useSignIn();
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);

  const isDashboard = variant === "dashboard";

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

          {/* ── Dashboard variant: Back to Website بدل الـ links ── */}
          {isDashboard ? (
            <Link to="/" className="iskan-back-link">
              <ChevronLeft size={16} />
              Back to Website
            </Link>
          ) : (
            /* ── Normal variant: الـ links العادية ── */
            <ul className="iskan-links">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item-link active-link" : "nav-item-link"}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/properties" className={({ isActive }) => isActive ? "nav-item-link active-link" : "nav-item-link"}>
                  Properties
                </NavLink>
              </li>
              {role === "student" && (
                <li>
                  <NavLink to="/bookings" className={({ isActive }) => isActive ? "nav-item-link active-link" : "nav-item-link"}>
                    My Bookings
                  </NavLink>
                </li>
              )}
              {role === "owner" && (
                <li>
                  <NavLink to="/owner-dashboard/dashboard" className={({ isActive }) => isActive ? "nav-item-link active-link" : "nav-item-link"}>
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/faqs" className={({ isActive }) => isActive ? "nav-item-link active-link" : "nav-item-link"}>
                  FAQ's
                </NavLink>
              </li>
            </ul>
          )}

          {/* Right Side — ProfileMenu دايماً موجود */}
          <div className="iskan-right">
            <ProfileMenu />

            {/* Mobile Menu Button — بس في الـ normal variant */}
            {!isDashboard && (
              <button
                className="mobile-menu-btn"
                onClick={() => setOpenMobile(!openMobile)}
              >
                {openMobile ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown — بس في الـ normal variant */}
        {!isDashboard && openMobile && (
          <div className="mobile-dropdown">
            <NavLink to="/" className="mobile-link" onClick={() => setOpenMobile(false)}>Home</NavLink>
            <NavLink to="/properties" className="mobile-link" onClick={() => setOpenMobile(false)}>Properties</NavLink>
            {role === "student" && <NavLink to="/bookings" className="mobile-link" onClick={() => setOpenMobile(false)}>My Bookings</NavLink>}
            {role === "owner" && <NavLink to="/owner-dashboard/dashboard" className="mobile-link" onClick={() => setOpenMobile(false)}>Dashboard</NavLink>}
            <NavLink to="/faqs" className="mobile-link" onClick={() => setOpenMobile(false)}>FAQ's</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}