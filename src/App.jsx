import AppRoutes from "./routes/AppRoutes";
import { ValidationProvider } from "./components/context/ValidationContext";
import { PasswordValidationProvider } from "./components/context/PasswordValidationContext";
import { SavedProvider } from "./context/SavedContext";
import { PropertyProvider } from "./context/PropertyContext";
import RoleSwitcher from "./components/RoleSwitcher/RoleSwitcher";

function App() {
  return (
    <PropertyProvider>
      <ValidationProvider>
        <PasswordValidationProvider>
          <SavedProvider>
            <AppRoutes />
            <RoleSwitcher />
          </SavedProvider>
        </PasswordValidationProvider>
      </ValidationProvider>
    </PropertyProvider>
  );
}

export default App;