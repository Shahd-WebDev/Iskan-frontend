import "./NotificationItem.css";

export default function NotificationItem({title,time}) {
  return (
    <div className="notification-item">
      <p>{title}</p>
      <span>{time}</span>
    </div>
  );
}