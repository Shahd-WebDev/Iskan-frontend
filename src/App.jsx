import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { SavedProvider } from "./context/SavedContext";
import { PropertyProvider } from "./context/PropertyContext";
function App() {
  return (
    <>
      <PropertyProvider>
        <SavedProvider>
          <AppRoutes />
        </SavedProvider>
      </PropertyProvider>

      <Toaster position="top-right" />
    </>
  );
}

export default App;