import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { allProperties } from "../../components/data/PropertiesData";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/propertyCard";
import PaginationControls from "../../components/Pagination/Pagination";
import "./SearchResults.css";

const EMPTY_FILTERS = { location: "", propertyType: "", priceRange: "", rooms: "", facilities: [] };

function SearchResult() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchText, setSearchText]       = useState(initialQuery);
  const [displayValues, setDisplayValues] = useState(EMPTY_FILTERS);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage]     = useState(1);
  const [hasSearched, setHasSearched]     = useState(!!initialQuery);
  const ITEMS_PER_PAGE = 8;

  const textFilteredResults = useMemo(() => {
    if (!hasSearched) return [];
    const query = searchText.toLowerCase().trim();
    if (!query) return [];
    return allProperties.filter((p) =>
      p.title.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      parseInt(p.price) === parseInt(query) ||
      p.amenities.some((a) => a.toLowerCase().includes(query))
    );
  }, [searchText, hasSearched]);

  const dynamicOptions = useMemo(() => ({
    locations:  [...new Set(textFilteredResults.map((p) => p.location.split(",")[0].trim()))].sort(),
    types:      [...new Set(textFilteredResults.map((p) => p.type))].sort(),
    rooms:      [...new Set(textFilteredResults.map((p) => String(p.rooms)))].sort((a, b) => a - b),
    facilities: [...new Set(textFilteredResults.flatMap((p) => p.amenities))].sort(),
  }), [textFilteredResults]);

  useEffect(() => {
    if (textFilteredResults.length === 0) {
      setDisplayValues(EMPTY_FILTERS);
      setActiveFilters(EMPTY_FILTERS);
      return;
    }

    const first = textFilteredResults[0];


    const prices   = textFilteredResults.map((p) => parseInt(p.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setDisplayValues({
      location:     first.location.split(",")[0].trim(),
      propertyType: first.type,
      priceRange:   `${minPrice} - ${maxPrice}`,
      rooms:        String(first.rooms),
      facilities:   first.amenities,
    });

    setActiveFilters(EMPTY_FILTERS);
  }, [textFilteredResults]);

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setDisplayValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const results = useMemo(() => {
    return textFilteredResults.filter((p) => {
      const matchesLocation =
        !activeFilters.location ||
        p.location.toLowerCase().includes(activeFilters.location.toLowerCase());

      const matchesType =
        !activeFilters.propertyType ||
        p.type.toLowerCase() === activeFilters.propertyType.toLowerCase();

      let matchesPrice = true;
      if (activeFilters.priceRange && activeFilters.priceRange !== "2000+") {
        const parts = activeFilters.priceRange.split("-").map((s) => s.trim());
        const price = parseInt(p.price);
        if (parts[0]) matchesPrice = price >= parseInt(parts[0]);
        if (parts[1]) matchesPrice = matchesPrice && price <= parseInt(parts[1]);
      } else if (activeFilters.priceRange === "2000+") {
        matchesPrice = parseInt(p.price) > 2000;
      }

      const matchesRooms =
        !activeFilters.rooms || p.rooms === parseInt(activeFilters.rooms);

      const matchesFacilities =
        activeFilters.facilities.length === 0 ||
        activeFilters.facilities.every((f) => p.amenities.includes(f));

      return matchesLocation && matchesType && matchesPrice && matchesRooms && matchesFacilities;
    });
  }, [textFilteredResults, activeFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, textFilteredResults]);

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
          setHasSearched(true);
        }}
        onSubmit={handleSubmit}
      />

      <FiltersRow
        filters={displayValues}
        onFilterChange={handleFilterChange}
        dynamicOptions={dynamicOptions}
      />

      {hasSearched && (
        <div className="results-section">
          <h5 className="results-label">RESULTS</h5>

          {results.length === 0 ? (
            <div className="no-results text-center py-5">
              <p className="text-muted">No properties found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="d-flex flex-wrap justify-content-start gap-5">
                {currentProperties.map((property) => (
                  <div key={property.id} style={{ width: "270px", flexShrink: 0 }}>
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                label={`${results.length} of ${allProperties.length}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResult;