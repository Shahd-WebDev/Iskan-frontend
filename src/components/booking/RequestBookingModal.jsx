import "./RequestBookingModal.css";

const DURATIONS = ["1 month", "2 months", "3 months", "6 months", "1 year"];
const OCCUPANTS = ["1", "2", "3", "4+"];

// check-out duration
function calcCheckOut(checkIn, duration) {
  if (!checkIn) return "N/A";
  const date = new Date(checkIn);
  const match = duration.match(/(\d+)\s*(month|year)/);
  if (!match) return "N/A";
  const [, num, unit] = match;
  if (unit === "month") date.setMonth(date.getMonth() + parseInt(num));
  if (unit === "year")  date.setFullYear(date.getFullYear() + parseInt(num));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RequestBookingModal({ open, onClose, onSubmit, propertyTitle }) {
  if (!open) return null;

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = stored.name || "User";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const AVATAR_COLORS = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#db2777"];
  const userColor = AVATAR_COLORS[userName.charCodeAt(0) % AVATAR_COLORS.length];

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const checkIn  = fd.get("checkIn");
    const duration = fd.get("duration");

    const newBooking = {
      id: Date.now(),
      initials: userInitials,
      color: userColor,
      name: fd.get("fullName"),
      property: fd.get("propertyTitle"),
      checkIn: new Date(checkIn).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      checkOut: calcCheckOut(checkIn, duration),
      occupants: `${fd.get("occupants")} ${fd.get("occupants") === "1" ? "person" : "people"}`,
      requestedAt: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      status: "pending",
    };

    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([newBooking, ...existing]));

    e.target.reset();
    onSubmit?.();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Request Booking</h2>
            <p>
              This is a preliminary booking request. <br />
              No payment or commitment is required at this stage.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>

          {/* Property Title */}
          <label>Property Title</label>
         <input
            name="propertyTitle"
            type="text"
            defaultValue={propertyTitle || ""}
             readOnly
          />

          {/* Date + Duration */}
          <div className="row">
            <div>
              <label>Move-in Date</label>
              <input name="checkIn" type="date" required />
            </div>
            <div>
              <label>Duration of Stay</label>
              <select name="duration" defaultValue="1 month">
                {DURATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Occupants */}
          <label>Number of Occupants</label>
          <select name="occupants" defaultValue="1">
            {OCCUPANTS.map((o) => <option key={o}>{o}</option>)}
          </select>

          {/* Message */}
          <label>Message</label>
          <textarea
            name="message"
            placeholder="Introduce yourself briefly or mention any important details..."
          />

          <hr className="divider" />

          {/* Student Info */}
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

          {/* Terms */}
          <div className="terms-section">
            <p className="terms-title">Terms</p>
            <label className="terms-line">
              <input type="checkbox" required />
              <span>
                I understand that this is a booking request and not a final reservation.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}