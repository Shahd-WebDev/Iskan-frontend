import { useState } from "react";
import RatingStars from "./RatingStars";
import abstractDesign from "../../assets/home/Abstract Design.png";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function FeedbackSection({
  propertyId,
  bookingStatus,
  bookingId,
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
  // const bookingId = localStorage.getItem(`bookingId_${propertyId}`);
    

  console.log("bookingStatus:", bookingStatus);
console.log("bookingId:", bookingId);

    if (!bookingId || bookingStatus !== "confirmed") {
      toast.error("You can only review after your booking is confirmed");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please add a comment");
      return;
    }

    try {
    await api.post(`/Reviews/CreateReview/bookings/${bookingId}`, {
      rating,
      comment: feedback,
    });
      setSubmitted(true);
      toast.success("Review submitted successfully");
      setTimeout(() => setSubmitted(false), 3000);
      setFeedback("");
      setRating(0);

    }   catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit review");
    }
  
};

  return (
    <div className="pd-review-left">
      <div className="section-badge">
        <img src={abstractDesign} alt="Abstract Design" />
      </div>

      <div className="pd-feedback-card">
        <p className="pd-feedback-q text-center">
          How would you rate the overall user experience of This Property?
        </p>

        <p className="pd-feedback-sub text-center">
          Do you find the deal isn't owner good?
        </p>

        <RatingStars value={rating} onChange={setRating} />

        <p className="pd-feedback-label">Can you tell us more?</p>

        <textarea
          className="pd-feedback-textarea"
          placeholder="Add feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />

        <div className="pd-feedback-actions d-flex justify-content-center">
          <button className="pd-feedback-cancel" onClick={() => { setFeedback(""); setRating(0); }}>
            Cancel
          </button>
          <button className="pd-feedback-submit" onClick={handleSubmit}>
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}