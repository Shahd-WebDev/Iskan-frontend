import { Bed, Bath, Grid3X3 } from "lucide-react";
import { useState, useEffect } from "react";

function PropertyDescription({ property }) {
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    if (!property?.id) return;
    const token = localStorage.getItem("token");
    fetch(`/api/Property/GetFacilities?id=${property.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAmenities(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [property?.id]);

  return (
    <div className="pd-description d-flex flex-column">
      <h3 className="pd-section-title-sm">Description</h3>

      <div className="pd-specs d-flex align-items-center">
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bed size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bedrooms</span>
          </span>
          <span className="pd-spec-val">{property.bedroomsNumber ?? 0}</span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Bath size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Bathrooms</span>
          </span>
          <span className="pd-spec-val">{property.bathroomsNumber ?? 0}</span>
        </div>
        <div className="pd-spec-divider" />
        <div className="pd-spec d-flex flex-column align-items-start">
          <span>
            <Grid3X3 size={20} className="pd-spec-icon" />
            <span className="pd-spec-label">Rooms</span>
          </span>
          <span className="pd-spec-val">{property.roomsNumber ?? 0}</span>
        </div>
      </div>

      <div className="pd-amenity-tags d-flex flex-wrap">
        {amenities.map((facility, i) => (
          <span key={i} className="pd-amenity-tag d-inline-flex align-items-center">
            {facility.facilityName}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PropertyDescription;