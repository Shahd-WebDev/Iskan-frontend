import { useContext } from "react";
import { SavedContext } from "../../context/SavedContext";
import { useNavigate } from "react-router-dom";
import {
  Bookmark, Wifi, Wind, UtensilsCrossed,
  Car, WashingMachine, Tv, Bed, Bath, MapPin,
  Camera, ArrowUpDown, BookOpen, Dumbbell, Flame, TreePine,
} from "lucide-react";

import { MdTrackChanges } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const facilityIconMap = {
  wifi:     Wifi,
  ac:       Wind,
  parking:  Car,
  elevator: ArrowUpDown,
  cctv:     Camera,
  kitchen:  UtensilsCrossed,
  tv:       Tv,
  study:    BookOpen,
  washer:   WashingMachine,
  gym:      Dumbbell,
  heater:   Flame,
  balcony:  TreePine,
};

function PropertyCard({ property, facilities = [], hideBookmark = false }) {

  const propertyFacilities = facilities.filter(f => 
  property.facilities?.includes(f.id)
);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = () => {
  navigate(`/properties/${property.id}`);
};

  const amenities = property.amenities || [];
  const propertyTypeMap = {
    0: "Room",
    1: "Apartment",
    2: "Studio"
  };

  const type = typeof property.propertyType === "number"
  ? (propertyTypeMap[property.propertyType] ?? "Room")
  : (property.propertyType || "Room");

  const { savedProperties, toggleSave } = useContext(SavedContext);

  const isBookmarked = savedProperties.some(
    (p) => p.id === property.id
  );
  const imageUrl = property.mainImageUrl
    ? `https://isskan-1.runasp.net${property.mainImageUrl}`
    : "/img.webp";

  const handleSave = async (e) => {
  e.stopPropagation();

  if (!token) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/login");
    return;
  }

  try {
    await toggleSave(property);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="property-card overflow-hidden w-100 h-100 d-flex flex-column">

      <div className="property-image-wrapper position-relative overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="property-image w-100 h-100 object-fit-cover"
        />

  
       {/* Bookmark */}
      {!hideBookmark && (
        <button
          type="button"
          className={`bookmark-btn position-absolute bg-white border-0 rounded-circle d-flex align-items-center justify-content-center ${
            isBookmarked ? "bookmarked" : ""
          }`}
          onClick={handleSave}
        >
          <Bookmark
            size={20}
            fill={isBookmarked ? "#0088FF" : "none"}
            stroke="#0088FF"
          />
        </button>
      )}
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

       {propertyFacilities.length > 0 && (
          <div className="amenities-icons d-flex ms-auto ">
            {propertyFacilities.map((facility) => {
              const IconComponent = facilityIconMap[facility.icon];
              return (
                <span
                  key={facility.id}
                  className="amenity-icon bg-white"
                  title={facility.name}
                >
                  {IconComponent
                    ? <IconComponent size={12} />
                    : <span style={{ fontSize: "9px" }}>{facility.name}</span>
                  }
                </span>
              );
            })}
          </div>
        )}
        </div>
        
        <button
          className="view-details-btn w-100 text-white border-0 mt-auto"
          onClick={handleViewDetails}
        >
          View Details
        </button>

      </div>
    </div>
  );
}

 export default PropertyCard;;


