import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PropertyMap from "./PropertyMap";

function PropertyGallery({ images, showMap, setShowMap, lat, lng }) {

  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);
  const second = (active + 1) % images.length;

  return (
    <div className="pd-gallery">

      {showMap && (
        <div className="map-wrapper">
          <button className="close-map" onClick={() => setShowMap(false)}>
            ✕
          </button>

          <PropertyMap lat={lat} lng={lng} />
        </div>
      )}

      {/* Thumbnails */}
      <div className="pd-thumbnails d-flex overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            className={`pd-thumb ${i === active ? "pd-thumb--active" : ""}`}
            onClick={() => setActive(i)}
          >
            <img src={img} alt={`view ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* Main Images */}
      <div className="pd-main-images">
        <img src={images[active]} alt="main" className="pd-main-img" />
        <img src={images[second]} alt="secondary" className="pd-main-img" />
      </div>

      {/* Navigation */}
      <div className="pd-gallery-nav d-flex justify-content-center align-items-center">
        <button className="pd-nav-btn" onClick={prev}>
          <ArrowLeft size={18} />
        </button>

        <div className="pd-dots d-flex align-items-center">
          {images.map((_, i) => (
            <span
              key={i}
              className={`pd-dot ${i === active ? "pd-dot--active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <button className="pd-nav-btn" onClick={next}>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}

export default PropertyGallery;