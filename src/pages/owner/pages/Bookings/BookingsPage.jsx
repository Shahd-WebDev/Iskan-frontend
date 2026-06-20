import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { getOwnerProperties } from "../../../../services/ownerProperties";
import {
  getBookingsByProperty,
  confirmBooking,
  rejectBooking,
  cancelBooking,
} from "../../../../services/bookings";
import VerificationBadge from "../../../../components/owner/VerificationBadge";
import styles from "./BookingsPage.module.css";

// ─── Status badge helper ─────────────────────────────────────────────────────
function BookingStatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    pending:  { label: "Pending",   cls: styles["bs--pending"],   icon: Clock },
    confirmed:{ label: "Confirmed", cls: styles["bs--confirmed"], icon: CheckCircle2 },
    rejected: { label: "Rejected",  cls: styles["bs--rejected"],  icon: XCircle },
    cancelled:{ label: "Cancelled", cls: styles["bs--cancelled"], icon: XCircle },
  };
  const cfg = map[s] ?? { label: status, cls: styles["bs--pending"], icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`${styles["bs"]} ${cfg.cls}`}>
      <Icon size={12} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

// ─── Individual booking card ──────────────────────────────────────────────────
function BookingCard({ booking, onConfirm, onReject, onCancel, actionLoading }) {
  const [expanded, setExpanded] = useState(false);
  const id = booking.id;
  const status = (booking.status || booking.bookingStatus || "").toLowerCase();
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";

  const fmt = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return dateStr; }
  };

  return (
    <div className={styles["bk-card"]}>
      <div className={styles["bk-card-header"]} onClick={() => setExpanded((v) => !v)}>
        <div className={styles["bk-card-left"]}>
          <div className={styles["bk-avatar"]}>
            <User size={18} />
          </div>
          <div>
            <p className={styles["bk-student-name"]}>
              {booking.studentName || booking.tenantName || "Student"}
            </p>
            <p className={styles["bk-date"]}>
              Move-in: {fmt(booking.moveInDate)} · {booking.durationInMonths ?? "?"} mo
            </p>
          </div>
        </div>
        <div className={styles["bk-card-right"]}>
          <BookingStatusBadge status={booking.status || booking.bookingStatus} />
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className={styles["bk-card-body"]}>
          <dl className={styles["bk-details"]}>
            <dt>Occupants</dt>
            <dd>{booking.numberOfOccupants ?? "—"}</dd>
            <dt>Move-in Date</dt>
            <dd>{fmt(booking.moveInDate)}</dd>
            <dt>Duration</dt>
            <dd>{booking.durationInMonths ? `${booking.durationInMonths} months` : "—"}</dd>
            <dt>Student Email</dt>
            <dd>{booking.studentEmail || booking.tenantEmail || "—"}</dd>
          </dl>
          {booking.message && (
            <div className={styles["bk-message"]}>
              <p className={styles["bk-message-label"]}>Message from student</p>
              <p className={styles["bk-message-text"]}>{booking.message}</p>
            </div>
          )}
          <div className={styles["bk-actions"]}>
            {isPending && (
              <>
                <button
                  className={`${styles["bk-btn"]} ${styles["bk-btn--confirm"]}`}
                  onClick={() => onConfirm(id)}
                  disabled={actionLoading === id}
                >
                  <CheckCircle2 size={15} />
                  {actionLoading === id ? "Confirming…" : "Confirm"}
                </button>
                <button
                  className={`${styles["bk-btn"]} ${styles["bk-btn--reject"]}`}
                  onClick={() => onReject(id)}
                  disabled={actionLoading === id}
                >
                  <XCircle size={15} />
                  {actionLoading === id ? "Rejecting…" : "Reject"}
                </button>
              </>
            )}
            {isConfirmed && (
              <button
                className={`${styles["bk-btn"]} ${styles["bk-btn--cancel"]}`}
                onClick={() => onCancel(id)}
                disabled={actionLoading === id}
              >
                <XCircle size={15} />
                {actionLoading === id ? "Cancelling…" : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [propertiesError, setPropertiesError] = useState(null);
  const [bookingsError, setBookingsError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // booking id being actioned

  // ── Load owner properties for the selector ──────────────────────────────
  const fetchProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);
      const result = await getOwnerProperties({ PageIndex: 1, PageSize: 100 });
      const items = result?.data ?? [];
      setProperties(items);
      if (items.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(items[0].id);
      }
    } catch {
      setPropertiesError("Failed to load properties.");
    } finally {
      setPropertiesLoading(false);
    }
  }, [selectedPropertyId]);

  // ── Load bookings for selected property ─────────────────────────────────
  const fetchBookings = useCallback(async (propertyId) => {
    if (!propertyId) return;
    try {
      setBookingsLoading(true);
      setBookingsError(null);
      const data = await getBookingsByProperty(propertyId);
      // Backend returns either an array or a paginated result
      const items = Array.isArray(data) ? data : data?.data ?? [];
      setBookings(items);
    } catch {
      setBookingsError("Failed to load bookings for this property.");
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);
  useEffect(() => {
    if (selectedPropertyId) fetchBookings(selectedPropertyId);
  }, [selectedPropertyId, fetchBookings]);

  // ── Booking actions ──────────────────────────────────────────────────────
  const handleConfirm = async (id) => {
    try {
      setActionLoading(id);
      await confirmBooking(id);
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: "Confirmed", bookingStatus: "Confirmed" } : b)
      );
    } catch {
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await rejectBooking(id);
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: "Rejected", bookingStatus: "Rejected" } : b)
      );
    } catch {
      alert("Failed to reject booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      setActionLoading(id);
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: "Cancelled", bookingStatus: "Cancelled" } : b)
      );
    } catch {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  const pendingCount = bookings.filter(
    (b) => (b.status || b.bookingStatus || "").toLowerCase() === "pending"
  ).length;

  return (
    <div className={styles["bp-wrapper"]}>
      {/* ── Page Header ── */}
      <div className={styles["bp-header"]}>
        <div>
          <h1 className={styles["bp-title"]}>
            <Calendar size={24} /> Bookings
          </h1>
          <p className={styles["bp-subtitle"]}>
            Review and manage booking requests for your properties
          </p>
        </div>
        {pendingCount > 0 && (
          <span className={styles["bp-pending-chip"]}>
            <AlertCircle size={14} />
            {pendingCount} pending action{pendingCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className={styles["bp-body"]}>
        {/* ── Property Selector Sidebar ── */}
        <aside className={styles["bp-sidebar"]}>
          <p className={styles["bp-sidebar-label"]}>Select Property</p>
          {propertiesLoading ? (
            <div className={styles["bp-sidebar-skeleton"]}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles["bp-skeleton-item"]} />
              ))}
            </div>
          ) : propertiesError ? (
            <div className={styles["bp-error-small"]}>
              <AlertCircle size={16} />
              {propertiesError}
            </div>
          ) : properties.length === 0 ? (
            <div className={styles["bp-empty-small"]}>
              <Building2 size={24} />
              <p>No properties found.</p>
            </div>
          ) : (
            properties.map((p) => (
              <button
                key={p.id}
                className={`${styles["bp-prop-btn"]} ${
                  selectedPropertyId === p.id ? styles["bp-prop-btn--active"] : ""
                }`}
                onClick={() => setSelectedPropertyId(p.id)}
              >
                <Building2 size={16} />
                <span className={styles["bp-prop-btn-label"]}>{p.title}</span>
                <VerificationBadge status={p.verificationStatus} size="sm" />
              </button>
            ))
          )}
        </aside>

        {/* ── Bookings List ── */}
        <section className={styles["bp-main"]}>
          {selectedProperty && (
            <div className={styles["bp-prop-info"]}>
              <Building2 size={18} />
              <span>{selectedProperty.title}</span>
              <VerificationBadge status={selectedProperty.verificationStatus} size="sm" />
              <button
                className={styles["bp-refresh-btn"]}
                onClick={() => fetchBookings(selectedPropertyId)}
                title="Refresh bookings"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}

          {bookingsLoading ? (
            <div className={styles["bp-skeletons"]}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles["bp-skeleton-card"]} />
              ))}
            </div>
          ) : bookingsError ? (
            <div className={styles["bp-error"]}>
              <AlertCircle size={40} />
              <p>{bookingsError}</p>
              <button
                className={styles["bp-retry-btn"]}
                onClick={() => fetchBookings(selectedPropertyId)}
              >
                <RefreshCw size={15} /> Retry
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className={styles["bp-empty"]}>
              <Calendar size={48} />
              <h3>No Bookings Yet</h3>
              <p>
                {selectedProperty
                  ? `No booking requests for "${selectedProperty.title}" so far.`
                  : "Select a property to view its bookings."}
              </p>
            </div>
          ) : (
            <div className={styles["bp-list"]}>
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onCancel={handleCancel}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
