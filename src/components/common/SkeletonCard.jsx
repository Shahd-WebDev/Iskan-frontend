import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>

      <div className="skeleton-content">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line short"></div>

        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;