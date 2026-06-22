import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import styles from "./Bookings.module.css";

export default function BookingStatistics({ bookings, activeFilter, onFilterChange }) {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status?.toLowerCase() === "pending").length;
  const confirmed = bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length;
  const rejected = bookings.filter((b) => b.status?.toLowerCase() === "rejected").length;
  const cancelled = bookings.filter((b) => b.status?.toLowerCase() === "cancelled").length;

  const stats = [
    { label: "Total Bookings", value: total, key: "All", mod: "total", Icon: Calendar },
    { label: "Pending", value: pending, key: "Pending", mod: "pending", Icon: Clock },
    { label: "Confirmed", value: confirmed, key: "Confirmed", mod: "confirmed", Icon: CheckCircle2 },
    { label: "Rejected", value: rejected, key: "Rejected", mod: "rejected", Icon: XCircle },
    { label: "Cancelled", value: cancelled, key: "Cancelled", mod: "cancelled", Icon: AlertCircle },
  ];

  return (
    <div className={styles["stats-grid"]}>
      {stats.map(({ label, value, key, mod, Icon }) => {
        const isActive = activeFilter.toLowerCase() === key.toLowerCase();
        return (
          <div
            key={mod}
            onClick={() => onFilterChange(key)}
            className={`${styles["stat-card"]} ${styles[`stat-card--${mod}`]} ${
              isActive ? styles["stat-card--active"] : ""
            }`}
          >
            <div className={styles["stat-icon"]}>
              <Icon size={16} />
            </div>
            <p className={styles["stat-value"]}>{value}</p>
            <p className={styles["stat-label"]}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}
