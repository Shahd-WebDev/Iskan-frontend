import { useState } from "react";
import { Bookmark, Share2, CalendarCheck } from "lucide-react";

function PropertyActions({ onBookingClick, bookingStatus }) {
  const [saved, setSaved] = useState(false);

  // ==============================
  // Share handler
  // ==============================
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // ==============================
  // Booking Button State
  // ==============================
  const getBookingButton = () => {
    if (bookingStatus === "pending") {
      return {
        text: "Pending",
        className: "booking-btn pending",
      };
    }

    if (bookingStatus === "approved") {
      return {
        text: "Approved",
        className: "booking-btn approved",
      };
    }

    if (bookingStatus === "confirmed") {
      return {
        text: "Confirmed",
        className: "booking-btn confirmed",
      };
    }

    return {
      text: "Request Booking",
      className: "booking-btn request",
    };
  };

  const bookingBtn = getBookingButton();

  // ==============================
  // UI
  // ==============================
  return (
    <div className="pd-actions d-flex justify-content-between align-items-center flex-wrap mb-4">
      
      {/* Request Booking */}
      <button
        className={`pd-action-btn pd-action-btn--primary d-inline-flex align-items-center cursor-pointer ${bookingBtn.className}`}
        onClick={onBookingClick}
      >
        <CalendarCheck size={14} />
        {bookingBtn.text}
      </button>

      {/* Save + Share */}
      <div className="pd-actions-button d-flex">
        <button
          className={`pd-action-btn d-inline-flex align-items-center cursor-pointer pd-action-btn--ghost ${
            saved ? "pd-action-btn--saved" : ""
          }`}
          onClick={() => setSaved(!saved)}
          type="button"
        >
          <Bookmark size={14} fill={saved ? "#0088FF" : "none"} />
          {saved ? "Saved" : "Save"}
        </button>

        <button
          className="pd-action-btn d-inline-flex cursor-pointer pd-action-btn--ghost align-items-center"
          onClick={handleShare}
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  );
}

export default PropertyActions;