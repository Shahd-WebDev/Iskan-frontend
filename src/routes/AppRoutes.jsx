import { Routes, Route } from "react-router-dom";

import Home from "../pages/user/Home";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}
