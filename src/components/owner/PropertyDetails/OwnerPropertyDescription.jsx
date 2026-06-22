import { Bed, Bath, Grid3X3, Wifi, Wind, UtensilsCrossed, Car, WashingMachine, Tv } from "lucide-react";

const amenityConfig = {
  WiFi:    { icon: Wifi,            label: "Wi-Fi" },
  AC:      { icon: Wind,            label: "AC" },
  Kitchen: { icon: UtensilsCrossed, label: "Kitchen" },
  Parking: { icon: Car,             label: "Parking" },
  Laundry: { icon: WashingMachine,  label: "Laundry" },
  TV:      { icon: Tv,              label: "TV" },
};

function OwnerPropertyDescription({ property }) {
  if (!property) return null;
  const amenities = property.amenities || property.features || [];

  return (
    <div className="pd-description d-flex flex-column">
      <h3 className="pd-section-title-sm">Description</h3>

      {property.description && (
        <p className="pd-description-text" style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", margin: "0 0 24px 0", whiteSpace: "pre-line" }}>
          {property.description}
        </p>
      )}

      {/* Specs Row */}
      <div className="pd-specs d-flex align-items-center">
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bed size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bedrooms</span>
          </span>
          
          <span className="pd-spec-val">
            {property.bedrooms !== undefined && property.bedrooms !== null ? String(property.bedrooms).padStart(2, '0') : "02"}
          </span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bath size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bathrooms</span>
          </span>
          <span className="pd-spec-val">
             {property.bathrooms !== undefined && property.bathrooms !== null ? String(property.bathrooms).padStart(2, '0') : "01"}
          </span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Grid3X3 size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Rooms</span>
          </span>
          <span className="pd-spec-val">
            {property.rooms !== undefined && property.rooms !== null ? String(property.rooms).padStart(2, '0') : "05"}
          </span>
        </div>
      </div>

      {/* Amenity Tags */}
      {amenities.length > 0 && (
        <div className="pd-amenity-tags d-flex flex-wrap">
          {amenities.map((key) => {
            const cfg = amenityConfig[key];
            return (
              <span key={key} className="pd-amenity-tag d-inline-flex align-items-center ">
                {cfg ? cfg.label : key}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OwnerPropertyDescription;
