import "./RequestBookingModal.css";

export default function RequestBookingModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Request Booking</h2>
            <p>
              This is a preliminary booking request. <br />
              No payment or commitment is
              required at this stage.
            </p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Property Title */}
          <label>Property Title</label>
          <input type="text" value="Elestad Apartment" disabled />

          {/* Date + Duration */}
          <div className="row">
            <div>
              <label>Move-in Date</label>
              <input type="date" required />
            </div>

            <div>
              <label>Duration of Stay</label>
              <select>
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
              </select>
            </div>
          </div>

          {/* Occupants */}
          <label>Number of Occupants</label>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3+</option>
          </select>

          {/* Message */}
          <label>Message</label>
          <textarea placeholder="Introduce yourself briefly or mention any important details..." />
<hr className="divider" />

          {/* Auto-filled info */}
          <div className="student-info">
            <h4>Student Info (Auto-filled)</h4>
            <p>Displayed to the owner</p>

            <label>Full name</label>
            <input type="text" value="Khaled Osama" disabled />

            <label>University</label>
            <input type="text" value="Tanta University" disabled />
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
