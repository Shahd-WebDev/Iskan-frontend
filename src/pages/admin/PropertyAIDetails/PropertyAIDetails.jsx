import SkeletonCard from "../../../components/common/SkeletonCard";
import { useEffect, useState } from "react";
import { getPropertyById } from "../../../services/adminProperties";
import { useParams } from "react-router-dom";
import "./PropertyAIDetails.css";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Shield,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
} from "lucide-react";

/* ── Thumbnail status badge ── */
const ThumbBadge = ({ status }) => {
  if (status === "verified")
    return (
      <span className="thumb-badge thumb-badge--verified">
        <CheckCircle size={11} strokeWidth={2.5} />
      </span>
    );
  if (status === "warning")
    return (
      <span className="thumb-badge thumb-badge--warning">
        <AlertTriangle size={11} strokeWidth={2.5} />
      </span>
    );
  return null;
};

export default function PropertyAIDetails() {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const main = property?.images?.find(img => img.isMain);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPropertyById(id);
        console.log("DETAILS:", data);
        setProperty(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {

    if (property?.images?.length > 0) {
      setMainImage(
        "https://isskan-1.runasp.net" + property.images[0].imageUrl
      );
    }

  }, [property]);

  if (loading) {
    return (
      <div className="listings-grid">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  } if (!property) return <div>Not Found</div>;
  const thumbnails = property.images?.map((img, i) => ({
    src: "https://isskan-1.runasp.net" + img.imageUrl,
    label: `Image ${i + 1}`,
    status: img.isMain ? "verified" : "verified"
  })) || [];
  console.log(property.ownerImage);

  return (
    <>
      <h2>{property.title}</h2>
      <p>{property.pricePerMonth} EGP / month</p>
      <p>{property.roomsNumber} rooms • {property.bathroomsNumber} baths</p>
      {/* CARD 1 — PROPERTY IMAGES */}
      <div className="ai-card">

        {/* Header */}
        <div className="ai-card-header">
          <h3 className="ai-card-title">Property Images</h3>
          <button className="ai-powered-btn">
            <Sparkles size={13} />
            AI Powered Analysis
          </button>
        </div>

        {/* Main image */}
        <div className="main-image-wrapper">
          <img
            src={mainImage || "/no-image.png"}
            className="main-image"
            alt="Main Property"
          />          <div className="ai-badge">
            <CheckCircle size={12} />
            <span className="ai-badge__title">High Quality</span>
            <span className="ai-badge__confidence">98% Confidence</span>
          </div>
        </div>

        {/* Thumbnail strip — container أبيض منفصل */}
        <div className="thumbnail-strip">
          <div className="thumbnail-row">
            {thumbnails.map((thumb, i) => (
              <button
                key={i}
                className={`thumb-wrapper${activeThumb === i ? " thumb-wrapper--active" : ""}`}
                onClick={() => { setMainImage(thumb.src); setActiveThumb(i); }}
                aria-label={thumb.label}
              >
                <ThumbBadge status={thumb.status} />
                <img src={thumb.src} className="thumbnail-img" alt={thumb.label} />
              </button>
            ))}
          </div>
        </div>

        {/* AI Quality Analysis — container أبيض منفصل */}
        <div className="ai-analysis-box">
          <p className="analysis-title">AI Quality Analysis</p>
          <div className="analysis-grid">

            <div className="analysis-col">
              <span className="analysis-col__label">Resolution</span>
              <span className="analysis-col__value">1920×1080</span>
              <span className="analysis-col__sub">HD</span>
            </div>

            <span className="analysis-divider" aria-hidden="true" />

            <div className="analysis-col">
              <span className="analysis-col__label">Authenticity</span>
              <span className="analysis-col__value analysis-col__value--blue">Original</span>
              <span className="analysis-col__value analysis-col__value--blue">Image</span>
            </div>

            <span className="analysis-divider" aria-hidden="true" />

            <div className="analysis-col">
              <span className="analysis-col__label">AI Detection</span>
              <span className="analysis-col__value">Not AI</span>
              <span className="analysis-col__value">Generated</span>
            </div>

          </div>
        </div>
      </div>

      {/* CARD 2 — PROPERTY OWNER */}
      <div className="ai-card">

        <h3 className="ai-card-title">Property Owner Information</h3>

        {/* Owner row */}
        <div className="owner-row">
          <div className="owner-avatar-wrap">
            <span className="avatar-badge">
              <Shield size={10} strokeWidth={2.5} />
            </span>
            <img
              src={property.ownerImage || "/user-avatar.jpg"}
              alt={property.ownerName}
              className="owner-avatar"
            />
          </div>

          <div className="owner-info">
            <div className="owner-name-row">
              <h4 className="owner-name">{property.ownerName}</h4>
              <span className="verified-badge">Verified</span>
            </div>
            <p className="owner-meta">
              <Star size={13} className="icon-star" />
              4.8&nbsp;<span className="meta-muted">(24 reviews)</span>
            </p>
            <p className="owner-meta">
              <Calendar size={13} className="icon-neutral" />
              Member since January 2022
            </p>
            <p className="owner-meta">
              <Home size={13} className="icon-neutral" />
              12 Properties Listed
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* Contact details */}
        <p className="section-label">Contact Details</p>
        <div className="contact-grid">

          <div className="contact-card">
            <span className="contact-icon"><Mail size={15} /></span>
            <div>
              <p className="contact-card__label">Email Address</p>
              <p className="contact-card__value">{property.ownerEmail}</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon"><Phone size={15} /></span>
            <div>
              <p className="contact-card__label">Phone Number</p>
              <p className="contact-card__value">+20 100 123 4567</p>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon"><MapPin size={15} /></span>
            <div>
              <p className="contact-card__label">Location</p>
              <p className="contact-card__value">{property.address}</p>
            </div>
          </div>

        </div>

        <hr className="divider" />

        {/* Trust score */}
        <div className="trust-section">
          <div className="trust-header">
            <div>
              <p className="trust-label">Owner Trust Score</p>
              <p className="trust-sub">Based on verification and history</p>
            </div>
            <div className="trust-right">
              <span className="trust-score">92</span>
              <span className="trust-excellent">Excellent</span>
            </div>
          </div>
          <div className="trust-track">
            <div className="trust-fill" style={{ width: "92%" }}>
              <span className="trust-dot" />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
