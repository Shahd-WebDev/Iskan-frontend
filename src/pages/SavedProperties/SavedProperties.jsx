import { useEffect, useState, useContext } from "react";
import { SavedContext } from "../../context/SavedContext";
import PropertyCard from "../../components/home/PropertyCard";
import { BookmarkX } from "lucide-react";
import "../properties/Properties.css";
import { useAuth } from "../../context/AuthContext";

 export default function SavedProperties() {
  const { token } = useAuth();
  const { savedProperties, loading } = useContext(SavedContext);

  const [allFacilities, setAllFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      const res = await fetch("/api/Facility/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAllFacilities(data.data || []);
    };

    if (token) fetchFacilities();
  }, [token]);

  if (loading) {
    return <div className="properties-page">Loading...</div>;
  }

  return (
    <div className="properties-page">
      <div className="properties-top">
        <h2>Saved Properties</h2>
      </div>

      <div className="properties-grid saved-grid">
        {savedProperties.length === 0 ? (
          <div className="empty-saved">
            <BookmarkX size={70} />
            <p>No saved properties yet</p>
          </div>
        ) : (
          savedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              facilities={allFacilities}
            />
          ))
        )}
      </div>
    </div>
  );
}