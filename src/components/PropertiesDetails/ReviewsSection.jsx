import FeedbackSection from "./FeedbackSection";
import ReviewDisplay from "./ReviewDisplay";

export default function ReviewSection({
  propertyId,
}) {
  return (
    <div className="pd-review-section">

      <FeedbackSection
        propertyId={propertyId}
      />

      <ReviewDisplay />

    </div>
  );
}