import { Bed, Bath, Wifi } from "lucide-react";

function PropertyInfo() {
  return (
    <div className="property-info">

      <div className="actions">
        <button className="primary">Request Booking</button>
        <button>Save</button>
        <button>Share</button>
      </div>

      <h3>Description</h3>
      <p>
        Comfortable apartment with modern design, perfect for students and
        professionals looking for quiet living.
      </p>

      <div className="stats">
        <span><Bed size={14} /> 2 Bedrooms</span>
        <span><Bath size={14} /> 1 Bathroom</span>
        <span><Wifi size={14} /> WiFi</span>
      </div>

      <div className="amenities">
        <span>Wi-Fi</span>
        <span>CCTV Monitoring</span>
        <span>Supermarket Nearby</span>
        <span>Public Transport</span>
      </div>

    </div>
  );
}

export default PropertyInfo;