import PropertyCard from "../home/PropertyCard";

function ResultsGrid({ properties, facilities = [] }) {
  return (
    <div className="d-flex flex-wrap justify-content-start gap-5">
      {properties.map((property) => (
        <div key={property.id} style={{ width: "270px", flexShrink: 0 }}>
          <PropertyCard property={property} facilities={facilities} />
        </div>
      ))}
    </div>
  );
}

export default ResultsGrid;