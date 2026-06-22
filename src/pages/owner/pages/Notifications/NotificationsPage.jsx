import { Bell, CheckCheck, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { useNotifications } from "../../../../hooks/useNotifications";
import styles from "./NotificationsPage.module.css";

// ── Notification type icon map ────────────────────────────────────────────────
const TYPE_ICON = {
  SecurityAlerts:  "🔐",
  ProductUpdates:  "🆕",
  Messages:        "💬",
  Reminders:       "⏰",
  LoginAlerts:     "🔑",
  PasswordChanges: "🔒",
};

function NotificationItem({ notification, onMarkRead }) {
  const isRead = notification.isRead ?? notification.read ?? false;
  const typeIcon = TYPE_ICON[notification.type] ?? "🔔";

  const fmt = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return dateStr; }
  };

  return (
    <div
      className={`${styles["ni-row"]} ${isRead ? styles["ni-row--read"] : styles["ni-row--unread"]}`}
      onClick={() => !isRead && onMarkRead(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !isRead && onMarkRead(notification.id)}
      aria-label={isRead ? "Notification (read)" : "Mark notification as read"}
    >
      <span className={styles["ni-icon"]}>{typeIcon}</span>
      <div className={styles["ni-content"]}>
        <p className={styles["ni-title"]}>
          {notification.title ?? notification.message ?? "Notification"}
          {!isRead && <span className={styles["ni-dot"]} aria-hidden="true" />}
        </p>
        {notification.body && (
          <p className={styles["ni-body"]}>{notification.body}</p>
        )}
        <span className={styles["ni-time"]}>
          <Clock size={11} />
          {notification.timeAgo ?? fmt(notification.createdAt) ?? ""}
        </span>
      </div>
      {!isRead && (
        <button
          className={styles["ni-read-btn"]}
          onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
          title="Mark as read"
        >
          <CheckCheck size={14} />
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    markRead,
    markAllRead,
    loadMore,
    refetch,
  } = useNotifications({ autoFetch: true, pageSize: 20 });

  return (
    <div className={styles["np-wrapper"]}>
      {/* ── Header ── */}
      <div className={styles["np-header"]}>
        <div>
          <h1 className={styles["np-title"]}>
            <Bell size={22} /> Notifications
            {unreadCount > 0 && (
              <span className={styles["np-badge"]}>{unreadCount}</span>
            )}
          </h1>
          <p className={styles["np-subtitle"]}>
            Stay updated with activity on your properties
          </p>
        </div>
        <div className={styles["np-actions"]}>
          <button
            className={styles["np-btn-outline"]}
            onClick={refetch}
            title="Refresh"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          {unreadCount > 0 && (
            <button
              className={styles["np-btn-primary"]}
              onClick={markAllRead}
            >
              <CheckCheck size={15} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles["np-card"]}>
        {loading && notifications.length === 0 ? (
          <div className={styles["np-skeletons"]}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles["np-skeleton-row"]} />
            ))}
          </div>
        ) : error ? (
          <div className={styles["np-error"]}>
            <AlertCircle size={40} />
            <p>{error}</p>
            <button className={styles["np-btn-outline"]} onClick={refetch}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles["np-empty"]}>
            <Bell size={48} />
            <h3>All Caught Up</h3>
            <p>No notifications yet. We'll let you know when something happens.</p>
          </div>
        ) : (
          <>
            <div className={styles["np-list"]}>
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={markRead}
                />
              ))}
            </div>
            {hasMore && (
              <div className={styles["np-load-more"]}>
                <button
                  className={styles["np-btn-outline"]}
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
