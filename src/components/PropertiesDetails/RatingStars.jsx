import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingStars({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="pd-stars d-flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={`pd-star ${
            s <= (hovered || value) ? "pd-star--filled" : ""
          }`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
    </div>
  );
}