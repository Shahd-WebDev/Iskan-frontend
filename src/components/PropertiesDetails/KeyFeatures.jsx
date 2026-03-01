import { Zap } from "lucide-react";


const defaultFeatures = [
  "Smart common areas designed to boost productivity.",
  "Comfort-boosting room layouts that maximize space and privacy.",
  "A calm, quiet atmosphere ideal for late-night studying.",
  "Community events that make it easy to build new friendships.",
  "Modern lounge spaces perfect for group projects or relaxation.",
];

function KeyFeatures({ features = defaultFeatures }) {
  return (
    <div className="pd-key-features">
      <h3 className="pd-section-title-sm1">Key Features and Amenities</h3>
      <ul className="pd-features-list list-unstyled p-0 m-0 d-flex flex-column" >
        {features.map((feature, i) => (
          <li key={i} className="pd-feature-item d-flex align-items-center">
            <Zap size={13} className="pd-feature-icon flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyFeatures;