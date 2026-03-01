import PropertyCard from "../home/propertyCard";
import { allProperties } from "../data/PropertiesData";
import abstractDesign from "../../assets/home/Abstract Design.png";


function RecommendedProperties({ currentPropertyId }) {

  const recommended = allProperties
    .filter((p) => p.id !== currentPropertyId)
    .slice(0, 4);

  return (
    <div className="pd-recommended">
      <div className="section-badge">
        <img src={abstractDesign} alt="Abstract Design" />
      </div>
 
      <h2 className="pd-rec-title">Recommended For You</h2>

      <div className="row g-3">
        {recommended.map((property) => (
          <div key={property.id} className="col-12 col-sm-6 col-lg-3">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedProperties;

