import { useParams, useNavigate } from "react-router-dom";
import { allProperties } from "../../components/data/PropertiesData";
import Layout from "../../components/layout/Layout";
import { useState } from "react";
import PropertyHeader        from "../../components/PropertiesDetails/PropertyHeader";
import ImageGallery          from "../../components/PropertiesDetails/PropertyGallery";
import PropertyActions       from "../../components/PropertiesDetails/PropertyActions";
import PropertyDescription   from "../../components/PropertiesDetails/Propertydescription";
import KeyFeatures           from "../../components/PropertiesDetails/KeyFeatures";
import BookingContact        from "../../components/PropertiesDetails/BookingContact";
import ReviewSection         from "../../components/PropertiesDetails/ReviewsSection";
import RecommendedProperties from "../../components/PropertiesDetails/RecommendedProperties";

import "../property-details/PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
const [showBooking, setShowBooking] = useState(false);
  const property = allProperties.find((p) => p.id === Number(id));

  if (!property) {
    return (
      <>
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
      </>
    );
  }

  const galleryImages = property.images || [property.image];

  return (
    <>
      <div className="pd-page">
        <PropertyHeader property={property} />

        <ImageGallery images={galleryImages} />

        <div className="pd-mid-section align-items-start ">
          <div className="pd-left-col">
            <PropertyActions onBookingClick={() => setShowBooking(true)} />
            <PropertyDescription property={property} />
          </div>
          <div className="pd-right-col">
            <KeyFeatures />
          </div>
        </div>

        <BookingContact  onBookingClick={() => setShowBooking(true)}/>

        <ReviewSection />

        <RecommendedProperties currentPropertyId={property.id} />

      </div>
   </>
  );
}