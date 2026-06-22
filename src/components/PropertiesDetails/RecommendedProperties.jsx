import PropertyCard from "../home/propertyCard";
import abstractDesign from "../../assets/home/Abstract Design.png";
function RecommendedProperties({ currentPropertyId, recommendations = [], allFacilities = [] }) {
  return (
    <div className="pd-recommended">
      <div className="section-badge">
        <img src={abstractDesign} alt="Abstract Design" />
      </div>

      <h2 className="pd-rec-title">Recommended For You</h2>

      <div className="d-flex flex-wrap gap-3">
        {recommendations.map((property) => (
          <div key={property.id} style={{ flex: "0 0 calc(25% - 12px)" }}>
            <PropertyCard
              property={property}
              facilities={allFacilities}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedProperties;