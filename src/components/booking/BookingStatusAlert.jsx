import { X } from "lucide-react";
import { useState } from "react";
import { BOOKING_STATUS } from "../booking/bookingStatus";
import "./BookingStatusAlert.css";

function BookingStatusAlert({ bookingStatus, visible, onConfirm, onDismiss }) {
  if (!bookingStatus) return null;

  console.log("BookingStatusAlert:", { bookingStatus, visible });

  if (!visible || !bookingStatus) return null;

  if (bookingStatus === BOOKING_STATUS.PENDING) {
    return (
      <div className="bsa-overlay">
        <div className="bsa-box">
          <div className="bsa-header">
            <h4 className="bsa-title">Pending Alert</h4>
            <button className="bsa-close" onClick={onDismiss}>
              <X size={16} />
            </button>
          </div>
          <p className="bsa-msg">
            You will be notified once the owner responds to your request.
          </p>
        </div>
      </div>
    );
  }

  if (bookingStatus === BOOKING_STATUS.APPROVED) {
    return (
      <div className="bsa-overlay">
        <div className="bsa-box">
          <div className="bsa-header">
            <h4 className="bsa-title">Approved Alert</h4>
            <button className="bsa-close" onClick={onDismiss}>
              <X size={16} />
            </button>
          </div>
          <p className="bsa-msg">
            Your booking request has been approved.<br />
            Please contact the owner to finalize details.
          </p>
          <div className="bsa-note">
            After communicating with the owner and agreeing on all details,
            please confirm your booking{" "}
            <span style={{ color: "#E53935" }}>
              (By confirming, you agree to proceed with this reservation.)
            </span>
          </div>
          <div className="bsa-actions">
            <button className="bsa-btn-cancel" onClick={onDismiss}>
              Cancel
            </button>
            <button className="bsa-btn-confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default BookingStatusAlert;