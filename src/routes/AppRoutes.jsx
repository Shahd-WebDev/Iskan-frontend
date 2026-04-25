import { Routes, Route, Navigate } from "react-router-dom";
import SignInVerifyRole from "./SignInVerifyRole";
import SearchResult from "../pages/SearchResults/SearchResults";

/* Layouts */
import Layout from "../components/layout/Layout";
import AuthLayout from "../components/AuthLayout/AuthLayout";

/* Admin Layout */
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";

/* Admin Pages */
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import PropertyListings from "../pages/admin/PropertyListings/PropertyListings";
import PropertyVerification from "../pages/admin/PropertyVerification/PropertyVerification";
import PropertyAIDetails from "../pages/admin/PropertyAIDetails/PropertyAIDetails";
import Users from "../pages/admin/Users/Users";
import Reports from "../pages/admin/Reports/Reports";
import AdminNotifications from "../pages/admin/AdminNotifications/AdminNotifications";

/* Main Pages */
import Home from "../pages/Home/Home";
import Properties from "../pages/properties/Properties";
import PropertyDetails from "../pages/property-details/PropertyDetails";
import FAQs from "../pages/FAQs/FAQs";
import SavedProperties from "../pages/SavedProperties/SavedProperties";

/* Auth Pages */
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ChooseAccountType from "../pages/auth/ChooseAccountType";

/* Error */
import NotFound from "../pages/Error/NotFound";

/* Notifications */
import Notifications from "../pages/Notifications/Notifications";

/* User Settings */
import SettingsLayout from "../pages/user-settings/SettingsLayout";
import Profile from "../pages/user-settings/Profile";
import Security from "../pages/user-settings/Security";
import Setting_Notifications from "../pages/user-settings/Notifications";

/* Owner Dashboard */
import OwnerLayout from "../pages/owner/layout/OwnerLayout";
import Messages from "../components/owner/Messages";
import DashboardPage from "../pages/owner/pages/Dashboard/DashboardPage";
import PropertiesPage from "../pages/owner/pages/Properties/PropertiesPage";
import AddPropertyPage from "../pages/owner/pages/AddProperty/AddPropertyPage";


export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= Authentication ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/choose-account" element={<ChooseAccountType />} />
      </Route>

      {/* ================= Main Website ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/bookings" element={<div>My Bookings Page (Student Only)</div>} />

        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/search" element={<SearchResult />} />

        <Route path="/notifications" element={<Notifications />} />

        <Route path="settings" element={<SettingsLayout />}>
          <Route path="profile" element={<Profile role="student" />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<Setting_Notifications />} />
        </Route>

        {/* ================= Admin Dashboard ================= */}
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<PropertyListings />} />
          <Route path="verification" element={<PropertyVerification />} />
          <Route path="property/:id" element={<PropertyAIDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>
      </Route>

     {/* ================= Owner Dashboard ================= */}  
      <Route element={<SignInVerifyRole allowedRole="owner" />}>
        <Route path="/owner-dashboard" element={<OwnerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="add-property" element={<AddPropertyPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile role="owner" />} />
            <Route path="security" element={<Security />} />
            <Route path="notifications" element={<Setting_Notifications />} />
          </Route>
          <Route path="verification" element={<div>Verification Process...</div>} />
        </Route>
      </Route>

      {/* ================= Not Found ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}