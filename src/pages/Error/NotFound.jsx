import { Link } from "react-router-dom";
import "../../styles/notfound.css";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        {/* Icon */}
        <div className="notfound-icon">
          <SearchX size={42} />
        </div>

        {/* Text */}
        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
          The page you are looking for doesn’t exist or has <br />
          been moved.
        </p>

        {/* Button */}
        <Link to="/" className="notfound-btn">
          <Home size={18} />
          Go to Home
        </Link>
      </div>
    </div>
  );
}
