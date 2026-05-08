import { useState } from "react";
import { Home, UserPlus, RefreshCw, TriangleAlert } from "lucide-react";
import NotificationItem from "../../../components/admin/NotificationItem";
import "./AdminNotifications.css";

const notificationsData = [
  { id: 1, section: "Today", icon: TriangleAlert , title: "Critical Alert: AI detected high probability of fake images", subtitle: "in Listing #452", time: "1 hour ago", type: "critical", unread: true },
  { id: 2, section: "Today", icon: Home, title: "Property Verified", subtitle: '"Spacious 2BR Apartment" by Michael Chen has been verified', time: "3 hours ago", type: "property", unread: true },
  { id: 3, section: "Today", icon: TriangleAlert, title: "Suspicious Activity Detected", subtitle: "Multiple failed login attempts for user @john_smith", time: "5 hours ago", type: "warning", unread: true },
  { id: 4, section: "Today", icon: Home, title: "Suspicious Activity Detected", subtitle: "Spacious 2BR apartment by Michael Chen has been verified", time: "5 hours ago", type: "property", unread: false },
  { id: 5, section: "Yesterday", icon: UserPlus, title: "New Landlord Registration", subtitle: "Emma Wilson joined as a Landlord", time: "Yesterday", type: "registration", unread: false },
  { id: 6, section: "Yesterday", icon: RefreshCw, title: "System Update Completed", subtitle: "Platform updated to version 2.4.1", time: "Yesterday", type: "system", unread: false },
  { id: 7, section: "Earlier", icon: Home, title: "Property Listing Expired", subtitle: '"Downtown Loft" by Robert Williams has expired', time: "2 days ago", type: "property", unread: false },
];

const sections = ["Today", "Yesterday", "Earlier"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);

  const unreadCount = notifications.filter(n => n.unread).length;

  // ✅ mark all
  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  // ✅ mark one
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  // ✅ delete
  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  return (
    <div className="page-wrapper">
      <div className="notifications-inner">

        {/* HEADER */}
        <div className="notif-header">
          <h5>Notifications</h5>
          <p>
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
          <button className="mark-all-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>

        {/* SECTIONS */}
        {sections.map(section => {
          const items = notifications.filter(n => n.section === section);
          if (!items.length) return null;

          return (
            <div key={section} className="section-block">
              <p className="section-title">{section}</p>

              <div className="section-group">
                {items.map(item => (
<NotificationItem
  key={item.id}
  item={item}
  onMarkAsRead={markAsRead}
  onDelete={deleteNotification}
/>                ))}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}