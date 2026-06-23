import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../home/FiltersRow";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailablePriceBuckets } from "../Search/FilterSearch";

function getType(p) {
  if (typeof p.propertyType === "number") {
    return ["Room", "Apartment", "Studio"][p.propertyType] ?? "Room";
  }
  return p.propertyType || p.type || "Room";
}

const EMPTY_FILTERS = {
  location: "", propertyType: "", priceRange: "", rooms: "", facilities: []
};

function HeroSection() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [allProperties, setAllProperties] = useState([]);
  const [facilities, setFacilities] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [propertiesRes, facilitiesRes] = await Promise.all([
          fetch(`/api/Property/GetAll?pageSize=1000`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`/api/Facility/GetAll`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (propertiesRes.ok) {
          const data = await propertiesRes.json();
          setAllProperties(data.data || []);
        }

        if (facilitiesRes.ok) {
          const facilitiesData = await facilitiesRes.json();
          setFacilities(facilitiesData.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const dynamicOptions = useMemo(() => ({
    locations: [...new Set(allProperties.map((p) => p.address || p.location || ""))].filter(Boolean).sort(),
    types:      [...new Set(allProperties.map((p) => getType(p)))].filter(Boolean).sort(),
    prices:     getAvailablePriceBuckets(allProperties).map((b) => b.label),
    rooms:      [...new Set(allProperties.map((p) => String(p.roomsNumber ?? p.rooms)))].filter(Boolean).sort((a, b) => a - b),
    facilities: facilities.map((f) => f.name).filter(Boolean).sort(), 
  }), [allProperties, facilities]);

 

 const handleFilterChange = (key, value) => {
  const updated = { ...filters, [key]: value };
  setFilters(updated);

  const params = new URLSearchParams();
  Object.entries(updated).forEach(([k, v]) => {
    if (Array.isArray(v) ? v.length > 0 : v) {
      params.set(k, Array.isArray(v) ? v.join(",") : v);
    }
  });

  navigate(`/properties?${params.toString()}`);
};
const handleSearch = (e) => {
  e.preventDefault();
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([k, v]) => {
    if (Array.isArray(v) ? v.length > 0 : v) {
      params.set(k, Array.isArray(v) ? v.join(",") : v);
    }
  });

  if (searchText.trim()) params.set("search", searchText.trim());

  navigate(`/properties?${params.toString()}`);
};
  return (
  <section id="hero" className="hero-section">
    <div className="page-container">

      <div className="hero-content">
        <h1 className="hero-title">Find Your Dream Property</h1>
        <p className="hero-description">
         Welcome to Iskan, where your dream property awaits in every corner of our beautiful world.
          Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
           With categories to suit every dreamer, your journey
        
        </p>
      </div>

      <div className="search-section">

        {/* 🔍 SEARCH  */}
        <div className="search-wrapper">
          <SearchBar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSubmit={handleSearch}
          />
        </div>

        {/*  FILTERS (Full width) */}
        <div className="filters-wrapper">
          <FiltersRow
            filters={filters}
            dynamicOptions={dynamicOptions}
            onFilterChange={handleFilterChange}
          />
        </div>

      </div>

    </div>
  </section>
);

}
export default HeroSection;