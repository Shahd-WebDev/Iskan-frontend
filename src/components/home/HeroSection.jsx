import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../home/FiltersRow";
import { allProperties } from "../data/PropertiesData";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRICE_BUCKETS = [
  { label: "800 - 1000",  min: 800,  max: 1000 },
  { label: "1000 - 1300", min: 1000, max: 1300 },
  { label: "1300 - 1600", min: 1300, max: 1600 },
  { label: "1600 - 2000", min: 1600, max: 2000 },
  { label: "2000+",       min: 2000, max: Infinity },
];

const EMPTY_FILTERS = {
  location: "", propertyType: "", priceRange: "", rooms: "", facilities: []
};

function HeroSection() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const dynamicOptions = useMemo(() => ({
    locations:  [...new Set(allProperties.map((p) => p.location.split(",")[0].trim()))].sort(),
    types:      [...new Set(allProperties.map((p) => p.type))].sort(),
    prices:     PRICE_BUCKETS.map((b) => b.label),
    rooms:      [...new Set(allProperties.map((p) => String(p.rooms)))].sort((a, b) => a - b),
    facilities: [...new Set(allProperties.flatMap((p) => p.amenities))].sort(),
  }), []);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // روح لصفحة السيرش مع الفلاتر في الـ URL
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (Array.isArray(v) ? v.length > 0 : v) {
        params.set(k, Array.isArray(v) ? v.join(",") : v);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="hero-section">
      <div className="page-container">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Property</h1>
          <p className="hero-description">
            Welcome to Iskan, where your dream property awaits in every corner of our beautiful world.
            Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
            With categories to suit every dreamer, your journey
          </p>
        </div>
        <div className="search-section position-relative">
          <SearchBar />
          <FiltersRow
            filters={filters}
            dynamicOptions={dynamicOptions}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;