import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerByGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { decodeToken } from "../utils/decodeToken";

export function useGoogleAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse, role = null) => {
    try {
      // ======================
      // GET ID TOKEN (IMPORTANT)
      // ======================
      console.log("FULL GOOGLE RESPONSE:", credentialResponse);

      const idToken = credentialResponse?.credential;

      if (!idToken) {
        console.error("❌ Missing Google credential");
        toast.error("Google token missing");
        return;
      }

      console.log("✅ ID TOKEN:", idToken);

      // ======================
      // MAP ROLE
      // ======================
      const apiRole =
        role === null
          ? null
          : role === "owner"
          ? "Owner"
          : "Student";

      console.log("ROLE SENT TO API:", apiRole);

      // ======================
      // API CALL (IMPORTANT FIX)
      // ======================
      const res = await registerByGoogle({
        idToken: idToken,
        role: apiRole,
      });

      console.log("API RESPONSE:", res);

      const token = res.token || res.data?.token;

      if (!token) {
        console.error("❌ No token from backend:", res);
        toast.error("No token received from server");
        return;
      }

      // ======================
      // DECODE TOKEN
      // ======================
      const decoded = decodeToken(token);

      if (!decoded) {
        console.error("❌ Invalid token decode");
        toast.error("Invalid or expired token");
        return;
      }

      const detectedRole =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        decoded.role ||
        "Student";

      // ======================
      // USER OBJECT
      // ======================
      const userData = {
        email: res.email || res.data?.email || decoded.email || "",
        name: res.name || res.data?.name || "User",
        role: detectedRole,
        verificationStatus: res.verificationStatus || res.data?.verificationStatus || null,
        status: res.status || res.data?.status || decoded.status || null,
      };

      // ======================
      // SAVE AUTH
      // ======================
      login(token, userData);

      toast.success("Google login successful");

      // ======================
      // NAVIGATION
      // ======================
      if (detectedRole === "Owner") {
        navigate("/owner-dashboard/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Google Auth Error:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  return { handleGoogleSuccess };
}