import { useContext } from "react";
import { SavedContext } from "../../context/SavedContext";
import PropertyCard from "../../components/home/propertyCard";
import { BookmarkX } from "lucide-react";
import "../properties/Properties.css";

function SavedProperties() {

  const { savedProperties } = useContext(SavedContext);

  return (
    <div className="properties-page">

      <div className="properties-top">
        <h2 className="saved-properties-title">
          Saved Properties
        </h2>
      </div>

      <div className="properties-grid saved-grid">

        {savedProperties.length === 0 ? (

          <div className="empty-saved">
            <BookmarkX size={70} strokeWidth={1.5} />
            <p>No saved properties yet</p>
          </div>

        ) : (
          savedProperties.map((property) => (
            <div key={property.id}>
              <PropertyCard property={property} />
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default SavedProperties;