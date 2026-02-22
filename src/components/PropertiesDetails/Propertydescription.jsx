import { Bed, Bath, Grid3X3, Wifi, Wind, UtensilsCrossed, Car, WashingMachine, Tv } from "lucide-react";

const amenityConfig = {
  WiFi:    { icon: Wifi,            label: "Wi-Fi" },
  AC:      { icon: Wind,            label: "AC" },
  Kitchen: { icon: UtensilsCrossed, label: "Kitchen" },
  Parking: { icon: Car,             label: "Parking" },
  Laundry: { icon: WashingMachine,  label: "Laundry" },
  TV:      { icon: Tv,              label: "TV" },
};

function PropertyDescription({ property }) {
  const amenities = property.amenities || [];

  return (
    <div className="pd-description d-flex flex-column">
      <h3 className="pd-section-title-sm">Description</h3>

      {/* Specs Row */}
      <div className="pd-specs d-flex align-items-center">
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bed size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bedrooms</span>
          </span>
          
          <span className="pd-spec-val">
            02
          </span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bath size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bathrooms</span>
          </span>
          <span className="pd-spec-val">
             01
          </span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Grid3X3 size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Rooms</span>
          </span>
          <span className="pd-spec-val">
            05
          </span>
        </div>
      </div>

      {/* Amenity Tags */}
      <div className="pd-amenity-tags d-flex flex-wrap">
        {amenities.map((key) => {
          const cfg = amenityConfig[key];
          if (!cfg) return null;
          const Icon = cfg.icon;
          return (
            <span key={key} className="pd-amenity-tag d-inline-flex align-items-center ">
              {cfg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PropertyDescription;