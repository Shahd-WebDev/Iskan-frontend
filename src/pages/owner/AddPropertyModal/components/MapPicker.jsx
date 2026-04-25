import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Search, Loader2, CheckCircle, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER = [30.0444, 31.2357]; // Cairo, Egypt

// Helper component to update map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

/**
 * MapPicker component for selecting property location.
 */
const MapPicker = ({ location, isLocationSelected, onLocationSelect }) => {
  const [mapSearch, setMapSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setMapSearch(query);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (query.length > 2) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
          const data = await response.json();
          setSearchResults(data);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const addressComp = result.address || {};
    
    onLocationSelect(lat, lng, result.display_name, {
      city: addressComp.city || addressComp.town || addressComp.village || addressComp.suburb || "",
      state: addressComp.state || "",
      country: addressComp.country || "",
      zipCode: addressComp.postcode || ""
    });
    
    setSearchResults([]);
    setMapSearch("");
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        reverseGeocode(lat, lng);
      },
    });

    const reverseGeocode = async (lat, lng) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const result = await response.json();
        if (result && result.display_name) {
          const addressComp = result.address || {};
          onLocationSelect(lat, lng, result.display_name, {
            city: addressComp.city || addressComp.town || addressComp.village || addressComp.suburb || "",
            state: addressComp.state || "",
            country: addressComp.country || "",
            zipCode: addressComp.postcode || ""
          });
        }
      } catch (err) {
        console.error("Reverse geocode error:", err);
      }
    };

    return location.lat ? (
      <Marker 
        position={[location.lat, location.lng]}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const { lat, lng } = marker.getLatLng();
            reverseGeocode(lat, lng);
          },
        }}
      />
    ) : null;
  };

  return (
    <div className="map-container-wrapper">
      <div className="map-search-wrapper">
        <div className="relative">
          <Search className="search-icon-map" size={16} />
          <input
            type="text"
            className="map-search-input"
            placeholder="Search for your property location..."
            value={mapSearch}
            onChange={handleSearchChange}
          />
          {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="spinner" /></div>}
        </div>

        {searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                className="search-result-item"
                onClick={() => handleResultSelect(result)}
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <MapContainer 
        center={location.lat ? [location.lat, location.lng] : DEFAULT_CENTER} 
        zoom={13} 
        className="map-picker"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView 
          center={location.lat ? [location.lat, location.lng] : DEFAULT_CENTER} 
          zoom={location.lat ? 17 : 13} 
        />
        <LocationMarker />
      </MapContainer>

      <div className={`location-status-badge ${isLocationSelected ? 'selected' : 'pending'}`}>
        {isLocationSelected ? <CheckCircle size={14} /> : <MapPin size={14} />}
        <span>{isLocationSelected ? "Location Selected" : "Click map or search to select location"}</span>
      </div>
    </div>
  );
};

export default MapPicker;
