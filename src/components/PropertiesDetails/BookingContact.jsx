
import { MessageCircle, Mail } from "lucide-react";

// بيانات الأوينر ثابتة — ممكن تضيفها في PropertiesData بعدين
const defaultAgent = {
  name: "Ahmed Osman",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

function SectionAccent() {
  return (
    <div className="pd-accent" aria-hidden="true">
      <span className=
      "pd-accent-star">✦</span>
      <span className="pd-accent-dot" />
      <span className="pd-accent-dot" />
    </div>
  );
}

function BookingContact({ agent = defaultAgent, onBookingClick }) {
  return (
    <div className="pd-booking-section">
      {/* Left */}
      <div className="pd-booking-left">
        <SectionAccent />
        <h2 className="pd-booking-title">
          Request a Booking to
          <br />
          Get in touch
        </h2>
        <p className="pd-booking-desc">
          Interested in this property? Submit a booking request and wait for the
          owner's approval to unlock contact details.
        </p>
      </div>

      {/* Right: Agent Card */}
      <div className="pd-booking-right">
        <div className="pd-agent-card">
          <div className="pd-agent-info">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="pd-agent-avatar"
            />
            <span className="pd-agent-name">{agent.name}</span>
          </div>

          <div className="pd-agent-contacts">
            <button className="pd-contact-btn">
              <MessageCircle size={14} />
              WhatsApp
            </button>
            <button className="pd-contact-btn">
              <Mail size={14} />
              Email
            </button>
          </div>

          <p className="pd-contact-note">
            Contact details will be available after the owner approves your
            booking request
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingContact; 
