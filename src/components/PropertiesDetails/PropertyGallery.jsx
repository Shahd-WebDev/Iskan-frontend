import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PropertyMap from "./PropertyMap";

function PropertyGallery({ images, showMap, setShowMap, propertyId }) {

 images = images || [];

  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);
  const second = (active + 1) % images.length;

 const BASE_URL = "https://isskan-1.runasp.net";

const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
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
          {images.length > 0 ? (
            images.map((img, i) => (
              <button
                key={i}
                className={`pd-thumb ${i === active ? "pd-thumb--active" : ""}`}
                onClick={() => setActive(i)}
              >
                <img src={getImageUrl(img)} alt={`view ${i + 1}`} />
              </button>
            ))
          ) : (
            <div className="pd-thumbnails-placeholder"></div>
          )}
    </div>
    {/* Main Images */}
      <div className="pd-main-images">
      {images.length > 0 ? (
        <>
          <img
            src={getImageUrl(images[active])}
            alt="main"
            className="pd-main-img"
          />
          <img
            src={getImageUrl(images[second])}
            alt="secondary"
            className="pd-main-img"
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
          onClick={images.length > 0 ? prev : undefined}
          disabled={images.length === 0}
        >
          <ArrowLeft size={18} />
        </button>

      {images.length > 0 && (
        <div className="pd-dots d-flex align-items-center">
          {images.map((_, i) => (
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
          onClick={images.length > 0 ? next : undefined}
          disabled={images.length === 0}
        >
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}

export default PropertyGallery;