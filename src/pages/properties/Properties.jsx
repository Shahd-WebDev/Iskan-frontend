import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/PropertyCard";
import PaginationControls from "../../components/Pagination/Pagination";
import { applyFilters, EMPTY_FILTERS, getAvailablePriceBuckets } from "../../components/Search/FilterSearch";

import "./Properties.css";

function getType(p) {
  if (typeof p.propertyType === "number") {
    return ["Room", "Apartment", "Studio"][p.propertyType] ?? "Room";
  }
  return p.propertyType || p.type || "Room";
}

export default function Properties() {
  const [searchParams] = useSearchParams();
const [searchText, setSearchText] = useState(searchParams.get("search") || "");

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({ ...EMPTY_FILTERS, search: "" });
  const [allProperties, setAllProperties] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  const itemsPerPage = 16;


  const facilitiesMap = useMemo(() => {
  const map = {};
  facilities.forEach(f => { map[f.id] = f.name; });
  return map;
}, [facilities]);


const getFacilityNames = (ids = []) => ids.map(id => facilitiesMap[id]).filter(Boolean);

useEffect(() => {
  setActiveFilters({
    location:     searchParams.get("location")     || "",
    propertyType: searchParams.get("propertyType") || "",
    priceRange:   searchParams.get("priceRange")   || "",
    rooms:        searchParams.get("rooms")         || "",
    facilities:   searchParams.get("facilities") ? searchParams.get("facilities").split(",") : [],
    search:       searchParams.get("search")        || "",
  });
  setSearchText(searchParams.get("search") || "");
  setCurrentPage(1);
}, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [propertiesRes, facilitiesRes] = await Promise.all([
          fetch(`/api/Property/GetAll?pageSize=1000`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/Facility/GetAll`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!propertiesRes.ok) throw new Error("Failed to fetch properties");
        if (!facilitiesRes.ok) throw new Error("Failed to fetch facilities");

        const propertiesData = await propertiesRes.json();
        const facilitiesData = await facilitiesRes.json();
        console.log("facilities raw:", facilitiesData);
console.log("facilities array:", facilitiesData.data);

        setAllProperties(propertiesData.data || []);
        setFacilities(facilitiesData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredWithoutKey = (properties, filters, keyToRemove) => {
  const { [keyToRemove]: removed, ...restFilters } = filters;
  if (keyToRemove === 'facilities') return applyFilters(properties, { ...restFilters, facilities: [] }, facilitiesMap);
  if (keyToRemove === 'priceRange') return applyFilters(properties, { ...restFilters, priceRange: '' }, facilitiesMap);
  return applyFilters(properties, restFilters, facilitiesMap);
};

  const dynamicOptions = useMemo(() => {
    const { search, ...filtersWithoutSearch } = activeFilters;
     const facilityOptions = facilities.map(f => f.name).filter(Boolean).sort();
     console.log("facilities state:", facilities);
console.log("facilityOptions:", facilityOptions);

if (Object.values(filtersWithoutSearch).every(v => v === '' || v.length === 0)) {
  
      return {
        locations:  [...new Set(allProperties.map((p) => p.address || p.location || ""))].filter(Boolean).sort(),
        types:      [...new Set(allProperties.map(p => getType(p)))].filter(Boolean).sort(),
        prices:     getAvailablePriceBuckets(allProperties).map(b => b.label),
        rooms:      [...new Set(allProperties.map(p => String(p.roomsNumber || p.rooms)))].filter(Boolean).sort((a, b) => Number(a) - Number(b)),
         facilities: facilityOptions,
      };
    }

    return {
      locations:  [...new Set(getFilteredWithoutKey(allProperties, activeFilters, 'location').map(p => p.address || p.location || ""))].filter(Boolean).sort(),
      types:      [...new Set(getFilteredWithoutKey(allProperties, activeFilters, 'propertyType').map(p => getType(p)))].filter(Boolean).sort(),
      prices:     getAvailablePriceBuckets(getFilteredWithoutKey(allProperties, activeFilters, 'priceRange')).map(b => b.label),
      rooms:      [...new Set(getFilteredWithoutKey(allProperties, activeFilters, 'rooms').map(p => String(p.roomsNumber || p.rooms)))].filter(Boolean).sort((a, b) => Number(a) - Number(b)),
      facilities: facilityOptions,
        };
  }, [activeFilters, allProperties, facilities, facilitiesMap])


  const { totalPages, currentProperties } = useMemo(() => {
    const filtersWithSearch = { ...activeFilters, search: searchText };
    const filtered = applyFilters(allProperties, filtersWithSearch, facilitiesMap);
    const total = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const current = filtered.slice(start, start + itemsPerPage);
    return { totalPages: total, currentProperties: current };
  }, [allProperties, activeFilters, searchText, currentPage, facilitiesMap]);


  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (loading) return <div className="text-center py-5">جاري تحميل العقارات...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  

  return (
    <div className="properties-page">
      <div className="properties-top search-wrapper">
              
        <SearchBar
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          onSubmit={(e) => e.preventDefault()}
        />
        <FiltersRow
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          dynamicOptions={dynamicOptions}
        />
      </div>

      {currentProperties.length === 0 ? (
        <div className="text-center py-5">No properties found matching your search.</div>
      ) : (
        <>
          <div className="properties-grid">
            <div className="d-flex flex-wrap justify-content-center gap-4">
              {currentProperties.map(property => (
                <div key={property.id} style={{ width: "270px" }}>
                  <PropertyCard property={property} facilities={facilities} />
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="properties-pagination-wrapper">
              <div className="properties-pagination">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  label={`${currentPage} من ${totalPages}`}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
