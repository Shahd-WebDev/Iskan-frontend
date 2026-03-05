import AppRoutes from "./routes/AppRoutes";
import { SavedProvider } from "./context/SavedContext";

function App() {
  return (
    <SavedProvider>
      <AppRoutes />
    </SavedProvider>
  );
}

export default App;