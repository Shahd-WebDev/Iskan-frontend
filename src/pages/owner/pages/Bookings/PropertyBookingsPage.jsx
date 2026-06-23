import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Send,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import {
  getBookingsByProperty,
  confirmBooking,
  rejectBooking,
} from "../../../../services/bookings";
import toast from "react-hot-toast";
import styles from "./PropertyBookingsPage.module.css";

// ─── Status badge helper ───
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
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

export default function PropertyBookingsPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  // Booking states
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination states
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Pending", "Confirmed", "Rejected"
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  // Actions
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    bookingId: null,
    reason: "",
  });

  const getFullImgUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        PageIndex: pageIndex,
        PageSize: pageSize,
      };

      if (statusFilter !== "All") {
        params.Status = statusFilter;
      }

      const result = await getBookingsByProperty(propertyId, params);
      
      const items = Array.isArray(result) 
        ? result 
        : (result?.data || result?.items || []);
      const count = result?.count ?? result?.totalCount ?? items.length;

      setBookings(items);
      setTotalCount(count);
    } catch (err) {
      console.error("Failed to load property bookings:", err);
      setError("Failed to load bookings. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }, [propertyId, pageIndex, pageSize, statusFilter]);

  useEffect(() => {
    if (propertyId) {
      fetchBookings();
    }
  }, [fetchBookings, propertyId]);

  // Handle filter changes (reset pageIndex to 1)
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPageIndex(1);
  };

  // Confirm booking action
  const handleConfirm = async (e, id) => {
    e.stopPropagation(); // Avoid navigating to details
    try {
      setActionLoading(id);
      await confirmBooking(id);
      toast.success("Booking successfully confirmed!");
      fetchBookings();
    } catch (err) {
      toast.error(err?.message || "Failed to confirm booking.");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject dialog trigger
  const triggerReject = (e, id) => {
    e.stopPropagation(); // Avoid navigating to details
    setRejectionModal({
      open: true,
      bookingId: id,
      reason: "",
    });
  };

  // Submit rejection action
  const handleRejectSubmit = async () => {
    const { bookingId, reason } = rejectionModal;
    if (!bookingId) return;

    try {
      setActionLoading(bookingId);
      setRejectionModal({ open: false, bookingId: null, reason: "" });
      await rejectBooking(bookingId, reason);
      toast.success("Booking request rejected.");
      fetchBookings();
    } catch (err) {
      toast.error(err?.message || "Failed to reject booking.");
    } finally {
      setActionLoading(null);
    }
  };

  // Client side search filtering over fetched data
  const filteredBookings = bookings.filter((b) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    
    const sName = b.studentName?.toLowerCase() || "";
    const sEmail = b.studentEmail?.toLowerCase() || "";
    const sPhone = b.studentPhoneNumber?.toLowerCase() || "";
    
    return sName.includes(query) || sEmail.includes(query) || sPhone.includes(query);
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

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

  const propertyTitle = bookings.length > 0 ? bookings[0].propertyTitle : "Property";

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/owner-dashboard/properties")}>
        <ArrowLeft size={16} /> Back to Properties
      </button>

      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Building2 size={24} className={styles.titleIcon} /> Bookings for {propertyTitle}
          </h1>
          <p className={styles.subtitle}>
            Manage booking requests for property #{propertyId}.
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchBookings} title="Refresh Bookings">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {["All", "Pending", "Confirmed", "Rejected"].map((status) => (
            <button
              key={status}
              className={`${styles.filterTab} ${statusFilter === status ? styles.activeTab : ""}`}
              onClick={() => handleStatusFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by student, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <div className={styles.loadingWrapper}>
          <RefreshCw size={40} className={styles.spin} />
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className={styles.errorWrapper}>
          <AlertCircle size={48} />
          <h3>Something Went Wrong</h3>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={fetchBookings}>
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className={styles.emptyWrapper}>
          <Calendar size={64} />
          <h3>No Bookings Found</h3>
          <p>
            {searchTerm
              ? "No booking requests match your search filter."
              : `You do not have any ${statusFilter !== "All" ? statusFilter.toLowerCase() : ""} bookings for this property.`}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredBookings.map((b) => {
            const isPending = (b.status || "").toLowerCase() === "pending";
            const imgUrl = getFullImgUrl(b.propertyMainImageUrl);

            return (
              <div
                key={b.id}
                className={styles.card}
                onClick={() => navigate(`/owner-dashboard/bookings/${b.id}`)}
              >
                {/* Card Header (Image & Title) */}
                <div className={styles.cardHeader}>
                  {imgUrl ? (
                    <img src={imgUrl} alt={b.propertyTitle} className={styles.propertyImg} />
                  ) : (
                    <div className={styles.propertyImgPlaceholder}>
                      <Building2 size={24} />
                    </div>
                  )}
                  <div className={styles.propertyMeta}>
                    <h3 className={styles.propertyTitle}>Booking #{b.id}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  {/* Student profile */}
                  <div className={styles.studentSection}>
                    <div className={styles.studentInfo}>
                      <span className={styles.studentLabel}>Student:</span>
                      <span className={styles.studentName}>{b.studentName || "Anonymous"}</span>
                    </div>
                    {/* Contact Quick links */}
                    <div className={styles.contactRow} onClick={(e) => e.stopPropagation()}>
                      {b.studentEmail && (
                        <a
                          href={`mailto:${b.studentEmail}`}
                          className={styles.contactIcon}
                          title={`Email ${b.studentName}`}
                        >
                          <Mail size={14} />
                        </a>
                      )}
                      {b.studentPhoneNumber && (
                        <>
                          <a
                            href={`https://wa.me/${b.studentPhoneNumber.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactIcon}
                            title="WhatsApp"
                          >
                            <MessageSquare size={14} />
                          </a>
                          <a
                            href={`tel:${b.studentPhoneNumber}`}
                            className={styles.contactIcon}
                            title="Call"
                          >
                            <Phone size={14} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Booking parameters */}
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Requested:</span>
                      <span className={styles.detailValue}>{formatDate(b.bookingDate)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Move In:</span>
                      <span className={styles.detailValue}>{formatDate(b.moveInDate)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Duration:</span>
                      <span className={styles.detailValue}>
                        {b.durationInMonths ? `${b.durationInMonths} Months` : "—"}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Occupants:</span>
                      <span className={styles.detailValue}>
                        {b.numberOfOccupants ?? 1} {b.numberOfOccupants === 1 ? "Person" : "People"}
                      </span>
                    </div>
                  </div>

                  {/* Student Message */}
                  {b.message && (
                    <div className={styles.messageBox}>
                      <p className={styles.messageLabel}>Message from student:</p>
                      <p className={styles.messageText}>"{b.message}"</p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className={styles.cardFooter}>
                  <button
                    className={styles.viewDetailsBtn}
                    onClick={() => navigate(`/owner-dashboard/bookings/${b.id}`)}
                  >
                    <Eye size={14} /> View Details
                  </button>

                  {isPending && (
                    <div className={styles.actionGroup}>
                      <button
                        className={styles.confirmBtn}
                        onClick={(e) => handleConfirm(e, b.id)}
                        disabled={actionLoading === b.id}
                      >
                        {actionLoading === b.id ? "Confirming..." : "Confirm"}
                      </button>
                      <button
                        className={styles.rejectBtn}
                        onClick={(e) => triggerReject(e, b.id)}
                        disabled={actionLoading === b.id}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalCount > pageSize && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className={styles.pageInfo}>
            Page <strong>{pageIndex}</strong> of {totalPages} ({totalCount} total)
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
            disabled={pageIndex === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal.open && (
        <div className={styles.modalOverlay} onClick={() => setRejectionModal({ open: false, bookingId: null, reason: "" })}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reject Booking Request</h3>
              <button
                className={styles.closeModalBtn}
                onClick={() => setRejectionModal({ open: false, bookingId: null, reason: "" })}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Please enter the reason for rejecting this booking request. This reason will be shared with the student.</p>
              <textarea
                className={styles.reasonTextarea}
                placeholder="E.g., The selected move-in date conflicts with an existing occupancy contract."
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal((prev) => ({ ...prev, reason: e.target.value }))}
                rows={4}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setRejectionModal({ open: false, bookingId: null, reason: "" })}
              >
                Cancel
              </button>
              <button
                className={styles.modalSubmitBtn}
                onClick={handleRejectSubmit}
                disabled={!rejectionModal.reason.trim()}
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
