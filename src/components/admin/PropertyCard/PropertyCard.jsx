import "./PropertyCard.css";

export default function PropertyCard({image,title,price}) {
  return (
    <div className="property-card">
      <img src={image} alt={title} />

      <h3>{price}</h3>

      <p>{title}</p>

      <button>View Details</button>
    </div>
  );
}