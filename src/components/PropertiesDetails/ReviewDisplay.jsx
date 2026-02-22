import { Star } from "lucide-react";
import participant1 from "../../assets/PropertiesDetails/participant1.png";
import participant2 from "../../assets/PropertiesDetails/participant2.png";
import participant3 from "../../assets/PropertiesDetails/participant3.png";
import participant4 from "../../assets/PropertiesDetails/participant4.png";


const mockReview = {
  text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.Velit officia consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud amet.",
  reviewer: "Mary Hilll",
  rating: 4.9,
  participants: [
    participant1,participant2,participant3,participant4
  ],
};

export default function ReviewDisplay() {
  return (
    <div className="pd-review-right">
      <h3 className="pd-section-title-sm">Participants</h3>

      <div className="pd-participants d-flex align-items-center">
        {mockReview.participants.map((p, i) => (
          <img
            key={i}
            src={p}
            alt="participant"
            className="pd-participant-avatar rounded-circle"
            style={{ zIndex: mockReview.participants.length - i }}
          />
        ))}
        <span className="pd-participants-more">10+<br/> More</span>
      </div>

      <hr className="pd-divider" />

      <p className="pd-review-text">{mockReview.text}</p>
      <p className="pd-reviewer-name">{mockReview.reviewer}</p>

      <div className="pd-reviewer-stars d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s <= Math.round(mockReview.rating) ? "#0088FF" : "none"}
            stroke="#0088FF"
          />
        ))}
        <span className="pd-reviewer-rating">
          <span>{mockReview.rating}</span> Rating
        </span>
      </div>
    </div>
  );
}
