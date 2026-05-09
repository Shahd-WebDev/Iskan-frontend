import AppRoutes from "./routes/AppRoutes";
import { SavedProvider } from "./context/SavedContext";
import { PropertyProvider } from "./context/PropertyContext";
import RoleSwitcher from "./components/RoleSwitcher/RoleSwitcher";

function App() {
  return (
    <PropertyProvider>
      <SavedProvider>
        <AppRoutes />
        <RoleSwitcher />
      </SavedProvider>
    </PropertyProvider>
  );
}

export default App;