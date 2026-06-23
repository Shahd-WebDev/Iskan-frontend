import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PropertyMap from "./PropertyMap";
import { getImageUrl, fallbackImage } from "../../utils/imageLoader";

function PropertyGallery({ images, showMap, setShowMap, propertyId }) {
  const sanitizedImages = Array.isArray(images) ? images : [];
  const displayImages = sanitizedImages.map(getImageUrl);
  const [active, setActive] = useState(0);

  const activeIndex = displayImages.length > 0 ? Math.min(active, displayImages.length - 1) : 0;
  const second = displayImages.length > 0 ? (activeIndex + 1) % displayImages.length : 0;
  const prev = () =>
    setActive((a) => (a - 1 + displayImages.length) % displayImages.length);
  const next = () => setActive((a) => (a + 1) % displayImages.length);

  const handleImageError = (event) => {
    const target = event.currentTarget;
    if (target.src !== fallbackImage) {
      target.onerror = null;
      target.src = fallbackImage;
    }
  };
  return (
    <div className="pd-gallery">
      {showMap && (
        <div className="map-wrapper">
          <button className="close-map" onClick={() => setShowMap(false)}>
            ✕
          </button>

          <PropertyMap propertyId={propertyId} />
        </div>
      )}

      {/* Thumbnails */}
      <div className="pd-thumbnails d-flex overflow-x-auto">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => (
            <button
              key={i}
              className={`pd-thumb ${i === activeIndex ? "pd-thumb--active" : ""}`}
              onClick={() => setActive(i)}
              type="button"
            >
              <img src={img} alt={`view ${i + 1}`} onError={handleImageError} />
            </button>
          ))
        ) : (
          <div className="pd-thumbnails-placeholder"></div>
        )}
      </div>
      {/* Main Images */}
      <div className="pd-main-images">
        {displayImages.length > 0 ? (
          <>
            <img
              src={displayImages[activeIndex]}
              alt="main"
              className="pd-main-img"
              onError={handleImageError}
            />
            <img
              src={displayImages[second]}
              alt="secondary"
              className="pd-main-img"
              onError={handleImageError}
            />
          </>
        ) : (
          <>
            <div className="pd-main-img placeholder"></div>
            <div className="pd-main-img placeholder"></div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="pd-gallery-nav d-flex justify-content-center align-items-center">
        <button
          className="pd-nav-btn"
          onClick={displayImages.length > 0 ? prev : undefined}
          disabled={displayImages.length === 0}
        >
          <ArrowLeft size={18} />
        </button>

        {displayImages.length > 0 && (
          <div className="pd-dots d-flex align-items-center">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`pd-dot ${i === active ? "pd-dot--active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        )}

        <button
          className="pd-nav-btn"
          onClick={displayImages.length > 0 ? next : undefined}
          disabled={displayImages.length === 0}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default PropertyGallery;
