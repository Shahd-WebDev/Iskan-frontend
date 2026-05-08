import { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function NotificationItem({ item, onMarkAsRead, onDelete }) {
  const Icon = item.icon;
  const [open, setOpen] = useState(false);

  return (
    <div className={`notification-container ${item.unread ? "unread" : ""}`}>

      <div className="notification-card">
        
        <div className="card-left">
          
          <div className={`icon-box ${item.type}`}>
            <Icon size={16} />
          </div>

          <div className="text-content">
            <p className="title">{item.title}</p>
            <p className="subtitle">{item.subtitle}</p>
            <span className="time">{item.time}</span>
          </div>

        </div>

        {/* نفس الزرار القديم بس زودنا toggle */}
        <div className="menu-wrapper">
          <button
            className="menu-btn"
            onClick={() => setOpen(!open)}
          >
            <MoreVertical size={18} />
          </button>

          {/* dropdown */}
          {open && (
            <div className="dropdown">
              <p
                onClick={() => {
                  onMarkAsRead(item.id);
                  setOpen(false);
                }}
              >
                Mark as read
              </p>

              <p
                onClick={() => {
                  onDelete(item.id);
                  setOpen(false);
                }}
              >
                Delete
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}