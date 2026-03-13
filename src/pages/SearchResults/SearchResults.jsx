import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { allProperties } from "../../components/data/PropertiesData";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PaginationControls from "../../components/Pagination/Pagination";
import { applyFilters, detectSearchIntent, hasAnyFilter, EMPTY_FILTERS, PRICE_BUCKETS } from "../../components/Search/FilterSearch";
import ResultsGrid from "../../components/Search/ResultsGrid";
import "./SearchResults.css";

function SearchResult() {
 
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // اقري الفلاتر من الـ URL لو جاية من الـ Home
  const initialFilters = useMemo(() => ({
    location:     searchParams.get("location")     || "",
    propertyType: searchParams.get("propertyType") || "",
    priceRange:   searchParams.get("priceRange")   || "",
    rooms:        searchParams.get("rooms")        || "",
    facilities:   searchParams.get("facilities") ? searchParams.get("facilities").split(",") : [],
  }), [searchParams]);  // ← حطيها في useMemo

  const hasInitialFilters = useMemo(() =>
    Object.values(initialFilters).some((v) => Array.isArray(v) ? v.length > 0 : !!v)
  , [initialFilters]);

  const [searchText, setSearchText]       = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery).filters : initialFilters
  );
  const [currentPage, setCurrentPage]     = useState(1);
  const [hasSearched, setHasSearched]     = useState(!!initialQuery);
  const [searchMatched, setSearchMatched] = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery).matched : false
  );
  const [titleResults, setTitleResults]   = useState(() =>
    initialQuery ? detectSearchIntent(initialQuery).titleResults || null : null
  );
  const [showResults, setShowResults]     = useState(!!initialQuery || hasInitialFilters);
  const ITEMS_PER_PAGE = 8;

 const results = useMemo(() => {
    if (!showResults) return [];
    if (searchText.trim() && !searchMatched && !hasInitialFilters) return [];
    const baseList = titleResults || allProperties;
    return applyFilters(baseList, activeFilters);
  }, [activeFilters, showResults, searchMatched, searchText, titleResults, hasInitialFilters]);

  const dynamicOptions = useMemo(() => {
  const baseList = titleResults || allProperties;

 
  if (!hasAnyFilter(activeFilters)) {
        return {
          locations:  [...new Set(baseList.map((p) => p.location.split(",")[0].trim()))].sort(),
          types:      [...new Set(baseList.map((p) => p.type))].sort(),
          prices:     PRICE_BUCKETS.map((b) => b.label),
          rooms:      [...new Set(baseList.map((p) => String(p.rooms)))].sort((a, b) => a - b),
          facilities: [...new Set(baseList.flatMap((p) => p.amenities))].sort(),
        };
      }

      const without = (key) => applyFilters(baseList, { ...activeFilters, [key]: key === "facilities" ? [] : "" });
      return {
        locations:  [...new Set(without("location").map((p) => p.location.split(",")[0].trim()))].sort(),
        types:      [...new Set(without("propertyType").map((p) => p.type))].sort(),
        prices:     PRICE_BUCKETS.filter(({ min, max }) =>
                      without("priceRange").some((p) => { const pr = parseInt(p.price); return pr >= min && pr <= max; })
                    ).map((b) => b.label),
        rooms:      [...new Set(without("rooms").map((p) => String(p.rooms)))].sort((a, b) => a - b),
        facilities: [...new Set(without("facilities").flatMap((p) => p.amenities))].sort(),
      };
    }, [activeFilters, titleResults]);

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
    const { filters, matched, titleResults: tr } = detectSearchIntent(searchText);
    setActiveFilters(filters);
    setHasSearched(true);
    setSearchMatched(matched);
    setTitleResults(tr || null);
    setShowResults(matched);
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

      {(hasSearched && !searchMatched) || showResults ? (
        <div className="results-section">
          <h5 className="results-label">RESULTS</h5>
          {(hasSearched && !searchMatched) || results.length === 0 ? (
            <div className="no-results text-center py-5">
              <p className="text-muted">No properties found matching your search.</p>
            </div>
          ) : (
            <>
              <ResultsGrid properties={currentProperties} />
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