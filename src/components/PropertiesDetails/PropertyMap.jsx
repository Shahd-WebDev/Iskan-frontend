import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function PropertyMap({ propertyId }) {
  const { token } = useAuth();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`/api/Property/GetLocation?id=${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setLocation(data);
      } catch {}
    };
    fetchLocation();
  }, [propertyId, token]);

  if (!location) return null;

  return (
    <div className="property-map">
      <iframe
        title="property-location"
        src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
        width="100%"
        height="485"
        style={{ border: 0, borderRadius: "12px" }}
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default PropertyMap;