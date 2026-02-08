import WavesBg from "../../assets/Group.png";
import "../../styles/auth.css";

export default function AuthLayout({ children }) {
  return (
    <div
      className="auth-page"
      style={{
        backgroundColor: "#E5F3FF",
        backgroundImage: `url(${WavesBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}
