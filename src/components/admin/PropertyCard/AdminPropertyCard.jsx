import { useNavigate } from "react-router-dom";
import { Bed, Bath, MapPin,  Clock3, BadgeCheck, XCircle } from "lucide-react";


import "./AdminPropertyCard.css";
function AdminPropertyCard({ property, isVerification = false }) {
    const navigate = useNavigate();

  const handleViewDetails = () => {
  navigate(`/admin/property/${property.id}`);
};
const status =
  property.verificationStatus?.trim().toLowerCase() || "pending";
const propertyTypeMap = {
  0: "Room",
  1: "Apartment",
  2: "Studio",
};

const type =
  propertyTypeMap[Number(property.propertyType)] || "Room";
    const imagePath = property.images?.[0]?.imageUrl;


    const handlePropertyDetails = () => {
  navigate(`/admin/property-details/${property.id}`);
};

const imageUrl = imagePath
  ? imagePath.startsWith("http")
    ? imagePath
    : `https://isskan-1.runasp.net${imagePath}`
  : "/img.webp";
  return (
    <div className="property-card admin-card overflow-hidden w-100 h-100 d-flex flex-column">

<div
  className="property-image-wrapper overflow-hidden"
  onClick={handlePropertyDetails}
  style={{ cursor: "pointer" }}
>        <img
          src={imageUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/img.webp";
          }}
          alt={property.title}
          className="property-image w-100 object-fit-cover"
          style={{ height: "200px" }}
        />
      </div>

      <div className="property-content px-3 d-flex flex-column flex-grow-1">

        <div className="price-type-row d-flex justify-content-between align-items-center">
          <h3 className="property-price text-black">
            {(property.pricePerMonth || property.price) + " EGP"}
          </h3>

          <span className={`property-type-badge badge-${type.toLowerCase()}`}>
            {type}
          </span>
        </div>

        <p className="property-title text-black">
          {property.title}
        </p>

        <p className="property-location d-flex align-items-center text-black">
          <MapPin size={14} />
          {property.address || property.location}
        </p>

        <div className="property-details d-flex align-items-center">

          <span className="detail-item text-black d-flex align-items-center">
            <Bed size={12} />
            <span>{property.roomsNumber || property.rooms}</span>
          </span>

          <span className="detail-item text-black d-flex align-items-center">
            <Bath size={12} />
            <span>{property.bathroomsNumber || property.bathrooms}</span>
          </span>

        </div>

        {isVerification ? (
 <div className={`verified-badge status-${status.toLowerCase()}`}>
  
  <span className="badge-icon">

{status === "approved" ? (
        <BadgeCheck size={18} />
    ) : status === "rejected" ? (
      <XCircle size={18} />
    ) : (
      <Clock3 size={18} />
    )}

  </span>

{status.charAt(0).toUpperCase() + status.slice(1)}
</div>
) : (
  <button
    className="view-details-btn w-100 text-white border-0 mt-auto"
    onClick={handleViewDetails}
  >
    View AI Details
  </button>
)}

      </div>
    </div>
  );
}

export default AdminPropertyCard;