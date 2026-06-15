import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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

import AdminPropertyDetails from "../pages/admin/AdminPropertyDetails/AdminPropertyDetails";

import Users from "../pages/admin/Users/Users";
import Reports from "../pages/admin/Reports/Reports";
import AdminNotifications from "../pages/admin/AdminNotifications/AdminNotifications";

/* Main Pages */
import Home from "../pages/Home/Home";
import Properties from "../pages/properties/Properties";
import PropertyDetails from "../pages/property-details/PropertyDetails";
import FAQs from "../pages/FAQs/FAQs";
import SavedProperties from "../pages/SavedProperties/SavedProperties";
import Terms from "../pages/Terms/Terms";

/* Auth Pages */
import Login from "../pages/auth/Login";
// import Signup from "../pages/auth/Signup";
import Register from "../pages/auth/Registeration/Register";
import ChooseAccountType from "../pages/auth/ChooseAccountType";
import ForgotPassword from "../pages/auth/forgot-password/ForgotPassword";
import CheckEmail from "../pages/auth/forgot-password/CheckEmail";
import ResetPassword from "../pages/auth/forgot-password/ResetPassword";

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
import ReviewsPage from "../pages/owner/pages/Reviews/ReviewsPage";



export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= Authentication ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/choose-account" element={<ChooseAccountType />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ================= Main Website ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/terms" element={<Terms />} />
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
        <Route element={<ProtectedRoute allowedRoles={["Admin", "admin"]} />}>
  <Route path="admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="properties" element={<PropertyListings />} />
    <Route path="verification" element={<PropertyVerification />} />

  <Route
  path="property-details/:id"
  element={<AdminPropertyDetails />}
/>
    <Route path="property/:id" element={<PropertyAIDetails />} />
    <Route path="users" element={<Users />} />
    <Route path="reports" element={<Reports />} />
    <Route path="notifications" element={<AdminNotifications />} />
  </Route>
</Route>

</Route>

     {/* ================= Owner Dashboard ================= */}  
      <Route element={<ProtectedRoute allowedRoles={["Owner", "owner"]} />}>
        <Route path="/owner-dashboard" element={<OwnerLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="add-property" element={<AddPropertyPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
<Route
  path="profile"
  element={
    <Profile
      role="owner"
      showSuccessMessage={true}
    />
  }
/>            <Route path="security" element={<Security />} />
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
