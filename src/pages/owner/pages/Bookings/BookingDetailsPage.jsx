import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  User,
  ShieldCheck,
  Send,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getBookingDetails,
  confirmBooking,
  rejectBooking,
} from "../../../../services/bookings";
import { useProfile } from "../../../../context/ProfileContext";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./BookingDetailsPage.module.css";

// ─── Status Badge ───
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    pending: { label: "Pending", cls: styles["bs--pending"], icon: Clock },
    confirmed: { label: "Confirmed", cls: styles["bs--confirmed"], icon: CheckCircle2 },
    rejected: { label: "Rejected", cls: styles["bs--rejected"], icon: XCircle },
  };
  const cfg = map[s] ?? { label: status, cls: styles["bs--pending"], icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`${styles.badge} ${cfg.cls}`}>
      <Icon size={14} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Booking state
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile Context (for Owner Contact details)
  const { profile } = useProfile();
  const { user: authUser } = useAuth();

  // Actions
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Get Owner details
  const ownerEmail = profile?.email || authUser?.email || "owner@iskann.com";
  const ownerPhone = profile?.phoneNumber || profile?.phone || "+201000000000";

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookingDetails(id);
      setBooking(data);
    } catch (err) {
      console.error("Failed to load booking details:", err);
      setError("Failed to fetch booking details. The booking may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleConfirm = async () => {
    try {
      setActionLoading(true);
      await confirmBooking(id);
      toast.success("Booking successfully confirmed!");
      await fetchDetails();
    } catch (err) {
      toast.error(err?.message || "Failed to confirm booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    try {
      setActionLoading(true);
      setRejectionModalOpen(false);
      await rejectBooking(id, rejectionReason);
      toast.success("Booking request rejected.");
      setRejectionReason("");
      await fetchDetails();
    } catch (err) {
      toast.error(err?.message || "Failed to reject booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const getFullImgUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const formatDate = (dateStr) => {
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

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <RefreshCw size={40} className={styles.spin} />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.errorWrapper}>
        <AlertCircle size={48} />
        <h3>Error Loading Details</h3>
        <p>{error || "Booking not found."}</p>
        <button className={styles.backBtn} onClick={() => navigate("/owner-dashboard/bookings")}>
          <ArrowLeft size={16} /> Back to Bookings
        </button>
      </div>
    );
  }

  // Student fallbacks
  const student = booking.student || {};
  const studentName = student.name || booking.studentName || "Student Guest";
  const studentEmail = student.email || booking.studentEmail || "—";
  const studentPhone = student.phoneNumber || booking.studentPhoneNumber || "—";
  const studentAvatar = student.profileImageUrl || null;

  const isPending = (booking.status || "").toLowerCase() === "pending";

  return (
    <div className={styles.container}>
      {/* Back button and page header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/owner-dashboard/bookings")}>
          <ArrowLeft size={16} /> Back to Bookings
        </button>
        <div className={styles.headerMeta}>
          <h1 className={styles.title}>Booking ID #{booking.id}</h1>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Side: Booking & Property Info */}
        <div className={styles.mainColumn}>
          {/* Property Section */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Building2 size={18} /> Property Information
            </h2>
            <div className={styles.propertyContainer}>
              {booking.propertyMainImageUrl ? (
                <img
                  src={getFullImgUrl(booking.propertyMainImageUrl)}
                  alt={booking.propertyTitle}
                  className={styles.propertyImg}
                />
              ) : (
                <div className={styles.propertyImgPlaceholder}>
                  <Building2 size={32} />
                </div>
              )}
              <div className={styles.propertyDetails}>
                <h3 className={styles.propertyTitle}>{booking.propertyTitle || "Listing Title"}</h3>
                <p className={styles.propertyId}>Property ID: #{booking.propertyId}</p>
                <button
                  className={styles.viewAllPropertyBookingsBtn}
                  onClick={() => navigate(`/owner-dashboard/property-bookings/${booking.propertyId}`)}
                >
                  <Calendar size={14} /> View All Bookings for this Property
                </button>
              </div>
            </div>
          </div>

          {/* Booking Terms Grid */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={18} /> Booking Details
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Requested On</span>
                <span className={styles.detailValue}>{formatDate(booking.bookingDate)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Move In Date</span>
                <span className={styles.detailValue}>{formatDate(booking.moveInDate)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Rental Duration</span>
                <span className={styles.detailValue}>
                  {booking.durationInMonths ? `${booking.durationInMonths} Months` : "—"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Occupants Count</span>
                <span className={styles.detailValue}>
                  {booking.numberOfOccupants ?? 1} {booking.numberOfOccupants === 1 ? "Student" : "Students"}
                </span>
              </div>
            </div>

            {booking.message && (
              <div className={styles.messageBox}>
                <h4 className={styles.messageLabel}>Message from Student:</h4>
                <p className={styles.messageText}>"{booking.message}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Contact Details & Actions */}
        <div className={styles.sidebarColumn}>
          {/* Student Contact Card */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <User size={18} /> Student Contact Information
            </h2>
            <div className={styles.contactProfile}>
              {studentAvatar ? (
                <img
                  src={getFullImgUrl(studentAvatar)}
                  alt={studentName}
                  className={styles.contactAvatar}
                />
              ) : (
                <div className={styles.contactAvatarPlaceholder}>
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className={styles.contactName}>{studentName}</h3>
            </div>

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <span>Email</span>
                  <a href={`mailto:${studentEmail}`} className={styles.contactLink}>
                    {studentEmail}
                  </a>
                </div>
              </div>
              {studentPhone !== "—" && (
                <div className={styles.contactItem}>
                  <Phone size={16} className={styles.contactIcon} />
                  <div className={styles.contactText}>
                    <span>Phone Number</span>
                    <a href={`tel:${studentPhone}`} className={styles.contactLink}>
                      {studentPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Buttons */}
            {studentPhone !== "—" && (
              <div className={styles.quickActions}>
                <a
                  href={`mailto:${studentEmail}`}
                  className={`${styles.actionLink} ${styles.emailLink}`}
                >
                  <Mail size={14} /> Email Student
                </a>
                <a
                  href={`https://wa.me/${studentPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.actionLink} ${styles.whatsappLink}`}
                >
                  <MessageSquare size={14} /> WhatsApp Student
                </a>
                <a href={`tel:${studentPhone}`} className={`${styles.actionLink} ${styles.callLink}`}>
                  <Phone size={14} /> Call Student
                </a>
              </div>
            )}
          </div>

          {/* Owner Contact Card */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <ShieldCheck size={18} /> Owner Contact Information (You)
            </h2>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <span>Your Email</span>
                  <span className={styles.contactValue}>{ownerEmail}</span>
                </div>
              </div>
              {ownerPhone && (
                <div className={styles.contactItem}>
                  <Phone size={16} className={styles.contactIcon} />
                  <div className={styles.contactText}>
                    <span>Your Phone</span>
                    <span className={styles.contactValue}>{ownerPhone}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.quickActions}>
              <a
                href={`mailto:${ownerEmail}?subject=Booking%20Inquiry%20%23${booking.id}`}
                className={`${styles.actionLink} ${styles.emailLink}`}
              >
                <Mail size={14} /> Email Owner
              </a>
              <a
                href={`https://wa.me/${ownerPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionLink} ${styles.whatsappLink}`}
              >
                <MessageSquare size={14} /> WhatsApp Owner
              </a>
              <a href={`tel:${ownerPhone}`} className={`${styles.actionLink} ${styles.callLink}`}>
                <Phone size={14} /> Call Owner
              </a>
            </div>
          </div>

          {/* Booking Actions */}
          {isPending && (
            <div className={styles.actionPanel}>
              <button
                className={styles.approveBtn}
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? "Confirming..." : "Confirm Booking"}
              </button>
              <button
                className={styles.rejectPanelBtn}
                onClick={() => setRejectionModalOpen(true)}
                disabled={actionLoading}
              >
                Reject Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setRejectionModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reject Booking Request</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setRejectionModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Please enter the reason for rejecting this booking request. This reason will be shared with the student.</p>
              <textarea
                className={styles.reasonTextarea}
                placeholder="E.g., The selected move-in date conflicts with an existing occupancy contract."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setRejectionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitBtn}
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
              >
                <Send size={14} /> Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
