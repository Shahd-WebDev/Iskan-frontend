import PaginationControls from "../../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import SkeletonCard from "../../../components/common/SkeletonCard";
import {
  Home,
  UserPlus,
  TriangleAlert,
  CircleCheckBig
} from "lucide-react";
//import {Home,UserPlus,ShieldAlert,CircleCheckBig} from "lucide-react";
//import { Home, UserPlus, RefreshCw, TriangleAlert } from "lucide-react";
import NotificationItem from "../../../components/admin/NotificationItem";
import "./AdminNotifications.css";



const sections = ["Today", "Yesterday", "Earlier"];

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);

  const [unreadCount, setUnreadCount] =
  useState(0);

const pageSize = 7;

 const getSection = (date) => {

  const now = new Date();

  const notificationDate =
    new Date(date);

  const diffHours =
    (now - notificationDate) /
    (1000 * 60 * 60);

  if (diffHours <= 24)
    return "Today";

  if (diffHours <= 48)
    return "Yesterday";

  return "Earlier";
};

  useEffect(() => {

  async function fetchNotifications() {

    try {

      setLoading(true);

      const response = await api.get(
  "/Notification/Get",
  {
    params: {
      PageIndex: pageIndex,
      PageSize: pageSize,
    },
  }
);

const unreadResponse =
  await api.get(
    "/Notification/UnreadCount/unread-count"
  );

setUnreadCount(
  unreadResponse.data
);

      console.log(response.data);
      setTotalPages(
  Math.ceil(
    response.data.count / pageSize
  )
);

      const formattedNotifications =
  response.data.data.map((item) => {

    const uiType =
      item.type === "Reminders"
        ? "warning"
        : item.type === "Property"
        ? "property"
        : item.type === "Registration"
        ? "registration"
        : "system";

    const icon =
  uiType === "property"
    ? Home
    : uiType === "registration"
    ? UserPlus
    : uiType === "system"
    ? CircleCheckBig
    : TriangleAlert;

    return {
      id: item.id,

      title: item.title,

      subtitle: item.content,

      time: item.createdAt,

      unread: !item.isRead,

      type: uiType,

      icon: icon,

      section: getSection(item.createdAt),
    };
});
      setNotifications(
        formattedNotifications
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  fetchNotifications();

}, [pageIndex]);


  // ✅ mark all
  const markAllRead = async () => {

  try {

    await api.put(
      "/Notification/MarkAllRead/read-all"
    );

    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        unread: false,
      }))
    );

    setUnreadCount(0);

  } catch (error) {

    console.log(error);
  }
};

  // ✅ mark one
  const markAsRead = async (id) => {

  try {

    await api.put(
      `/Notification/MarkRead/${id}/read`
    );

    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, unread: false }
          : n
      )
    );

    setUnreadCount(prev =>
      prev > 0 ? prev - 1 : 0
    );

  } catch (error) {

    console.log(error);
  }
};

  // ✅ delete
  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  if (loading) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

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

        <PaginationControls
  currentPage={pageIndex}
  totalPages={totalPages}
  onPageChange={setPageIndex}
  label={`Page ${pageIndex} of ${totalPages}`}
/>

      </div>
    </div>
  );
}