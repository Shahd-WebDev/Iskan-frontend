import { CheckCircle2, XCircle, Clock } from "lucide-react";
import styles from "./Bookings.module.css";

const STATUS_MAP = {
  pending:   { label: "Pending",   cls: "status-badge--pending",   Icon: Clock },
  confirmed: { label: "Confirmed", cls: "status-badge--confirmed", Icon: CheckCircle2 },
  rejected:  { label: "Rejected",  cls: "status-badge--rejected",  Icon: XCircle },
  cancelled: { label: "Cancelled", cls: "status-badge--cancelled", Icon: XCircle },
};

export default function BookingStatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const cfg = STATUS_MAP[key] ?? { label: status || "Unknown", cls: "status-badge--pending", Icon: Clock };
  const { Icon } = cfg;
  return (
    <span className={`${styles["status-badge"]} ${styles[cfg.cls]}`}>
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
