import { CheckCircle2, Clock, XCircle } from "lucide-react";
import styles from "./VerificationBadge.module.css";

/**
 * VerificationBadge
 * Props:
 *   status  — "Pending" | "Approved" | "Rejected"
 *   size    — "sm" | "md" (default "md")
 */
export default function VerificationBadge({ status, size = "md" }) {
  const s = status || "Pending";

  const config = {
    Approved: {
      label: "Approved",
      icon: CheckCircle2,
      cls: styles["badge--approved"],
    },
    Pending: {
      label: "Under Review",
      icon: Clock,
      cls: styles["badge--pending"],
    },
    Rejected: {
      label: "Rejected",
      icon: XCircle,
      cls: styles["badge--rejected"],
    },
  };

  const { label, icon: Icon, cls } = config[s] ?? config.Pending;
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span className={`${styles.badge} ${cls} ${styles[`badge--${size}`]}`}>
      <Icon size={iconSize} strokeWidth={2.2} />
      {label}
    </span>
  );
}
