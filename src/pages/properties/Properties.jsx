import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/PropertyCard";
import PaginationControls from "../../components/Pagination/Pagination";

import {
  applyFilters,
  EMPTY_FILTERS,
  getAvailablePriceBuckets
} from "../../components/Search/FilterSearch";


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
  const [activeFilters, setActiveFilters] = useState({
    ...EMPTY_FILTERS,
    search: ""
  });

  const [allProperties, setAllProperties] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 16;

  const facilitiesMap = useMemo(() => {
    const map = {};
    facilities.forEach(f => {
      map[f.id] = f.name;
    });
    return map;
  }, [facilities]);

  useEffect(() => {
    setActiveFilters({
      location: searchParams.get("location") || "",
      propertyType: searchParams.get("propertyType") || "",
      priceRange: searchParams.get("priceRange") || "",
      rooms: searchParams.get("rooms") || "",
      facilities: searchParams.get("facilities")
        ? searchParams.get("facilities").split(",")
        : [],
      search: searchParams.get("search") || ""
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
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }),
          fetch(`/api/Facility/GetAll`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          })
        ]);

        const propertiesData = await propertiesRes.json();

        const facilitiesData = await facilitiesRes.json();

        setAllProperties(approved);
        setFacilities(facilitiesData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dynamicOptions = useMemo(() => {
  const without = (key) =>
    applyFilters(
      allProperties,
      { ...activeFilters, [key]: key === "facilities" ? [] : "", search: "" },
      facilitiesMap
    );
  const listForFacilities = without("facilities");

  const facilityOptions = [
    ...new Set(
      listForFacilities.flatMap(p =>
        (p.facilities || []).map(id => facilitiesMap[id]).filter(Boolean)
      )
    )
  ].sort();

  return {
    locations: [
      ...new Set(without("location").map(p => p.address || p.location || ""))
    ].filter(Boolean).sort(),

    types: [
      ...new Set(without("propertyType").map(getType))
    ].filter(Boolean).sort(),

    prices: getAvailablePriceBuckets(without("priceRange")).map(b => b.label),

    rooms: [
      ...new Set(without("rooms").map(p => String(p.roomsNumber || p.rooms)))
    ].filter(Boolean).sort(),

    facilities: facilityOptions
  };
}, [allProperties, activeFilters, facilitiesMap]);

  const { totalPages, currentProperties } = useMemo(() => {
    const filtersWithSearch = { ...activeFilters, search: searchText };
    const filtered = applyFilters(allProperties, filtersWithSearch, facilitiesMap);


    const total = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;

    return {
      totalPages: total,
      currentProperties: filtered.slice(start, start + itemsPerPage)
    };
  }, [allProperties, activeFilters, searchText, currentPage, facilitiesMap]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;
const handleSearch = (e) => {
  e.preventDefault();

  const params = new URLSearchParams(searchParams);

  if (searchText.trim()) {
    params.set("search", searchText.trim());
  } else {
    params.delete("search");
  }

  setSearchParams(params);
};
  return (
    <div className="properties-page">

      {/* ✅ SEARCH AREA (FIXED LAYOUT) */}
      <div className="properties-search">
        <div className="search-wrapper">

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
      </div>

      {/*  GRID */}
      <div className="properties-grid">
        {currentProperties.length === 0 ? (
          <div className="text-center py-5">
            No properties found
          </div>
        ) : (
          <div className="properties-cards-grid">
            {currentProperties.map(property => (
              <div key={property.id} >
                <PropertyCard property={property} facilities={facilities} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className="properties-pagination-wrapper">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label={`${currentPage} / ${totalPages}`}
          />
        </div>
      )}

    </div>
  );
}