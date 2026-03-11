import React, { useState, useEffect } from "react";

import styles from "./notifications.module.css";
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Check,
  RotateCcw,
  Trash2,
} from "lucide-react";

const defaultNotifications = [
  {
    id: 1,
    title: "New Message from Property Owner",
    desc: "John Smith sent you a message regarding your booking request.",
    time: "2 minutes ago",
    icon: "message",
    read: false,
  },
  {
    id: 2,
    title: "Booking Confirmed",
    desc: "Your booking for Studio Apartment has been confirmed.",
    time: "1 hour ago",
    icon: "success",
    read: false,
  },
  {
    id: 3,
    title: "Payment Due Soon",
    desc: "Your monthly rent payment is due in 3 days.",
    time: "3 hours ago",
    icon: "warning",
    read: true,
  },
  {
    id: 4,
    title: "Property Inspection Scheduled",
    desc: "Routine inspection scheduled for next week.",
    time: "1 day ago",
    icon: "info",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageCircle size={20} />;
      case "success":
        return <CheckCircle size={20} />;
      case "warning":
        return <AlertCircle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return null;
    }
  };

  // حفظ البيانات في localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // عدد الرسائل الغير مقروءة
  const unreadCount = notifications.filter((n) => !n.read).length;

  // تعليم كـ مقروء
  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // تعليم كـ غير مقروء
  const markUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  // حذف إشعار
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // تعليم الكل كمقروء
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2>
            Notifications
            <span className={styles.badge}>{unreadCount}</span>
          </h2>
          <button className={styles.markAllBtn} onClick={markAllRead}>
            Mark All as Read
          </button>
        </div>
        <p>Stay updated with your bookings and messages</p>
      </div>

      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <Info size={40} />
            <h3>No Notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${
                item.read ? styles.read : styles.unread
              }`}
            >
              <div className={styles.icon}>{getIcon(item.icon)}</div>

              <div className={styles.content}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <span>{item.time}</span>
              </div>

              <div className={styles.actions}>
                {item.read ? (
                  <button
                    className={styles.unreadBtn}
                    onClick={() => markUnread(item.id)}
                  >
                    <RotateCcw size={16} />
                  </button>
                ) : (
                  <button
                    className={styles.readBtn}
                    onClick={() => markRead(item.id)}
                  >
                    <Check size={16} />
                  </button>
                )}

                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteNotification(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}