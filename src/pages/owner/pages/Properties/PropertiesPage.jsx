import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Wifi, Utensils, Car, Wind, Waves, Dumbbell, Tv, Droplet } from "lucide-react";
import AddPropertyModal from "../../features/add-property/AddPropertyModal";
import { PropertyContext } from "../../../../context/PropertyContext";
import styles from "./PropertiesPage.module.css";

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

export default function PropertiesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { properties, deleteProperty } = useContext(PropertyContext);

  return (
    <div className={styles["owner-properties-wrapper"]}>
      <div className={styles["op-header"]}>
        <div>
          <h1 className={styles["op-title"]}>My Properties</h1>
          <p className={styles["op-subtitle"]}>Manage your property listings</p>
        </div>
        <Link 
          to="/owner-dashboard/add-property" 
          state={{ from: location.pathname }}
          style={{ textDecoration: 'none' }}
        >
          <button className={styles["btn-add-property"]}>
            <Plus size={18} />
            <span>Add Property</span>
          </button>
        </Link>
      </div>

      <div className={styles["op-grid"]}>
        {properties.map((property) => (
          <div key={property.id} className={styles["op-card"]}>
            <div className={styles["op-card-image"]} style={{ backgroundColor: property.color || '#D1D5DB' }}>
              {property.image && <img src={property.image} alt={property.name} className={styles["property-image"]} />}
              <div className={styles["op-card-actions"]}>
                <button 
                  className={`${styles["op-action-btn"]} ${styles["blue"]}`}
                  onClick={() => navigate("/owner-dashboard/add-property", { 
                    state: { propertyToEdit: property, from: location.pathname } 
                  })}
                  title="Edit Property"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className={`${styles["op-action-btn"]} ${styles["red"]}`}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this property?")) {
                      deleteProperty(property.id);
                    }
                  }}
                  title="Delete Property"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <span className={`${styles["op-badge"]} ${styles[property.status]}`}>{property.status.charAt(0).toUpperCase() + property.status.slice(1)}</span>
            </div>
            <div className={styles["op-card-content"]}>
              <h4>{property.name}</h4>
              <p className={styles["op-card-location"]}>{property.location}</p>
              {property.description && <p className={styles["op-card-desc"]}>{property.description}</p>}
              {property.amenities && property.amenities.length > 0 && (
                <div className={styles["op-card-amenities"]}>
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className={styles["amenity-icon"]}>
                      {amenityIcons[amenity] || <Plus size={14} />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal is now handled via routing */}
    </div>
  );
}
