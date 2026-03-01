import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  // الصفحات اللي محتاجة full width
  const fullWidthPages = ["/"]; // home page

  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <>
      <Navbar />

      <main className="page-shell">
        {isFullWidth ? (
          <Outlet /> // بدون container
        ) : (
          <div className="page-container">
            <Outlet />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}