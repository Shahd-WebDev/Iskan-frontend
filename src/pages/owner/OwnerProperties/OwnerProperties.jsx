import { useState, useContext } from "react";
import { Plus, Edit2, Trash2, Wifi, Utensils, Car, Wind, Waves, Dumbbell, Tv, Droplet } from "lucide-react";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import { PropertyContext } from "../../../../context/PropertyContext";
import "./OwnerProperties.css";

const amenityIcons = {
  "WiFi": <Wifi size={14} />,
  "Kitchen": <Utensils size={14} />,
  "Parking": <Car size={14} />,
  "Air Conditioning": <Wind size={14} />,
  "Swimming Pool": <Waves size={14} />,
  "Gym": <Dumbbell size={14} />,
  "TV": <Tv size={14} />,
  "Water Heater": <Droplet size={14} />
};

export default function OwnerProperties() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { properties } = useContext(PropertyContext);

  return (
    <div className="owner-properties-wrapper">
      <div className="op-header">
        <div>
          <h1 className="op-title">My Properties</h1>
          <p className="op-subtitle">Manage your property listings</p>
        </div>
        <button className="btn-add-property" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add Property</span>
        </button>
      </div>

      <div className="op-grid">
        {properties.map((property) => (
          <div key={property.id} className="op-card">
            <div className="op-card-image" style={{ backgroundColor: property.color || '#D1D5DB' }}>
              <div className="op-card-actions">
                <button className="op-action-btn blue"><Edit2 size={14} /></button>
                <button className="op-action-btn red"><Trash2 size={14} /></button>
              </div>
              <span className={`op-badge ${property.status}`}>{property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
            </div>
            <div className="op-card-content">
              <h4>{property.name}</h4>
              <p className="op-card-location">{property.location}</p>
              {property.description && <p className="op-card-desc">{property.description}</p>}
              {property.amenities && property.amenities.length > 0 && (
                <div className="op-card-amenities">
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-icon">
                      {amenityIcons[amenity] || <Plus size={14} />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && <AddPropertyModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
