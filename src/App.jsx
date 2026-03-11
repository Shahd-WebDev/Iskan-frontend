import AppRoutes from "./routes/AppRoutes";
import { ValidationProvider } from "./components/context/ValidationContext";
import { PasswordValidationProvider } from "./components/context/PasswordValidationContext";

function App() {
  return (
    <ValidationProvider>
      <PasswordValidationProvider>
        <AppRoutes />
      </PasswordValidationProvider>
    </ValidationProvider>
  );
}

export default App;