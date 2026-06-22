import { User, Mail, Phone, Calendar, Users, Timer, Info, CheckCircle2, XCircle } from "lucide-react";
import BookingStatusBadge from "./BookingStatusBadge";
import styles from "./Bookings.module.css";

// Helper to format dates
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function BookingCard({
  booking,
  onViewDetails,
  onConfirm,
  onReject,
  onCancel,
  actionLoading,
}) {
  const {
    id,
    propertyTitle,
    propertyMainImageUrl,
    bookingDate,
    moveInDate,
    durationInMonths,
    numberOfOccupants,
    status,
    student,
  } = booking;

  const currentStatus = (status || "").toLowerCase();
  const isPending = currentStatus === "pending";
  const isConfirmed = currentStatus === "confirmed";
  const isLoading = actionLoading === id;

  // Student info fallback
  const studentName = student?.name || "Student";
  const studentEmail = student?.email || "—";
  const studentPhone = student?.phoneNumber || "—";
  const studentAvatarUrl = student?.profileImageUrl;

  // Fallback property image using base URL prefix if needed or standard upload folder
  const getFullImgUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  return (
    <div className={styles["bk-card"]}>
      {/* Property Image Header */}
      {propertyMainImageUrl ? (
        <img
          src={getFullImgUrl(propertyMainImageUrl)}
          alt={propertyTitle}
          className={styles["bk-property-img"]}
        />
      ) : (
        <div className={styles["bk-property-img-placeholder"]}>
          <Calendar size={36} />
        </div>
      )}

      {/* Card Content */}
      <div className={styles["bk-body"]}>
        <div className={styles["bk-status-row"]}>
          <h4 className={styles["bk-property-title"]} title={propertyTitle}>
            {propertyTitle}
          </h4>
          <BookingStatusBadge status={status} />
        </div>

        {/* Student Information Block */}
        <div className={styles["bk-student"]}>
          <div className={styles["bk-avatar"]}>
            {studentAvatarUrl ? (
              <img src={getFullImgUrl(studentAvatarUrl)} alt={studentName} />
            ) : (
              studentName.charAt(0).toUpperCase()
            )}
          </div>
          <div className={styles["bk-student-info"]}>
            <p className={styles["bk-student-name"]}>{studentName}</p>
            <p className={styles["bk-student-contact"]}>
              <Mail size={12} /> {studentEmail}
            </p>
            {student?.phoneNumber && (
              <p className={styles["bk-student-contact"]}>
                <Phone size={12} /> {studentPhone}
              </p>
            )}
          </div>
        </div>

        {/* Booking Details Grid/Chips */}
        <div className={styles["bk-chips"]}>
          <div className={styles["bk-chip"]}>
            <span className={styles["bk-chip-label"]}>Move In</span>
            <span className={styles["bk-chip-value"]}>{formatDate(moveInDate)}</span>
          </div>
          <div className={styles["bk-chip"]}>
            <span className={styles["bk-chip-label"]}>Duration</span>
            <span className={styles["bk-chip-value"]}>
              {durationInMonths ? `${durationInMonths} Months` : "—"}
            </span>
          </div>
          <div className={styles["bk-chip"]}>
            <span className={styles["bk-chip-label"]}>Occupants</span>
            <span className={styles["bk-chip-value"]}>
              {numberOfOccupants ?? "—"} Students
            </span>
          </div>
          <div className={styles["bk-chip"]}>
            <span className={styles["bk-chip-label"]}>Requested</span>
            <span className={styles["bk-chip-value"]}>{formatDate(bookingDate)}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className={styles["bk-footer"]}>
        <button
          onClick={() => onViewDetails(booking)}
          className={styles["bk-view-btn"]}
          title="View Details"
        >
          <Info size={14} /> View Details
        </button>

        {isPending && (
          <>
            <button
              id={`confirm-btn-${id}`}
              onClick={() => onConfirm(id)}
              disabled={isLoading}
              className={`${styles["bk-action-btn"]} ${styles["bk-action-btn--confirm"]}`}
            >
              <CheckCircle2 size={14} /> Confirm
            </button>
            <button
              id={`reject-btn-${id}`}
              onClick={() => onReject(id)}
              disabled={isLoading}
              className={`${styles["bk-action-btn"]} ${styles["bk-action-btn--reject"]}`}
            >
              <XCircle size={14} /> Reject
            </button>
          </>
        )}

        {isConfirmed && (
          <button
            id={`cancel-btn-${id}`}
            onClick={() => onCancel(id)}
            disabled={isLoading}
            className={`${styles["bk-action-btn"]} ${styles["bk-action-btn--cancel"]}`}
          >
            <XCircle size={14} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}
