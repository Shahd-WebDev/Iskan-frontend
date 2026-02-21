import { Link } from "react-router-dom";
import "./Footer.css";

/* Social Icons */
import facebook from "../../../assets/facebook.png";
import linkedin from "../../../assets/linkedin.png";
import twitter from "../../../assets/Twitter.png";
import youtube from "../../../assets/youtube.png";

/* Newsletter Icons */
import emailIcon from "../../../assets/email.png";
import sendIcon from "../../../assets/send.png";

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
                <img src={emailIcon} alt="email" width="17" />
                <input type="email" placeholder="Enter Your Email" />
                <button className="newsletter-btn">
                  <img src={sendIcon} alt="send" width="17" />
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="col-md-8 d-flex justify-content-end">
              <div className="footer-links-wrapper">
                <FooterColumn
                  title="Home"
                  links={[
                    { name: "Hero Section", path: "/" },
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

      {/* ================= Bottom Wave Section ================= */}
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
            {[facebook, linkedin, twitter, youtube].map((icon, index) => (
              <a key={index} href="#">
                <img src={icon} alt="social" />
              </a>
            ))}
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