import { SavedContext } from "../../context/SavedContext";
import { Bookmark, Share2, CalendarCheck, Clock, BadgeCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function PropertyActions({
  onOpenBooking,
  onOpenStatusAlert,
  bookingStatus,
  property,
}) {
  const { savedProperties, toggleSave } = useContext(SavedContext);
  const { token } = useAuth();
  const navigate = useNavigate();

  const isBookmarked = savedProperties.some((p) => p.id === property?.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleSave = async () => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    try {
      await toggleSave(property);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookingClick = () => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    if (bookingStatus) {
      onOpenStatusAlert?.();
    } else {
      onOpenBooking?.();
    }
  };

  //  تحديد حالة الزر
  const getBookingButton = () => {
    if (bookingStatus === "loading") {
      return {
        text: "Loading...",
        className: "booking-btn request",
        disabled: true,
        Icon: CalendarCheck,
      };
    }

    if (bookingStatus === "pending") {
      return {
        text: "Pending",
        className: "booking-btn pending",
        disabled: true,
        Icon: Clock,
      };
    }
    if (bookingStatus === "approved") {
      return {
        text: "Approved",
        className: "booking-btn approved",
        disabled: false,
        Icon: BadgeCheck,
      };
    }
    if (bookingStatus === "confirmed") {
      return {
        text: "Confirmed",
        className: "booking-btn confirmed",
        disabled: true,
        Icon: BadgeCheck,
      };
    }
    // لا يوجد حجز
    return {
      text: "Request Booking",
      className: "booking-btn request",
      disabled: false,
      Icon: CalendarCheck,
    };
  };

  const bookingBtn = getBookingButton();
  const BookingIcon = bookingBtn.Icon;

  return (
    <div className="pd-actions d-flex justify-content-between align-items-center flex-wrap mb-4">
      <button
        className={`pd-action-btn pd-action-btn--primary ${bookingBtn.className}`}
        onClick={handleBookingClick}
        disabled={bookingBtn.disabled}
      >
        <BookingIcon size={14} />
        {bookingBtn.text}
      </button>

      <div className="pd-actions-button d-flex">
        <button
          className={`pd-action-btn d-inline-flex align-items-center cursor-pointer pd-action-btn--ghost ${
            isBookmarked ? "pd-action-btn--saved" : ""
          }`}
          onClick={handleSave}
          type="button"
        >
          <Bookmark size={14} fill={isBookmarked ? "#0088FF" : "none"} />
          {isBookmarked ? "Saved" : "Save"}
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