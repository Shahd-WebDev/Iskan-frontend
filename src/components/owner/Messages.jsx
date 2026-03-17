import { useState } from "react";
import {
  MessageSquare,
  CalendarDays,
  Reply,
  Trash2,
  CheckCircle2,
  Star,
} from "lucide-react";
import "./Messages.css";
import Bookings from "./Bookings";

const INITIAL_MESSAGES = [
  {
    id: 1,
    initials: "SJ",
    color: "#4f46e5",
    name: "Sarah Johnson",
    property: "Modern Downtown Apartment",
    rating: 5,
    date: "Nov 25, 2024, 10:30 AM",
    text: "Amazing property! The location is perfect and the apartment is exactly as described. The owner was very responsive and helpful throughout the entire process. Highly recommend!",
    reply: null,
  },
  {
    id: 2,
    initials: "MC",
    color: "#0891b2",
    name: "Michael Chen",
    property: "Luxury Beach House",
    rating: 4,
    date: "Nov 28, 2024, 02:15 PM",
    text: "Beautiful beach house with stunning views. The only minor issue was the AC in one bedroom, but overall a great experience.",
    reply: {
      date: "Nov 28, 2024, 04:45 PM",
      text: "Thank you for your feedback, Michael! We've addressed the AC issue and it's been serviced. We appreciate your review and hope to host you again soon!",
    },
  },
  {
    id: 3,
    initials: "ER",
    color: "#059669",
    name: "Emily Rodriguez",
    property: "Cozy Studio Apartment",
    rating: 5,
    date: "Nov 30, 2024, 09:20 AM",
    text: "Perfect for a solo professional! Clean, well-maintained, and in a great neighborhood. Communication with the owner was excellent.",
    reply: null,
  },
  {
    id: 4,
    initials: "DT",
    color: "#d97706",
    name: "David Thompson",
    property: "Modern Downtown Apartment",
    rating: 2,
    date: "Dec 1, 2024, 11:00 AM",
    text: "The apartment is nice, but there were some issues with noise from nearby construction. Would have appreciated a heads up about this.",
    reply: null,
  },
];

function StarRating({ rating }) {
  return (
    <div className="mb-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          color={i < rating ? "#0088FF" : "#d1d5db"}
          fill={i < rating ? "#0088FF" : "none"}
        />
      ))}
    </div>
  );
}

export default function Messages() {
  const [tab, setTab] = useState("messages");
  const [msgFilter, setMsgFilter] = useState("all");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [openReplyId, setOpenReplyId] = useState(null);

  const unreplied = messages.filter((m) => !m.reply);
  const replied   = messages.filter((m) => m.reply);

  const visibleMessages =
    msgFilter === "unreplied" ? unreplied :
    msgFilter === "replied"   ? replied   :
    messages;

  // عدد الـ pending bookings من localStorage
  const pendingBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    .filter((b) => b.status === "pending").length;

  function sendReply(id) {
    const text = replyDrafts[id]?.trim();
    if (!text) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              reply: {
                date: new Date().toLocaleString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                }),
                text,
              },
            }
          : m
      )
    );
    setReplyDrafts((d) => ({ ...d, [id]: "" }));
    setOpenReplyId(null);
  }

  function deleteReply(id) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reply: null } : m))
    );
  }

  return (
    <div className="mb-page">
      {/* Header */}
      <div className="mb-header">
        <h1 className="mb-title">Messages & Bookings</h1>
        <p className="mb-subtitle">Respond to customer reviews and manage booking requests</p>
      </div>

      {/* Tabs */}
      <div className="mb-tabs">
        <button
          className={`mb-tab ${tab === "messages" ? "mb-tab--active" : ""}`}
          onClick={() => setTab("messages")}
        >
          <MessageSquare size={15} />
          Messages
          {unreplied.length > 0 && (
            <span className="mb-tab-dot">{unreplied.length}</span>
          )}
        </button>
        <button
          className={`mb-tab ${tab === "bookings" ? "mb-tab--active" : ""}`}
          onClick={() => setTab("bookings")}
        >
          <CalendarDays size={15} />
          Bookings
          {pendingBookings > 0 && (
            <span className="mb-tab-dot mb-tab-dot--orange">{pendingBookings}</span>
          )}
        </button>
      </div>

      {/* Messages Tab */}
      {tab === "messages" && (
        <>
          <div className="mb-filter-pills">
            {[
              { key: "all",       label: `All (${messages.length})` },
              { key: "unreplied", label: `Unreplied (${unreplied.length})` },
              { key: "replied",   label: `Replied (${replied.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`mb-pill ${msgFilter === key ? "mb-pill--active" : ""}`}
                onClick={() => setMsgFilter(key)}
              >
                {key === "unreplied" && unreplied.length > 0 && (
                  <span className="mb-pill-dot" />
                )}
                {label}
              </button>
            ))}
          </div>

          <div className="mb-messages">
            {visibleMessages.map((msg) => (
              <div key={msg.id} className="mb-card">
                <div className="mb-card-top">
                  <div className="mb-card-avatar" style={{ background: msg.color }}>
                    {msg.initials}
                  </div>
                  <div className="mb-card-body">
                    <span className="mb-card-name">{msg.name}</span>
                    <span className="mb-card-property">{msg.property}</span>
                    <div className="mb-card-rating-row">
                      <StarRating rating={msg.rating} />
                      <span className="mb-card-date">{msg.date}</span>
                    </div>
                    <p className="mb-card-text">{msg.text}</p>

                    {msg.reply && (
                      <div className="mb-reply-box">
                        <div className="mb-reply-header">
                          <CheckCircle2 size={14} className="mb-reply-icon" />
                          <span className="mb-reply-label">Your Reply</span>
                          <span className="mb-reply-date">{msg.reply.date}</span>
                          <button
                            className="mb-reply-delete"
                            onClick={() => deleteReply(msg.id)}
                            title="Delete reply"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="mb-reply-text">{msg.reply.text}</p>
                      </div>
                    )}

                    {!msg.reply && openReplyId === msg.id && (
                      <div className="mb-reply-input-wrap">
                        <textarea
                          className="mb-reply-textarea"
                          placeholder="Write your reply ..."
                          value={replyDrafts[msg.id] || ""}
                          onChange={(e) =>
                            setReplyDrafts((d) => ({ ...d, [msg.id]: e.target.value }))
                          }
                          rows={3}
                        />
                        <div className="mb-reply-actions">
                          <button
                            className="mb-btn mb-btn--primary"
                            onClick={() => sendReply(msg.id)}
                          >
                            <Reply size={14} />
                            Send Reply
                          </button>
                          <button
                            className="mb-btn mb-btn--ghost"
                            onClick={() => setOpenReplyId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {!msg.reply && openReplyId !== msg.id && (
                      <button
                        className="mb-btn mb-btn--primary mb-btn--reply"
                        onClick={() => setOpenReplyId(msg.id)}
                      >
                        <Reply size={14} />
                        Reply to Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && <Bookings />}
    </div>
  );
}