import { useParams, useNavigate } from "react-router-dom";
import { allProperties } from "../../components/data/PropertiesData";
import { useState } from "react";

import PropertyHeader from "../../components/PropertiesDetails/PropertyHeader";
import ImageGallery from "../../components/PropertiesDetails/PropertyGallery";
import PropertyActions from "../../components/PropertiesDetails/PropertyActions";
import PropertyDescription from "../../components/PropertiesDetails/Propertydescription";
import KeyFeatures from "../../components/PropertiesDetails/KeyFeatures";
import BookingContact from "../../components/PropertiesDetails/BookingContact";
import ReviewSection from "../../components/PropertiesDetails/ReviewsSection";
import RecommendedProperties from "../../components/PropertiesDetails/RecommendedProperties";

import "../property-details/PropertyDetails.css";

import RequestBookingModal from "../../components/booking/RequestBookingModal";
import { BOOKING_STATUS } from "../../components/booking/bookingStatus";

import PropertyMap from "../../components/PropertiesDetails/PropertyMap";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ======================
  // STATES
  // ======================
  const [showBooking, setShowBooking] = useState(false);

  // يبدأ بدون حالة
  const [bookingStatus, setBookingStatus] = useState(null);

  const property = allProperties.find((p) => p.id === Number(id));

  const [showMap, setShowMap] = useState(false);
  // ======================
  // NOT FOUND
  // ======================
  if (!property) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Property not found</h2>

        <button
          onClick={() => navigate("/properties")}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: "#0088FF",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const galleryImages = property.images || [property.image];

  // ======================
  // UI
  // ======================
  return (
    <>
      <div className="pd-page">
<PropertyHeader
  property={property}
onLocationClick={() => setShowMap(prev => !prev)}
  showMap={showMap}
/>
      
<ImageGallery
  images={galleryImages}
  showMap={showMap}
  setShowMap={setShowMap}
  lat={property.lat}
  lng={property.lng}
/>


        <div className="pd-mid-section align-items-start">
          <div className="pd-left-col">
            <PropertyActions
              bookingStatus={bookingStatus}
              onBookingClick={() => setShowBooking(true)}
            />

            <PropertyDescription property={property} />
          </div>

          <div className="pd-right-col">
            <KeyFeatures />
          </div>
        </div>

        <BookingContact
          bookingStatus={bookingStatus}
          onBookingClick={() => setShowBooking(true)}
        />

        <ReviewSection />

        <RecommendedProperties currentPropertyId={property.id} />
      </div>

      {/* ======================
          BOOKING MODAL
      ====================== */}
      <RequestBookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        onSubmit={() => {
          // 👇 هنا التحويل الحقيقي للحالة
          setBookingStatus(BOOKING_STATUS.PENDING);
          setShowBooking(false);
        }}
      />
    </>
  );
}