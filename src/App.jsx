import { Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ChooseAccountType from "./pages/Auth/ChooseAccountType";
import NotFound from "./pages/Error/NotFound";

function App() {
  return (
    <Routes>
      {/* الصفحة الرئيسية */}
      <Route path="/" element={<Login />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/choose-account" element={<ChooseAccountType />} />

      {/* Error Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
