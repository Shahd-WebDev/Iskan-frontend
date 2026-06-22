import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Share2, CalendarCheck } from "lucide-react";

function OwnerPropertyActions({ propertyId = null }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

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
  // UI
  // ==============================
  return (
    <div className="pd-actions d-flex justify-content-between align-items-center flex-wrap mb-4">
      {/* View Bookings - available to Owner */}
      <button
        className="pd-action-btn pd-action-btn--primary d-inline-flex align-items-center booking-btn request"
        type="button"
        onClick={() => {
          // navigate to owner bookings page with the current property id
          navigate("/owner-dashboard/bookings", { state: { propertyId } });
        }}
      >
        <CalendarCheck size={14} />
        View Bookings
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

export default OwnerPropertyActions;
