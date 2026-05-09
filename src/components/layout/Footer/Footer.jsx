import { Link } from "react-router-dom";
import "./Footer.css";

/* Lucide (UI icons بس) */
import { Mail, Send } from "lucide-react";

/* Social Media Icons (real logos) */
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      {/* ================= WHITE CARD ================= */}
      <div className="footer-card">
        <div className="container">
          <div className="row align-items-start">
            {/* Logo + Newsletter */}
            <div className="col-md-4">
              <img
                src="/logo.png"
                alt="ISKAN Logo"
                style={{ width: "130px", marginBottom: "28px" }}
              />

              <div className="newsletter-box">
                <Mail size={18} />
<input
  type="email"
  name="email"
  id="email"
  placeholder="Enter Your Email"
    autoComplete="email"
/>                <button className="newsletter-btn">
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="col-md-8 d-flex justify-content-end">
              <div className="footer-links-wrapper">
                <FooterColumn
                  title="Home"
                  links={[
                    { name: "Hero Section", path: "/#hero" },
                    { name: "Properties", path: "/properties" },
                    { name: "FAQs", path: "/faqs" },
                  ]}
                />

                <FooterColumn
                  title="Properties"
                  links={[
                    { name: "Portfolio", path: "/portfolio" },
                    { name: "Categories", path: "/categories" },
                    { name: "Our Offices", path: "/offices" },
                  ]}
                />

                <FooterColumn
                  title="Contact Us"
                  links={[
                    { name: "Contact Form", path: "/contact" },
                    { name: "Our Offices", path: "/offices" },
                  ]}
                />
              </div>
            </div>
          </div>

          <hr className="footer-divider" />
        </div>
      </div>

      {/* ================= Bottom Section ================= */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-bottom-left">
            <p className="footer-copy">
              ©2025 Iskan. All Rights Reserved.
            </p>

            <Link to="/terms" className="footer-terms">
              Terms & Conditions
            </Link>
          </div>

          <div className="footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Footer Column */
function FooterColumn({ title, links }) {
  return (
    <div>
      <h6 className="footer-title">{title}</h6>

      <ul className="footer-list">
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.path} className="footer-link">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}