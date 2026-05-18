import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import "./Footer.css";

import { FaXTwitter } from "react-icons/fa6";

/* Lucide */
import { Mail, Send } from "lucide-react";

/* Social Icons */
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {

  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Please enter valid email to subscribe");

      return;
    }

    toast.success(
      "Subscribed Successfully ✅"
    );

    setEmail("");
  };

  return (
    <footer className="footer">

      {/* ================= WHITE CARD ================= */}

      <div className="footer-card">
        <div className="container">
          <div className="row align-items-start">

            {/* ================= Logo + Newsletter ================= */}

            <div className="col-md-4">

             <Link to="/">
  <img
    src="/logo.png"
    alt="ISKAN Logo"
    style={{
      width: "130px",
      marginBottom: "28px",
      cursor: "pointer",
    }}
  />
</Link>

              <div className="newsletter-box">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Your Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <button
                  className="newsletter-btn"
                  onClick={handleSubscribe}
                >
                  <Send size={18} />
                </button>

              </div>
            </div>

            {/* ================= Links ================= */}

            <div className="col-md-8 d-flex justify-content-end">
              <div className="footer-links-wrapper">

                <FooterColumn
                  title="Home"
                  links={[
                    {
                      name: "Hero Section",
                      path: "/#hero",
                    },

                    {
                      name: "Properties",
                      path: "/properties",
                    },

                    {
                      name: "FAQs",
                      path: "/faqs",
                    },
                  ]}
                />

                <FooterColumn
                  title="Account"
                  links={[
                    {
                      name: "Login",
                      path: "/login",
                    },

                    {
                      name: "Register",
                      path: "/signup",
                    },
                  ]}
                />

                <FooterColumn
                  title="Contact Us"
                  links={[
                    {
                      name: "Contact Form",
                      path: "/contact",
                    },
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

            <Link
              to="/terms"
              className="footer-terms"
            >
              Terms & Conditions
            </Link>

          </div>

          {/* ================= Social Icons ================= */}

          <div className="footer-social">

            <a
              href="https://www.facebook.com/login"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.linkedin.com/login"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://twitter.com/login"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================= Footer Column ================= */

function FooterColumn({ title, links }) {
  return (
    <div>

      <h6 className="footer-title">
        {title}
      </h6>

      <ul className="footer-list">

        {links.map((link, i) => (
          <li key={i}>
            <Link
              to={link.path}
              className="footer-link"
            >
              {link.name}
            </Link>
          </li>
        ))}

      </ul>
    </div>
  );
}