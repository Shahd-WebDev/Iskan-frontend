import { Calendar } from "lucide-react";
import styles from "./Bookings.module.css";

export default function BookingEmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <div className={styles["empty-icon"]}>
        <Calendar size={40} />
      </div>
      <h3 className={styles["empty-title"]}>No bookings yet for this property</h3>
      <p className={styles["empty-description"]}>
        This property hasn't received any booking requests yet. Once students request a booking, it will appear here.
      </p>
    </div>
  );
}
