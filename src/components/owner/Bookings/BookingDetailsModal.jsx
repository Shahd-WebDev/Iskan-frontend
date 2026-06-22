import { X, User, Mail, Phone, Calendar, Users, Clock, Home } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import styles from "./Bookings.module.css";

// Helper to format dates
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function BookingDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const {
    propertyTitle,
    propertyMainImageUrl,
    bookingDate,
    moveInDate,
    durationInMonths,
    numberOfOccupants,
    status,
    student,
  } = booking;

  // Student info fallback
  const studentName = student?.name || "Student";
  const studentEmail = student?.email || "—";
  const studentPhone = student?.phoneNumber || "—";
  const studentAvatarUrl = student?.profileImageUrl;

  const getFullImgUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-panel"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-header"]}>
          <h3 className={styles["modal-title"]}>
            <Home size={18} /> Booking Details
          </h3>
          <button className={styles["modal-close-btn"]} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles["modal-body"]}>
          {/* Property Section */}
          <div className={styles["modal-section"]}>
            <h4 className={styles["modal-section-label"]}>Property Details</h4>
            <div className={styles["modal-property-card"]}>
              {propertyMainImageUrl ? (
                <img
                  src={getFullImgUrl(propertyMainImageUrl)}
                  alt={propertyTitle}
                  className={styles["modal-property-img"]}
                />
              ) : (
                <div className={styles["modal-property-img-placeholder"]}>
                  <Home size={24} />
                </div>
              )}
              <h5 className={styles["modal-property-title"]}>{propertyTitle}</h5>
            </div>
          </div>

          {/* Student Section */}
          <div className={styles["modal-section"]}>
            <h4 className={styles["modal-section-label"]}>Student Details</h4>
            <div className={styles["modal-student-card"]}>
              <div className={styles["modal-avatar"]}>
                {studentAvatarUrl ? (
                  <img src={getFullImgUrl(studentAvatarUrl)} alt={studentName} />
                ) : (
                  studentName.charAt(0).toUpperCase()
                )}
              </div>
              <div className={styles["modal-student-details"]}>
                <h5 className={styles["modal-student-name"]}>{studentName}</h5>
                <div className={styles["modal-student-contact-row"]}>
                  <Mail size={14} />
                  {student?.email ? (
                    <a href={`mailto:${studentEmail}`}>{studentEmail}</a>
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <div className={styles["modal-student-contact-row"]}>
                  <Phone size={14} />
                  {student?.phoneNumber ? (
                    <a href={`tel:${studentPhone}`}>{studentPhone}</a>
                  ) : (
                    <span>—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className={styles["modal-section"]}>
            <h4 className={styles["modal-section-label"]}>Booking Details</h4>
            <div className={styles["modal-detail-grid"]}>
              <div className={styles["modal-detail-item"]}>
                <p className={styles["modal-detail-label"]}>Move In Date</p>
                <p className={styles["modal-detail-value"]}>{formatDateOnly(moveInDate)}</p>
              </div>
              <div className={styles["modal-detail-item"]}>
                <p className={styles["modal-detail-label"]}>Duration</p>
                <p className={styles["modal-detail-value"]}>
                  {durationInMonths ? `${durationInMonths} Months` : "—"}
                </p>
              </div>
              <div className={styles["modal-detail-item"]}>
                <p className={styles["modal-detail-label"]}>Occupants</p>
                <p className={styles["modal-detail-value"]}>{numberOfOccupants ?? "—"} occupants</p>
              </div>
              <div className={styles["modal-detail-item"]}>
                <p className={styles["modal-detail-label"]}>Request Date</p>
                <p className={styles["modal-detail-value"]}>{formatDate(bookingDate)}</p>
              </div>
              <div className={styles["modal-detail-item"]} style={{ gridColumn: "span 2" }}>
                <p className={styles["modal-detail-label"]}>Status</p>
                <div style={{ marginTop: 4 }}>
                  <BookingStatusBadge status={status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["modal-footer"]}>
          <button className={styles["confirm-btn-cancel"]} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
