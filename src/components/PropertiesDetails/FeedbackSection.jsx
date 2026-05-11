import { useState } from "react";
import RatingStars from "./RatingStars";
import abstractDesign from "../../assets/home/Abstract Design.png";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function FeedbackSection({
  propertyId,
}) {

  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {

    if (!feedback.trim()) return;

    try {

      await api.post(
        `/Report/Create?propertyId=${propertyId}`,
        {
          reason: feedback,

          priority:
            rating <= 2
              ? "High"
              : rating === 3
              ? "Medium"
              : "Low",
        }
      );

      setSubmitted(true);

      toast.success(
        "Report submitted successfully"
      );

      setTimeout(
        () => setSubmitted(false),
        3000
      );

      setFeedback("");

    } catch (error) {

      console.log(error);

      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="pd-review-left">

      <div className="section-badge">
        <img
          src={abstractDesign}
          alt="Abstract Design"
        />
      </div>

      <div className="pd-feedback-card">

        <p className="pd-feedback-q text-center">
          How would you rate the overall user
          experience of This Property?
        </p>

        <p className="pd-feedback-sub text-center">
          Do you find the deal isn't owner good?
        </p>

        <RatingStars
          value={rating}
          onChange={setRating}
        />

        <p className="pd-feedback-label">
          Can you tell us more?
        </p>

        <textarea
          className="pd-feedback-textarea"
          placeholder="Add feedback"
          value={feedback}
          onChange={(e) =>
            setFeedback(e.target.value)
          }
          rows={4}
        />

        <div className="pd-feedback-actions d-flex justify-content-center">

          <button
            className="pd-feedback-cancel"
            onClick={() => setFeedback("")}
          >
            Cancel
          </button>

          <button
            className="pd-feedback-submit"
            onClick={handleSubmit}
          >
            {submitted
              ? "Submitted!"
              : "Submit"}
          </button>

        </div>

      </div>
    </div>
  );
}