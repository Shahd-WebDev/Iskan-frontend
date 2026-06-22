import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, RefreshCw, AlertCircle, Trash2, XCircle } from "lucide-react";
import {
  getBookingsByProperty,
  confirmBooking,
  rejectBooking,
  cancelBooking,
} from "../../../services/bookings";
import toast from "react-hot-toast";

// Import reusable components
import BookingCard from "../Bookings/BookingCard";
import BookingDetailsModal from "../Bookings/BookingDetailsModal";
import BookingStatistics from "../Bookings/BookingStatistics";
import BookingFilters from "../Bookings/BookingFilters";
import BookingEmptyState from "../Bookings/BookingEmptyState";
import BookingSkeleton from "../Bookings/BookingSkeleton";

import styles from "../Bookings/Bookings.module.css";

// =============================================================================
// CONFIRMATION DIALOG MODAL (Confirm Reject/Cancel Actions)
// =============================================================================
function ActionConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, variant, loading }) {
  if (!isOpen) return null;
  const isDanger = variant === "reject";
  const iconCls = isDanger ? styles["confirm-icon--reject"] : styles["confirm-icon--cancel"];

  return (
    <div className={styles["confirm-overlay"]} onClick={onClose}>
      <div className={styles["confirm-panel"]} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles["confirm-icon"]} ${iconCls}`}>
          {isDanger ? <Trash2 size={24} /> : <XCircle size={24} />}
        </div>
        <h3 className={styles["confirm-title"]}>{title}</h3>
        <p className={styles["confirm-message"]}>{message}</p>
        <div className={styles["confirm-actions"]}>
          <button
            className={styles["confirm-btn-cancel"]}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`${styles["confirm-btn-action"]} ${
              isDanger ? styles["confirm-btn-action--reject"] : styles["confirm-btn-action--cancel"]
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN SECTION COMPONENT
// =============================================================================
export default function PropertyBookingsSection({ propertyId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter, Search, and Sort state
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Action status (loading tracker for specific booking card click)
  const [actionLoading, setActionLoading] = useState(null);

  // Modal display states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null, // "reject" | "cancel"
    bookingId: null,
    loading: false,
  });

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getBookingsByProperty(propertyId);
      // Backend returned paginated response: { pageIndex, pageSize, count, data: [...] } or list
      const items = Array.isArray(res) ? res : res?.data ?? [];
      setBookings(items);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Action Handlers
  const handleConfirm = async (id) => {
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

  const triggerReject = (id) => {
    setConfirmModal({
      open: true,
      type: "reject",
      bookingId: id,
      loading: false,
    });
  };

  const triggerCancel = (id) => {
    setConfirmModal({
      open: true,
      type: "cancel",
      bookingId: id,
      loading: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, type: null, bookingId: null, loading: false });
  };

  const handleConfirmAction = async () => {
    const { type, bookingId } = confirmModal;
    if (!bookingId) return;

    setConfirmModal((prev) => ({ ...prev, loading: true }));
    try {
      if (type === "reject") {
        await rejectBooking(bookingId);
        toast.success("Booking request rejected.");
      } else if (type === "cancel") {
        await cancelBooking(bookingId);
        toast.success("Confirmed booking successfully cancelled.");
      }
      fetchBookings();
      closeConfirmModal();
    } catch (err) {
      toast.error(err?.message || `Failed to ${type} booking.`);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  // Memoized Counts for Status badges (All, Pending, Confirmed, Rejected, Cancelled)
  const bookingsCountMap = useMemo(() => {
    const counts = { all: bookings.length, pending: 0, confirmed: 0, rejected: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const status = (b.status || "").toLowerCase();
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    return counts;
  }, [bookings]);

  // Search & Filter & Sort Logic
  const processedBookings = useMemo(() => {
    let result = [...bookings];

    // Filter by tab
    if (activeFilter !== "All") {
      result = result.filter(
        (b) => (b.status || "").toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Search term check
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((b) => {
        const studentName = b.student?.name?.toLowerCase() || "";
        const studentEmail = b.student?.email?.toLowerCase() || "";
        const title = b.propertyTitle?.toLowerCase() || "";
        return studentName.includes(query) || studentEmail.includes(query) || title.includes(query);
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.bookingDate || 0) - new Date(b.bookingDate || 0);
      }
      if (sortBy === "move-in") {
        return new Date(a.moveInDate || 0) - new Date(b.moveInDate || 0);
      }
      return 0;
    });

    return result;
  }, [bookings, activeFilter, searchTerm, sortBy]);

  // Modal settings mapping
  const confirmModalConfigs = {
    reject: {
      title: "Reject Booking Request",
      message: "Are you sure you want to reject this booking? This will cancel the application and notify the student.",
      confirmLabel: "Reject Booking",
    },
    cancel: {
      title: "Cancel Confirmed Booking",
      message: "Are you sure you want to cancel this booking? This action is permanent and the student will be notified.",
      confirmLabel: "Cancel Booking",
    },
  };

  const modalConfig = confirmModal.type ? confirmModalConfigs[confirmModal.type] : {};

  // Header Pending Count Indicator
  const headerPendingCount = bookingsCountMap.pending;

  return (
    <div className={styles["section"]}>
      <div className={styles["section-header"]}>
        <div>
          <h2 className={styles["section-title"]}>
            <Calendar size={20} /> Bookings
          </h2>
          <p className={styles["section-subtitle"]}>
            Manage and view reservation requests for this listing
          </p>
        </div>
        <div className={styles["section-header-right"]}>
          {headerPendingCount > 0 && (
            <span className={styles["pending-alert"]}>
              <AlertCircle size={13} />
              {headerPendingCount} pending request{headerPendingCount !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={fetchBookings}
            disabled={loading}
            className={styles["refresh-btn"]}
            title="Refresh bookings list"
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      <div className={styles["section-body"]}>
        {loading ? (
          <BookingSkeleton />
        ) : error ? (
          <div className={styles["error-state"]}>
            <AlertCircle size={40} />
            <p className={styles["error-message"]}>{error}</p>
            <button className={styles["retry-btn"]} onClick={fetchBookings}>
              <RefreshCw size={14} /> Retry Loading
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <BookingEmptyState />
        ) : (
          <>
            {/* Statistics */}
            <BookingStatistics
              bookings={bookings}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Filter Bar with Search & Sort */}
            <BookingFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              bookingsCountMap={bookingsCountMap}
            />

            {/* Grid display */}
            {processedBookings.length === 0 ? (
              <div className={styles["no-results"]}>
                <p>No reservations matching your filter or search criteria.</p>
              </div>
            ) : (
              <div className={styles["bookings-grid"]}>
                {processedBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onViewDetails={handleViewDetails}
                    onConfirm={handleConfirm}
                    onReject={triggerReject}
                    onCancel={triggerCancel}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Details drawer/modal */}
      <BookingDetailsModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        booking={selectedBooking}
      />

      {/* Confirm Reject/Cancel actions */}
      <ActionConfirmModal
        isOpen={confirmModal.open}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        variant={confirmModal.type}
        loading={confirmModal.loading}
      />
    </div>
  );
}
