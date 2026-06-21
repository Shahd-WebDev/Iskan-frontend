import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";
import toast from "react-hot-toast";
import abstractDesign from "../../assets/home/Abstract Design.png";
import { BOOKING_STATUS } from "../booking/bookingStatus";

function BookingContact({ property, bookingStatus }) {

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0) || "";
    const second = parts[1]?.charAt(0) || "";
    return (first + second).toUpperCase();
  };

  const owner = {
    id: property?.ownerId,
    name: property?.ownerName,
    email: property?.ownerEmail,
    phone: property?.ownerPhoneNumber,
    avatar: property?.ownerProfilePictureUrl,
  };

  const isConfirmed = bookingStatus === BOOKING_STATUS.CONFIRMED;

  const handleWhatsApp = () => {
    if (!isConfirmed) {
      toast.error("You can contact owner only after booking is confirmed");
      return;
    }

    if (!owner.phone) {
      toast.error("Owner phone number is not available");
      return;
    }

    const formattedPhone = owner.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  const handleEmail = () => {
    if (!isConfirmed) {
      toast.error("You can contact owner only after booking is confirmed");
      return;
    }

    if (!owner.email) {
      toast.error("Owner email is not available");
      return;
    }

    window.location.href = `mailto:${owner.email}`;
  };

  return (
    <div className="pd-booking-section align-items-start">

      <div className="pd-booking-left">
        <div className="section-badge">
          <img src={abstractDesign} alt="Abstract Design" />
        </div>

        <h2 className="pd-booking-title">
          Request a Booking to <br /> Get in touch
        </h2>

        <p className="pd-booking-desc m-0">
          Submit a booking request and wait for approval to unlock contact details.
        </p>
      </div>

      <div className="pd-booking-right mt-0">
        <div className="pd-agent-card">

          <div className="pd-agent-info d-flex">

            {owner.avatar ? (
              <img
                src={owner.avatar}
                className="pd-agent-avatar rounded-circle flex-shrink-0"
                alt="owner"
              />
            ) : (
              <div className="pd-agent-avatar-fallback">
                {getInitials(owner.name)}
              </div>
            )}

            <div className="pd-agent-contacts d-flex flex-column">
              <span className="pd-agent-name">{owner.name}</span>

              <div className="pd-contact-button d-flex flex-wrap">

                <button
                  className={`pd-contact-btn whatsapp-btn ${
                    isConfirmed ? "active" : "disabled-style"
                  }`}
                  onClick={handleWhatsApp}
                >
                  <FaWhatsapp size={18} />
                  WhatsApp
                </button>

                <button
                  className={`pd-contact-btn email-btn ${
                    isConfirmed ? "active" : "disabled-style"
                  }`}
                  onClick={handleEmail}
                >
                  <MdEmail size={18} />
                  Email
                </button>

              </div>
            </div>
          </div>

          <p className="pd-contact-note">
            Contact details will be available after booking approval
          </p>

        </div>
      </div>
    </div>
  );
}

export default BookingContact;