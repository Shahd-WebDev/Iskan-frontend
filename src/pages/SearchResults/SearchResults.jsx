import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PaginationControls from "../../components/Pagination/Pagination";
import { applyFilters, detectSearchIntent, hasAnyFilter, EMPTY_FILTERS, getAvailablePriceBuckets } from "../../components/Search/FilterSearch";
import ResultsGrid from "../../components/Search/ResultsGrid";
import { fetchApprovedProperties } from "../../utils/fetchApprovedProperties";
import "./SearchResults.css";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [allProperties, setAllProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
const [facilities, setFacilities] = useState([]);

 useEffect(() => {
  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch only Approved properties (verificationStatus from GetDetails)
      const [approved, facilitiesRes] = await Promise.all([
        fetchApprovedProperties(token),
        fetch(`/api/Facility/GetAll`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      setAllProperties(approved);
      if (facilitiesRes.ok) {
        const facilitiesData = await facilitiesRes.json();
        setFacilities(facilitiesData.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPropertiesLoading(false);
    }
  };
  fetchProperties();
}, []);

  const initialFilters = useMemo(() => ({
    location:     searchParams.get("location")     || "",
    propertyType: searchParams.get("propertyType") || "",
    priceRange:   searchParams.get("priceRange")   || "",
    rooms:        searchParams.get("rooms")        || "",
    facilities:   searchParams.get("facilities") ? searchParams.get("facilities").split(",") : [],
  }), [searchParams]);

  const hasInitialFilters = useMemo(() =>
    Object.values(initialFilters).some((v) => Array.isArray(v) ? v.length > 0 : !!v)
  , [initialFilters]);

  const [searchText, setSearchText]       = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery, []).filters : initialFilters
  );
  const [currentPage, setCurrentPage]     = useState(1);
  const [hasSearched, setHasSearched]     = useState(!!initialQuery);
  const [searchMatched, setSearchMatched] = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery, []).matched : false
  );
  const [titleResults, setTitleResults]   = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery, []).titleResults || null : null
  );
  const [showResults, setShowResults]     = useState(!!initialQuery || hasInitialFilters);
  const ITEMS_PER_PAGE = 8;

 const results  = useMemo(() => {
    if (!showResults) return [];
    if (searchText.trim() && !searchMatched && !hasInitialFilters) return [];
    const baseList = titleResults || allProperties;
    return applyFilters(baseList, activeFilters);
  }, [activeFilters, showResults, searchMatched, searchText, titleResults, hasInitialFilters, allProperties]);

  const getType = (p) => {
  if (typeof p.propertyType === "number") {
    return ["Room", "Apartment", "Studio"][p.propertyType] ?? "Room";
  }
  return p.propertyType || p.type || "Room";
};

  const dynamicOptions = useMemo(() => {
    const baseList = titleResults || allProperties;

    if (!hasAnyFilter(activeFilters)) {
      return {
        locations: [...new Set(baseList.map((p) => p.address || p.location || ""))].filter(Boolean).sort(),
        types:      [...new Set(baseList.map((p) => getType(p)))].sort(),
        prices:     getAvailablePriceBuckets(baseList).map((b) => b.label),
        rooms:      [...new Set(baseList.map((p) => String(p.roomsNumber ?? p.rooms)))].sort((a, b) => a - b),
        facilities: [...new Set(baseList.flatMap((p) => p.amenities || []))].sort(),
      };
    }

    const without = (key) => applyFilters(baseList, { ...activeFilters, [key]: key === "facilities" ? [] : "" });
    return {
      locations:  [...new Set(without("location").map((p) => (p.address || p.location || "").split(",")[0].trim()))].sort(),
      types:      [...new Set(without("propertyType").map((p) => getType(p)))].sort(),
      prices:     getAvailablePriceBuckets(without("priceRange")).map((b) => b.label),
      rooms:      [...new Set(without("rooms").map((p) => String(p.roomsNumber ?? p.rooms)))].sort((a, b) => a - b),
      facilities: [...new Set(without("facilities").flatMap((p) => p.amenities || []))].sort(),
    };
  }, [activeFilters, titleResults, allProperties]);

  const handleFilterChange = useCallback((key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setShowResults(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      setActiveFilters(EMPTY_FILTERS);
      setHasSearched(false);
      setSearchMatched(false);
      setShowResults(false);
      setCurrentPage(1);
      return;
    }
     console.log("search result:", detectSearchIntent(searchText, allProperties)); // ← ضيفي ده
    const { filters, matched, titleResults: tr } = detectSearchIntent(searchText, allProperties);
    setActiveFilters(filters);
    setHasSearched(true);
    setSearchMatched(matched);
    setTitleResults(tr || null);
    setShowResults(true);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const currentProperties = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="search-result-page">
      <SearchBar
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          if (!e.target.value.trim()) {
            setActiveFilters(EMPTY_FILTERS);
            setHasSearched(false);
            setSearchMatched(false);
            setTitleResults(null);
            setShowResults(false);
          }
        }}
        onSubmit={handleSubmit}
      />

      <FiltersRow
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        dynamicOptions={dynamicOptions}
      />

      {propertiesLoading ? (
        <p className="text-center">Loading...</p>
      ) : (hasSearched && !searchMatched) || showResults ? (
         <div className="results-section">
    <h5 className="results-label">RESULTS</h5>
    {results.length === 0 ? (
      <div className="no-results text-center py-5">
        <p className="text-muted">No properties found matching your search.</p>
      </div>
    ) : (
      <>
        <ResultsGrid properties={currentProperties} facilities={facilities} />
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label={`${results.length} of ${allProperties.length}`}
        />
      </>
    )}
  </div>
) : null}
    </div>
  );
}

export default SearchResult;