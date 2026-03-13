import AppRoutes from "./routes/AppRoutes";
import { ValidationProvider } from "./components/context/ValidationContext";
import { PasswordValidationProvider } from "./components/context/PasswordValidationContext";
import { SavedProvider } from "./context/SavedContext";

function App() {
  return (
    <ValidationProvider>
      <PasswordValidationProvider>
        <SavedProvider>
          <AppRoutes />
        </SavedProvider>
      </PasswordValidationProvider>
    </ValidationProvider>
  );
}

export default App;