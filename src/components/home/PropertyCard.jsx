import { useContext } from "react";
import { SavedContext } from "../../context/SavedContext";
import { useNavigate } from "react-router-dom";
import {
  Bookmark, Wifi, Wind, UtensilsCrossed,
  Car, WashingMachine, Tv, Bed, Bath, MapPin
} from "lucide-react";

const amenityConfig = {
  WiFi:    { icon: Wifi,            label: "WiFi" },
  AC:      { icon: Wind,            label: "AC" },
  Kitchen: { icon: UtensilsCrossed, label: "Kitchen" },
  Parking: { icon: Car,             label: "Parking" },
  Laundry: { icon: WashingMachine,  label: "Laundry" },
  TV:      { icon: Tv,              label: "TV" },
};

function PropertyCard({ property, onBookmarkChange, isAdmin = false ,isVerification = false  }) {
    const navigate = useNavigate();

 
  const handleViewDetails = () => {

    if (isVerification) {
    return;}
    
    navigate(
  isAdmin
    ? `/admin/property/${property.id}`
    : `/properties/${property.id}`
);
  };

  const amenities = property.amenities || [];

  const { savedProperties, toggleSave } = useContext(SavedContext);

const isBookmarked = savedProperties.some(
  (p) => p.id === property.id
);

  return (
    <div className="property-card overflow-hidden  w-100 h-100 position-relative  d-flex  flex-column">
      <div className="property-image-wrapper position-relative overflow-hidden">
        <img src={property.image} alt={property.title} className="property-image w-100 h-100 object-fit-cover" />
        
        {!isAdmin && (
        <button
          className={`bookmark-btn position-absolute bg-white border-0  rounded-circle d-flex align-items-center  justify-content-center  ${isBookmarked ? "bookmarked" : ""}`}
onClick={(e) => {
  e.stopPropagation();
  toggleSave(property);
}}        >
          <Bookmark
            size={20}
            fill={isBookmarked ? "#0088FF" : "none"}
            stroke="#0088FF"
            strokeWidth={2}
          />
        </button>
        )}

      </div>

      <div className="property-content px-3 d-flex flex-column flex-grow-1">
        <div className="price-type-row d-flex justify-content-between align-items-center">
          <h3 className="property-price text-black">{property.price}</h3>
          <span className={`property-type-badge bg-white badge-${property.type?.toLowerCase()}`}>
            {property.type}
          </span>
        </div>

        <p className="property-title text-black text-nowrap  overflow-hidden">{property.title}</p>

        <p className="property-location d-flex align-items-center text-black">
          <MapPin size={14} strokeWidth={2} />
          {property.location}
        </p>

        <div className="property-details d-flex align-items-center flex-shrink-0">
          <span className="detail-item text-black d-flex align-items-center">
            <Bed size={12} />
            <span className="detail-text">{property.rooms}</span>
          </span>
          <span className="detail-item text-black d-flex align-items-center">
            <Bath size={12} />
            <span className="detail-text">{property.bathrooms}</span>
          </span>
          <div className="amenities-icons d-flex ms-auto flex-shrink-0">
            {amenities.map((key) => {
              const cfg = amenityConfig[key];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <span key={key} className="amenity-icon bg-white d-flex align-items-center justify-content-center" title={cfg.label}>
                  <Icon size={12} />
                </span>
              );
            })}
          </div>
        </div>

        <button className={`view-details-btn w-100 text-white border-0 mt-auto ${
  isVerification ? "verified-btn" : ""
}`}
 onClick={handleViewDetails}>
{
  isVerification
    ? "Verified"
    : isAdmin
    ? "View AI Details"
    : "View Details"
}
        </button>
      </div>
    </div>
  );
}

export default PropertyCard;