import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { SavedProvider } from "./context/SavedContext";
import { PropertyProvider } from "./context/PropertyContext";
import RoleSwitcher from "./components/RoleSwitcher/RoleSwitcher";

function App() {
  return (
    <>
      <PropertyProvider>
        <SavedProvider>
          <AppRoutes />
          <RoleSwitcher />
        </SavedProvider>
      </PropertyProvider>

      <Toaster position="top-right" />
    </>
  );
}

export default App;