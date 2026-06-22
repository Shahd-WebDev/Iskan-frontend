import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allProperties } from "../../components/data/PropertiesData";

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

import { useAuth } from "../../context/AuthContext";
import { getPropertyDetails } from "../../services/ownerProperties";
import OwnerPanel from "../../components/owner/PropertyDetails/OwnerPanel";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { role } = useAuth();
  const isOwner = role === "Owner" || role === "owner";

  // ======================
  // STATES
  // ======================
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const localProperty = allProperties.find((p) => String(p.id) === String(id));
  const [apiProperty, setApiProperty] = useState(null);
  const [loading, setLoading] = useState(!localProperty);

  useEffect(() => {
    if (!localProperty && id) {
      setLoading(true);
      getPropertyDetails(id)
        .then((data) => {
          setApiProperty(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, localProperty]);

  const refreshProperty = () => {
    if (!localProperty && id) {
      getPropertyDetails(id).then(setApiProperty).catch(console.error);
    }
  };

  // ======================
  // DATA NORMALIZATION
  // ======================
  let property = localProperty;

  if (apiProperty) {
    const propertyTypeMap = { 0: "Room", 1: "Apartment", 2: "Studio" };
    const mappedFacilities =
      apiProperty.facilities?.map((f) => f.facilityName || f.name) || [];

    property = {
      id: apiProperty.id,
      title: apiProperty.title,
      location: apiProperty.address,
      address: apiProperty.address,
      pricePerMonth: apiProperty.pricePerMonth
        ? `${apiProperty.pricePerMonth} EGP`
        : "N/A",
      price: apiProperty.pricePerMonth,
      description: apiProperty.description,
      lat: apiProperty.latitude,
      lng: apiProperty.longitude,
      images:
        apiProperty.images?.map(
          (img) => `https://isskan-1.runasp.net${img.imageUrl}`,
        ) || [],
      image: apiProperty.mainImageUrl
        ? `https://isskan-1.runasp.net${apiProperty.mainImageUrl}`
        : null,
      bedrooms: apiProperty.bedroomsNumber ?? apiProperty.roomsNumber,
      bathrooms: apiProperty.bathroomsNumber,
      propertyType:
        propertyTypeMap[Number(apiProperty.propertyType)] ||
        apiProperty.propertyType,
      features: mappedFacilities.length > 0 ? mappedFacilities : undefined,
      // Owner specific data
      documents: apiProperty.documents || [],
      rawImages: apiProperty.images || [],
      verificationStatus: apiProperty.verificationStatus,
      ownerName: apiProperty.ownerName,
      ownerEmail: apiProperty.ownerEmail,
      createdAt: apiProperty.createdAt,
    };

    if (property.images.length === 0 && property.image) {
      property.images = [property.image];
    }
  }

  // ======================
  // NOT FOUND / LOADING
  // ======================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading property details...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Property not found</h2>

        <button
          onClick={() =>
            navigate(isOwner ? "/owner-dashboard/properties" : "/properties")
          }
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

  const galleryImages =
    property.images && property.images.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : [];

  // ======================
  // UI
  // ======================
  return (
    <>
      <div className="pd-page">
        {isOwner && apiProperty && (
          <OwnerPanel
            property={{ ...property, images: property.rawImages }}
            onUpdate={refreshProperty}
          />
        )}
        <PropertyHeader
          property={property}
          onLocationClick={() => setShowMap((prev) => !prev)}
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
            <KeyFeatures features={property.features} />
          </div>
        </div>

        {!isOwner && (
          <>
            <BookingContact
              bookingStatus={bookingStatus}
              onBookingClick={() => setShowBooking(true)}
            />
            <ReviewSection propertyId={property.id} />
            <RecommendedProperties currentPropertyId={property.id} />
          </>
        )}
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
        propertyTitle={property.title}
      />
    </>
  );
}
