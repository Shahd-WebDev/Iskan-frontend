import { Routes, Route } from "react-router-dom";
import SearchResult from "../pages/SearchResults/SearchResults"; // ✅ عدّلي المسار حسب مكان الملف عندك
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
      </Route>

      {/* ================= Not Found ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}