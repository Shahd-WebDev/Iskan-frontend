import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ShieldCheck, Activity } from "lucide-react";

import PropertyHeader from "../../../../components/PropertiesDetails/PropertyHeader";
import ImageGallery from "../../../../components/PropertiesDetails/PropertyGallery";
import OwnerPropertyActions from "../../../../components/owner/PropertyDetails/OwnerPropertyActions";
import OwnerPropertyDescription from "../../../../components/owner/PropertyDetails/OwnerPropertyDescription";
import KeyFeatures from "../../../../components/PropertiesDetails/KeyFeatures";
import PropertyBookingsSection from "../../../../components/owner/PropertyDetails/PropertyBookingsSection";

import "../../../property-details/PropertyDetails.css";
import {
  getPropertyDetails,
  getAllFacilities,
} from "../../../../services/ownerProperties";
import OwnerPanel from "../../../../components/owner/PropertyDetails/OwnerPanel";

export default function OwnerPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ======================
  // STATES
  // ======================
  const [apiProperty, setApiProperty] = useState(null);
  const [allGlobalFacilities, setAllGlobalFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const normalizeFacilitiesResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.result && Array.isArray(data.result)) return data.result;
    return [];
  };

  const fetchPropertyAndFacilities = async () => {
    try {
      setLoading(true);
      const [propertyData, facilitiesData] = await Promise.all([
        getPropertyDetails(id),
        getAllFacilities(),
      ]);
      setApiProperty(propertyData);
      setAllGlobalFacilities(normalizeFacilitiesResponse(facilitiesData));
    } catch (err) {
      console.error("Failed to fetch property details:", err);
      setAllGlobalFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPropertyAndFacilities();
    }
  }, [id]);

  const refreshProperty = () => {
    if (id) {
      getPropertyDetails(id).then(setApiProperty).catch(console.error);
    }
  };

  // ======================
  // DATA NORMALIZATION
  // ======================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading property details...</h2>
      </div>
    );
  }

  if (!apiProperty) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Property not found</h2>
        <button
          onClick={() => navigate("/owner-dashboard/properties")}
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

  const propertyTypeMap = { 0: "Room", 1: "Apartment", 2: "Studio" };

  // Map raw facility IDs to actual names and icons
  const mappedFacilities = (apiProperty.facilities || [])
    .map((item) => {
      if (item && typeof item === "object") {
        return item.facilityName || item.name;
      }

      if (!Array.isArray(allGlobalFacilities)) {
        return null;
      }

      const found = allGlobalFacilities.find(
        (f) => String(f.id) === String(item),
      );
      return found ? found.name : null;
    })
    .filter(Boolean);

  // Extract images
  let galleryImages = [];
  if (apiProperty.imagesUrl && Array.isArray(apiProperty.imagesUrl)) {
    galleryImages = apiProperty.imagesUrl.map((img) =>
      img.startsWith("http") ? img : `https://isskan-1.runasp.net${img}`,
    );
  } else if (apiProperty.imagesUrls && Array.isArray(apiProperty.imagesUrls)) {
    galleryImages = apiProperty.imagesUrls.map((img) =>
      img.startsWith("http") ? img : `https://isskan-1.runasp.net${img}`,
    );
  } else if (apiProperty.images && Array.isArray(apiProperty.images)) {
    galleryImages = apiProperty.images.map((img) => {
      const url = img.imageUrl || img.url || img;
      return url.startsWith("http") ? url : `https://isskan-1.runasp.net${url}`;
    });
  }

  if (galleryImages.length === 0 && apiProperty.mainImageUrl) {
    const mainUrl = apiProperty.mainImageUrl;
    galleryImages = [
      mainUrl.startsWith("http")
        ? mainUrl
        : `https://isskan-1.runasp.net${mainUrl}`,
    ];
  }

  const normalizedProperty = {
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
    images: galleryImages,
    image: apiProperty.mainImageUrl
      ? `https://isskan-1.runasp.net${apiProperty.mainImageUrl}`
      : galleryImages[0] || null,
    bedrooms: apiProperty.bedroomsNumber,
    bathrooms: apiProperty.bathroomsNumber,
    rooms: apiProperty.roomsNumber,
    propertyType:
      propertyTypeMap[Number(apiProperty.propertyType)] ||
      apiProperty.propertyType,
    features: mappedFacilities.length > 0 ? mappedFacilities : undefined,
    // Owner specific data — defensive mapping covers all known API variants
    documents: apiProperty.documents || [],
    rawImages: apiProperty.images || [],
    verificationStatus: apiProperty.verificationStatus,
    ownerName:
      apiProperty.ownerName ||
      (apiProperty.ownerFirstName || apiProperty.ownerLastName
        ? `${apiProperty.ownerFirstName || ""} ${apiProperty.ownerLastName || ""}`.trim()
        : null) ||
      apiProperty.owner?.name ||
      apiProperty.owner?.fullName ||
      null,
    ownerEmail:
      apiProperty.ownerEmail ||
      apiProperty.owner?.email ||
      null,
    ownerPhone:
      apiProperty.ownerPhone ||
      apiProperty.ownerPhoneNumber ||
      apiProperty.phoneNumber ||
      apiProperty.owner?.phone ||
      apiProperty.owner?.phoneNumber ||
      null,
    ownerImage:
      apiProperty.ownerImage ||
      apiProperty.ownerProfilePicture ||
      apiProperty.ownerProfileImageUrl ||
      apiProperty.owner?.profileImageUrl ||
      apiProperty.owner?.imageUrl ||
      null,
    createdAt: apiProperty.createdAt,
    validationResultJson:
      apiProperty.validationResultJson ||
      apiProperty.ValidationResultJson ||
      null,
    listingStatus: apiProperty.listingStatus,
    availabilityStatus: apiProperty.availabilityStatus,
    bookingCount: apiProperty.bookingCount,
    commentCount: apiProperty.commentCount,
  };

  return (
    <div className="pd-page">
      {/* ── Owner Property Management Panel ── */}
      <OwnerPanel
        property={{
          ...normalizedProperty,
          images: normalizedProperty.rawImages,
        }}
        onUpdate={refreshProperty}
      />

      {/* ── Property Details ── */}
      <PropertyHeader
        property={normalizedProperty}
        onLocationClick={() => setShowMap((prev) => !prev)}
        showMap={showMap}
      />

      <ImageGallery
        images={galleryImages}
        showMap={showMap}
        setShowMap={setShowMap}
        lat={normalizedProperty.lat}
        lng={normalizedProperty.lng}
      />

      <div className="pd-mid-section align-items-start">
        <div className="pd-left-col">
          {/* Booking Actions (Request Booking button replaced with View Bookings for Owners) */}
          <OwnerPropertyActions propertyId={id} />

          <OwnerPropertyDescription property={normalizedProperty} />
        </div>

        <div className="pd-right-col">
          {/* Key Features & Amenities list */}
          <KeyFeatures features={normalizedProperty.features} />

          {/* Owner Information Card */}
          <div
            className="pd-key-features"
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "20px",
            }}
          >
            <h3
              className="pd-section-title-sm1"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: 0,
                minHeight: "unset",
                fontSize: "15px",
              }}
            >
              <User size={16} /> Owner Information
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                borderTop: "1px solid #F5FAFF",
                paddingTop: "12px",
              }}
            >
              {/* Avatar */}
              {normalizedProperty.ownerImage ? (
                <img
                  src={
                    normalizedProperty.ownerImage.startsWith("http")
                      ? normalizedProperty.ownerImage
                      : `https://isskan-1.runasp.net${normalizedProperty.ownerImage}`
                  }
                  alt={normalizedProperty.ownerName || "Owner"}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0088FF",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "#e8f0fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0088FF",
                    flexShrink: 0,
                  }}
                >
                  <User size={24} />
                </div>
              )}

              {/* Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: 0 }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {normalizedProperty.ownerName || "—"}
                </h4>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12px",
                    color: "#64748b",
                    overflow: "hidden",
                  }}
                >
                  <Mail size={12} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {normalizedProperty.ownerEmail || "—"}
                  </span>
                </div>
                {normalizedProperty.ownerPhone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    <Phone size={12} style={{ flexShrink: 0 }} />
                    <span>{normalizedProperty.ownerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listing & Status Details Card */}
          <div
            className="pd-key-features"
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "20px",
            }}
          >
            <h3
              className="pd-section-title-sm1"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: 0,
                minHeight: "unset",
                fontSize: "15px",
              }}
            >
              <ShieldCheck size={16} /> Listing & Status Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderTop: "1px solid #F5FAFF",
                paddingTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#64748b" }}>Listing Status:</span>
                <span
                  style={{
                    fontWeight: "600",
                    textTransform: "capitalize",
                    color:
                      normalizedProperty.listingStatus?.toLowerCase() ===
                      "active"
                        ? "#166534"
                        : "#b91c1c",
                  }}
                >
                  {normalizedProperty.listingStatus || "N/A"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#64748b" }}>Availability Status:</span>
                <span
                  style={{
                    fontWeight: "600",
                    textTransform: "capitalize",
                    color:
                      normalizedProperty.availabilityStatus?.toLowerCase() ===
                      "available"
                        ? "#166534"
                        : "#b91c1c",
                  }}
                >
                  {normalizedProperty.availabilityStatus || "N/A"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#64748b" }}>Verification Status:</span>
                <span
                  className={`status-badge ${normalizedProperty.verificationStatus?.toLowerCase() || "pending"}`}
                  style={{ fontSize: "12px", padding: "2px 10px" }}
                >
                  {normalizedProperty.verificationStatus || "Pending"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                  borderTop: "1px dashed #e2e8f0",
                  paddingTop: "8px",
                }}
              >
                <span style={{ color: "#64748b" }}>Total Bookings:</span>
                <span style={{ fontWeight: "600" }}>
                  {normalizedProperty.bookingCount ?? 0}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "#64748b" }}>Total Comments:</span>
                <span style={{ fontWeight: "600" }}>
                  {normalizedProperty.commentCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Management Section ── */}
      <PropertyBookingsSection propertyId={id} />
    </div>
  );
}
