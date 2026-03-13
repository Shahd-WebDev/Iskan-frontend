import { MapPin } from "lucide-react";

function PropertyHeader({ property, onLocationClick, showMap }){  return (
    <div className="pd-topbar d-flex justify-content-between align-items-center flex-wrap g-3">
      <div className="pd-topbar-left d-flex align-items-center flex-wrap">
        <h1 className="pd-property-title m-0">{property.title}</h1>
        <button
  className={`pd-location-badge ${showMap ? "active" : ""}`}
  onClick={onLocationClick}
>
  <MapPin size={16} />
  {property.location}
</button>
      </div>
      <div className="pd-topbar-right d-flex flex-column text-start">
        <span className="pd-price-label d-block ">Price</span>
        <span className="pd-price-value">{property.price}</span>
      </div>
    </div>
  );
}
export default PropertyHeader;