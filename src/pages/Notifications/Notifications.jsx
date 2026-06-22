import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./notifications.module.css";
import {
  MessageSquare,
  Star,
  Calendar,
  AlertTriangle,
  Building2,
  Info,
  CheckCircle2,
  Check,
  RefreshCw,
  Bell,
} from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../context/AuthContext";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    refetch,
  } = useNotifications();

  // On page load, fetch latest notifications
  useEffect(() => {
    refetch();
  }, []);

  const getIcon = (type = "", title = "") => {
    const t = type.toLowerCase();
    const ttl = title.toLowerCase();
    if (t.includes("booking") || ttl.includes("booking")) {
      return <Calendar size={20} className={styles.icon} style={{ color: "#10B981" }} />;
    }
    if (t.includes("review") || ttl.includes("review") || ttl.includes("rating")) {
      return <Star size={20} className={styles.icon} style={{ color: "#F59E0B" }} />;
    }
    if (t.includes("message") || ttl.includes("message") || ttl.includes("chat")) {
      return <MessageSquare size={20} className={styles.icon} style={{ color: "#3B82F6" }} />;
    }
    if (t.includes("report") || ttl.includes("report")) {
      return <AlertTriangle size={20} className={styles.icon} style={{ color: "#EF4444" }} />;
    }
    if (t.includes("property") || ttl.includes("property")) {
      return <Building2 size={20} className={styles.icon} style={{ color: "#8B5CF6" }} />;
    }
    return <Info size={20} className={styles.icon} style={{ color: "#6B7280" }} />;
  };

  // Filter out property verification notifications: Approved, Pending, Rejected
  const filteredNotifications = notifications.filter((item) => {
    const title = (item.title || "").toLowerCase();
    const message = (item.message || "").toLowerCase();
    const type = (item.type || "").toLowerCase();

    const isVerification =
      title.includes("approved") ||
      title.includes("pending") ||
      title.includes("rejected") ||
      message.includes("approved") ||
      message.includes("pending") ||
      message.includes("rejected") ||
      type.includes("verification") ||
      type.includes("verify");

    return !isVerification;
  });

  // Sort newest first
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const dateA = a.createdAt || a.date || 0;
    const dateB = b.createdAt || b.date || 0;
    return new Date(dateB) - new Date(dateA);
  });

  // Calculate unread count specifically for filtered notifications
  const filteredUnreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (item) => {
    // Mark read
    if (!item.isRead) {
      await markRead(item.id);
    }

    const title = (item.title || "").toLowerCase();
    let detectedType = (item.type || "").toLowerCase();
    if (!detectedType) {
      if (title.includes("booking")) detectedType = "booking";
      else if (title.includes("review") || title.includes("rating")) detectedType = "review";
      else if (title.includes("message") || title.includes("chat")) detectedType = "message";
      else if (title.includes("report")) detectedType = "report";
      else if (title.includes("property")) detectedType = "property";
    }

    const propertyId = item.propertyId || item.targetId || item.referenceId;
    const role = user?.role?.toLowerCase();

    if (detectedType.includes("booking")) {
      if (role === "owner") {
        navigate("/owner-dashboard/bookings");
      } else {
        navigate("/bookings");
      }
    } else if (detectedType.includes("review")) {
      if (role === "owner") {
        navigate("/owner-dashboard/reviews");
      } else {
        navigate("/");
      }
    } else if (detectedType.includes("message")) {
      if (role === "owner") {
        navigate("/owner-dashboard/messages");
      } else {
        navigate("/");
      }
    } else if (detectedType.includes("report")) {
      if (role === "admin") {
        navigate("/admin/reports");
      } else {
        navigate("/");
      }
    } else if (detectedType.includes("property")) {
      if (propertyId) {
        if (role === "owner") {
          navigate(`/owner-properties/${propertyId}`);
        } else {
          navigate(`/properties/${propertyId}`);
        }
      } else {
        if (role === "owner") {
          navigate("/owner-dashboard/properties");
        } else {
          navigate("/properties");
        }
      }
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
            Notifications
            {filteredUnreadCount > 0 && (
              <span className={styles.badge}>{filteredUnreadCount}</span>
            )}
          </h2>
          {filteredUnreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={markAllRead}>
              Mark All as Read
            </button>
          )}
        </div>
        <p style={{ color: "#64748b", marginTop: "4px" }}>Stay updated with your bookings, reviews, and messages.</p>
      </div>

      {loading && sortedNotifications.length === 0 ? (
        /* Loading Skeleton */
        <div className={styles.list}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={styles.card}
              style={{
                background: "#ffffff",
                animation: "shimmer 1.5s infinite linear",
                backgroundSize: "200% 100%",
                backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                height: "80px",
                border: "1px solid #e2e8f0",
              }}
            ></div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className={styles.empty}>
          <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: "12px" }} />
          <h3>Failed to load notifications</h3>
          <p>{error}</p>
          <button className={styles.markAllBtn} onClick={refetch}>
            <RefreshCw size={14} style={{ marginRight: "6px" }} />
            Retry
          </button>
        </div>
      ) : sortedNotifications.length === 0 ? (
        /* Empty State */
        <div className={styles.empty}>
          <Bell size={40} style={{ color: "#94a3b8", marginBottom: "12px" }} />
          <h3>No notifications yet</h3>
          <p>You are all caught up! When you get new notifications, they will appear here.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {sortedNotifications.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${
                item.isRead ? styles.read : styles.unread
              }`}
              onClick={() => handleNotificationClick(item)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.icon}>
                {getIcon(item.type, item.title)}
              </div>

              <div className={styles.content}>
                <h4 style={{ fontWeight: item.isRead ? "600" : "700", color: "#0f172a" }}>
                  {item.title}
                </h4>
                <p style={{ color: "#334155" }}>{item.message || item.description}</p>
                <span style={{ color: "#94a3b8" }}>{formatTimeAgo(item.createdAt || item.date)}</span>
              </div>

              {!item.isRead && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className={styles.readBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(item.id);
                    }}
                    title="Mark as Read"
                  >
                    <Check size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}