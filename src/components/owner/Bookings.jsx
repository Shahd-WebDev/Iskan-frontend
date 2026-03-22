import { useState } from "react";
import { CheckCircle2, XCircle, CalendarDays, Users, Clock } from "lucide-react";
import "./Bookings.css";

const MOCK_BOOKINGS = [
  {
    id: 1,
    initials: "DT",
    color: "#d97706",
    name: "David Thompson",
    property: "Modern Downtown Apartment",
    checkIn: "Dec 15, 2024",
    checkOut: "May 15, 2025",
    occupants: "2 people",
    requestedAt: "Dec 1, 2024, 11:00 AM",
    status: "pending",
  },
  {
    id: 2,
    initials: "SJ",
    color: "#4f46e5",
    name: "Sarah Johnson",
    property: "Modern Downtown Apartment",
    checkIn: "Jan 1, 2025",
    checkOut: "Jun 1, 2025",
    occupants: "1 person",
    requestedAt: "Nov 27, 2024, 10:30 AM",
    status: "approved",
  },
  {
    id: 3,
    initials: "MC",
    color: "#0891b2",
    name: "Michael Chen",
    property: "Luxury Beach House",
    checkIn: "Feb 1, 2025",
    checkOut: "Jul 1, 2025",
    occupants: "4 people",
    requestedAt: "Nov 25, 2024, 03:15 PM",
    status: "rejected",
  },
];

function getBookings() {
  const saved = localStorage.getItem("bookings");
  return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
}

function saveBookings(bookings) {
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function StatusBadge({ status }) {
  if (status === "approved")
    return <span className="bk-badge bk-badge--approved">Approved</span>;
  if (status === "rejected")
    return <span className="bk-badge bk-badge--rejected">Rejected</span>;
  return null;
}

export default function Bookings() {
  const [bookings, setBookings] = useState(getBookings);
  const [filter, setFilter] = useState("all");

  const pending  = bookings.filter((b) => b.status === "pending");
  const approved = bookings.filter((b) => b.status === "approved");
  const rejected = bookings.filter((b) => b.status === "rejected");

  const visible =
    filter === "pending"  ? pending  :
    filter === "approved" ? approved :
    filter === "rejected" ? rejected :
    bookings;

  function updateStatus(id, status) {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    saveBookings(updated);
  }

  const filters = [
  { key: "all",      label: `All (${bookings.length})` },
  { key: "pending",  label: `Pending (${pending.length})`,  dot: pending.length > 0 },
  { key: "approved", label: `Approved (${approved.length})` },
  { key: "rejected", label: `Rejected (${rejected.length})` },
];

  return (
    <div className="bk-page">
      {/* Filter pills */}
      <div className="bk-filter-pills">
        {filters.map(({ key, label, dot }) => (
            <button
                key={key}
                className={`bk-pill ${filter === key ? "bk-pill--active" : ""}`}
                onClick={() => setFilter(key)}
            >
                {dot && <span className="bk-pill-dot" />}
                {label}
            </button>
            ))}
      </div>

      {/* Cards */}
      <div className="bk-list">
        {visible.length === 0 && (
          <p style={{ color: "#7F7F80", fontSize: 14 }}>No bookings found.</p>
        )}
        {visible.map((bk) => (
          <div key={bk.id} className="bk-card">
            <div className="bk-card-header">
              <div className="bk-avatar" style={{ background: bk.color }}>
                {bk.initials}
              </div>
              <div className="bk-card-title">
                <span className="bk-name">{bk.name}</span>
                <span className="bk-property">{bk.property}</span>
              </div>
              {bk.status !== "pending" && <StatusBadge status={bk.status} />}
            </div>

            <div className="bk-dates">
              <div className="bk-date-col">
                <span className="bk-date-label"><CalendarDays size={12} /> Check-in</span>
                <span className="bk-date-val">{bk.checkIn}</span>
              </div>
              <div className="bk-date-col">
                <span className="bk-date-label"><CalendarDays size={12} /> Check-out</span>
                <span className="bk-date-val">{bk.checkOut}</span>
              </div>
              <div className="bk-date-col">
                <span className="bk-date-label"><Users size={12} /> Occupants</span>
                <span className="bk-date-val">{bk.occupants}</span>
              </div>
            </div>

            <div className="bk-requested">
              <Clock size={12} />
              Requested: {bk.requestedAt}
            </div>

            {bk.status === "pending" && (
              <div className="bk-actions">
                <button
                  className="bk-btn bk-btn--accept"
                  onClick={() => updateStatus(bk.id, "approved")}
                >
                  <CheckCircle2 size={15} /> Accept
                </button>
                <button
                  className="bk-btn bk-btn--reject"
                  onClick={() => updateStatus(bk.id, "rejected")}
                >
                  <XCircle size={15} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}