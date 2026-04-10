import { Routes, Route, Navigate  } from "react-router-dom";
import SearchResult from "../pages/SearchResults/SearchResults";

/* Layouts */
import Layout from "../components/layout/Layout";
import AuthLayout from "../components/AuthLayout/AuthLayout";

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
import OwnerDashboard from "../pages/owner/Ownerdashboard";
import Messages from "../components/owner/Messages";


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
        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="settings" element={<SettingsLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<Setting_Notifications />} />
        </Route>
      </Route>

      {/* ================= Owner Dashboard ================= */}
      <Route path="/owner-dashboard" element={<OwnerDashboard />}>
        <Route path="dashboard" element={<div>Dashboard</div>} />
        <Route path="properties" element={<div>My Properties</div>} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile showSuccessMessage={true} />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<Setting_Notifications />} />
        </Route>
      </Route>

      {/* ================= Not Found ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}