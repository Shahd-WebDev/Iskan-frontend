import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyVerification } from "../services/verificationService";
import { toast } from "react-toastify";

/**
 * useVerificationPolling
 *
 * Polls the backend for verification status updates at a fixed interval.
 *
 * Rules:
 * - Only polls when role === "Owner" AND verificationStatus === "Pending"
 * - Auto-navigates on status change if user is on legacy pending page
 * - Cleans up the interval on unmount
 * - Does NOT modify AuthContext on startup — only acts on polled change
 *
 * @param {Object} options
 * @param {number} options.interval  - Polling interval in ms (default: 45000)
 * @param {Function} options.onStatusChange - Optional callback when status changes
 */
export function useVerificationPolling({ interval = 45000, onStatusChange } = {}) {
  const { role, verificationStatus, updateVerificationStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only poll when there is something to wait for
    if (role !== "Owner" || verificationStatus !== "Pending") return;

    const poll = async () => {
      try {
        const response = await getMyVerification();
        const newStatus = response?.verificationStatus || response?.status;

        if (newStatus && newStatus !== "Pending") {
          // Update local state
          updateVerificationStatus(newStatus);

          // Notify optional callback
          onStatusChange?.(newStatus);

          // Toast notifications
          if (newStatus === "Approved") {
            toast.success("Your identity verification has been approved! ✓");
          } else if (newStatus === "Rejected") {
            toast.error("Your identity verification was rejected. Please review and resubmit.");
          }

          // Navigate based on new status ONLY if currently on legacy pending page
          if (location.pathname === "/verification-pending") {
            if (newStatus === "Approved") {
              navigate("/owner-dashboard/dashboard", { replace: true });
            } else if (newStatus === "Rejected") {
              navigate("/owner-dashboard/verification", { replace: true });
            }
          }
        }
      } catch (error) {
        // Silently fail during polling — don't disrupt the user
        console.warn("[useVerificationPolling] poll error:", error?.message || error);
      }
    };

    // Run poll immediately on mount/activation
    poll();

    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [role, verificationStatus, interval, location.pathname]);
}
