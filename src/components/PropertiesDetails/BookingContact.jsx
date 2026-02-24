import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import abstractDesign from "../../assets/home/Abstract Design.png";
import avtatarImg from "../../assets/PropertiesDetails/Ahmed Osman.jpg"

const defaultAgent = {
  name: "Ahmed Osman",
  avatar: avtatarImg,
};

function BookingContact({ agent = defaultAgent}) {
  return (
    <div className="pd-booking-section align-items-start">

      <div className="pd-booking-left">
        <div className="section-badge">
          <img src={abstractDesign} alt="Abstract Design" />
        </div>
        
        <h2 className="pd-booking-title">
          Request a Booking to
          <br />
          Get in touch
        </h2>
        <p className="pd-booking-desc m-0">
          Interested in this property? Submit a booking request and wait for the
          owner's approval to unlock contact details.
        </p>
      </div>
      <div className="pd-booking-right mt-0">
        <div className="pd-agent-card">
          <div className="pd-agent-info d-flex">
            <img  src={avtatarImg}  className="pd-agent-avatar rounded-circle flex-shrink-0"/>
            <div className="pd-agent-contacts d-flex flex-column">
              <span className="pd-agent-name">{agent.name}</span>
              <div className="pd-contact-button d-flex flex-wrap">
                <button className="pd-contact-btn d-inline-flex align-items-center">
                  <FaWhatsapp size={18}  />
                    WhatsApp
                </button>
                <button className="pd-contact-btn d-inline-flex align-items-center">
                <MdEmail size={18} />
                  Email
                </button>
              </div>
            </div>
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