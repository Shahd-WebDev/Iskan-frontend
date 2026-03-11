import {  Routes, Route } from "react-router-dom";

/* Layouts */
import Layout from "../components/layout/Layout";
import AuthLayout from "../components/AuthLayout/AuthLayout";

/* Main Pages */
import Home from "../pages/Home/Home";
import Properties from "../pages/properties/Properties";
import PropertyDetails from "../pages/property-details/PropertyDetails";
import FAQs from "../pages/FAQs/FAQs";

/* Auth Pages */
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ChooseAccountType from "../pages/auth/ChooseAccountType";

/* Error */
import NotFound from "../pages/Error/NotFound";

/*Notifications*/
import Notifications from "../pages/Notifications/Notifications";

/*user-settings*/
import SettingsLayout from "../pages/user-settings/SettingsLayout";
import Profile from "../pages/user-settings/Profile";
import Security from "../pages/user-settings/Security";
import Setting_Notifications from "../pages/user-settings/Notifications";

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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="settings" element={<SettingsLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="security" element={<Security />} />
        <Route path="notifications" element={<Setting_Notifications />} />

      </Route>

      {/* ================= Not Found ================= */}
      <Route path="*" element={<NotFound />} />

      {/* ================= Notifications ================= */}

      <Route path="/notifications" element={<Notifications />} />
     
      </Route>
    </Routes>
  );
}
