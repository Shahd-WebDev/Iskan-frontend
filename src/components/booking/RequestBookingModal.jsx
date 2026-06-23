import { useState } from "react";
import "./RequestBookingModal.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DURATIONS = ["1 month", "2 months", "3 months", "6 months", "1 year"];
const OCCUPANTS = ["1", "2", "3", "4+"];

function durationToMonths(duration) {
  const match = duration.match(/(\d+)\s*(month|year)/);
  if (!match) return 1;
  const [, num, unit] = match;
  return unit === "year" ? parseInt(num) * 12 : parseInt(num);
}

export default function RequestBookingModal({
  open,
  onClose,
  onSubmit,
  propertyTitle,
  propertyId,
}) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = stored.name || "User";

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return; // guard against double-submit

    if (!token) {
      navigate("/login");
      return;
    }

    const fd = new FormData(e.target);
    const checkIn = fd.get("checkIn");
    const duration = fd.get("duration");
    const occupants = fd.get("occupants").replace("+", "");
    const message = fd.get("message") || "";

    setIsSubmitting(true);

    try {
      console.log("📝 Submitting booking for property:", propertyId);
      
      await api.post("/Bookings/Create", null, {
        params: {
          PropertyId: propertyId,
          MoveInDate: new Date(checkIn).toISOString(),
          DurationInMonths: durationToMonths(duration),
          NumberOfOccupants: occupants,
          Message: message,
        },
      });
      e.target.reset();
      
      if (onSubmit) {
        await onSubmit();
      }
      
      onClose();

    } catch (err) {
      console.error("❌ Booking submission error:", err);
      toast.error(err.response?.data?.message || "Failed to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2>Request Booking</h2>
            <p>
              This is a preliminary booking request. <br />
              No payment or commitment is required at this stage.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Property Title</label>
          <input
            name="propertyTitle"
            type="text"
            defaultValue={propertyTitle || ""}
            readOnly
          />

          <div className="row">
            <div>
              <label>Move-in Date</label>
              <input name="checkIn" type="date" required />
            </div>
            <div>
              <label>Duration of Stay</label>
              <select name="duration" defaultValue="1 month">
                {DURATIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <label>Number of Occupants</label>
          <select name="occupants" defaultValue="1">
            {OCCUPANTS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Introduce yourself briefly or mention any important details..."
          />

          <hr className="divider" />

          <div className="student-info">
            <h4>Student Info (Auto-filled)</h4>
            <p>Displayed to the owner</p>

            <label>Full name</label>
            <input
              name="fullName"
              type="text"
              defaultValue={userName}
              readOnly
            />

            <label>University</label>
            <input
              name="university"
              type="text"
              defaultValue={stored.university || ""}
            />
          </div>

          <hr className="divider" />

          <div className="terms-section">
            <p className="terms-title">Terms</p>
            <label className="terms-line">
              <input type="checkbox" required />
              <span>
                I understand that this is a booking request and not a final
                reservation.
              </span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting" : "Submit Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}