import FeedbackSection from "./FeedbackSection";
import ReviewDisplay from "./ReviewDisplay";

export default function ReviewSection({ propertyId, bookingStatus }) {
  return (
    <div className="pd-review-section">
      <FeedbackSection propertyId={propertyId} bookingStatus={bookingStatus} />
      <ReviewDisplay />
    </div>
  );
}