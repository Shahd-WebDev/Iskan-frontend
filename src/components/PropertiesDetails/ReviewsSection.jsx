import FeedbackSection from "./FeedbackSection";
import ReviewDisplay from "./ReviewDisplay";

export default function ReviewSection({
  propertyId,
  bookingStatus,
  bookingId,
}) {
  return (
    <div className="pd-review-section">
      <FeedbackSection
  propertyId={propertyId}
  bookingId={bookingId}
  bookingStatus={bookingStatus}
/>
      <ReviewDisplay />
    </div>
  );
}