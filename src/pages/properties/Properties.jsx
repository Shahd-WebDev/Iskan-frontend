import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/PropertyCard";
import { allProperties } from "../../components/data/PropertiesData";
import PaginationControls from "../../components/Pagination/Pagination";
import { useState, useMemo, useCallback } from "react";
import { applyFilters, hasAnyFilter, EMPTY_FILTERS, PRICE_BUCKETS } from "../../components/Search/FilterSearch";
import "./Properties.css";

export default function Properties() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);

  const itemsPerPage = 16;

  const dynamicOptions = useMemo(() => {
    if (!hasAnyFilter(activeFilters)) {
      return {
        locations:  [...new Set(allProperties.map((p) => p.location.split(",")[0].trim()))].sort(),
        types:      [...new Set(allProperties.map((p) => p.type))].sort(),
        prices:     PRICE_BUCKETS.map((b) => b.label),
        rooms:      [...new Set(allProperties.map((p) => String(p.rooms)))].sort((a, b) => a - b),
        facilities: [...new Set(allProperties.flatMap((p) => p.amenities))].sort(),
      };
    }
    const without = (key) => applyFilters(allProperties, { ...activeFilters, [key]: key === "facilities" ? [] : "" });
    return {
      locations:  [...new Set(without("location").map((p) => p.location.split(",")[0].trim()))].sort(),
      types:      [...new Set(without("propertyType").map((p) => p.type))].sort(),
      prices:     PRICE_BUCKETS.filter(({ min, max }) =>
                    without("priceRange").some((p) => { const pr = parseInt(p.price); return pr >= min && pr <= max; })
                  ).map((b) => b.label),
      rooms:      [...new Set(without("rooms").map((p) => String(p.rooms)))].sort((a, b) => a - b),
      facilities: [...new Set(without("facilities").flatMap((p) => p.amenities))].sort(),
    };
  }, [activeFilters]);

  const filteredProperties = useMemo(() =>
    applyFilters(allProperties, activeFilters),
  [activeFilters]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = useCallback((key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  return (
    <div className="properties-page">

      <div className="properties-top search-wrapper">
        <SearchBar />
        <FiltersRow
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          dynamicOptions={dynamicOptions}
        />
      </div>

      <div className="properties-grid">
<div className="d-flex flex-wrap justify-content-center gap-4">
            {currentProperties.map((property) => (
            <div key={property.id} style={{ width: "270px" }}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      <div className="properties-pagination-wrapper">
        <div className="properties-pagination">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label={`${startIndex + 1} of ${filteredProperties.length}`}
          />
        </div>
      </div>

    </div>
  );
}