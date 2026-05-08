import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  CheckSquare,
  Users,
  AlertTriangle,
  Bell,
  User
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const { pathname } = useLocation(); // 👈 مهم

  return (
    <div className="admin-sidebar">

      <div className="sidebar-container">

        <div className="sidebar-navigation">

          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <LayoutDashboard size={20}/>
            <span>Dashboard</span>
          </NavLink>

          {/* ✅ التعديل هنا */}
          <NavLink 
            to="/admin/properties"
            className={() =>
              pathname.startsWith("/admin/properties") ||
              pathname.startsWith("/admin/property")
                ? "sidebar-item active"
                : "sidebar-item"
            }
          >
            <Home size={20}/>
            <span>Property Listings</span>
          </NavLink>

          <NavLink 
            to="/admin/verification"
            className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <CheckSquare size={20}/>
            <span>Property Verification</span>
          </NavLink>

          <NavLink 
            to="/admin/users"
            className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <Users size={20}/>
            <span>Users</span>
          </NavLink>

          <NavLink 
            to="/admin/reports"
            className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <AlertTriangle size={20}/>
            <span>Reports & Complaints</span>
          </NavLink>

          <NavLink 
            to="/admin/notifications"
            className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <Bell size={20}/>
            <span>Notifications</span>
          </NavLink>

        </div>

      </div>

      <div className="sidebar-admin">
        <User size={20}/>
        <div>
          <p>Admin</p>
          <span>admin@iskan.com</span>
        </div>
      </div>

    </div>
  );
}