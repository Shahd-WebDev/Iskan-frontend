import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/propertyCard";
import { allProperties } from "../../components/data/PropertiesData";
import PaginationControls from "../../components/Pagination/Pagination";
import { useState } from "react";

import "./Properties.css";

export default function Properties() {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  // بداية العناصر في الصفحة الحالية
  const startIndex = (currentPage - 1) * itemsPerPage;

  // العناصر المعروضة
  const currentProperties = allProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ رقم أول عنصر ظاهر (عشان يظهر 1 of 70)
  const currentItemNumber = startIndex + 1;

  const handleBookmarkChange = (isAdding) => {
    setBookmarkedCount((prev) =>
      isAdding ? prev + 1 : Math.max(0, prev - 1)
    );
  };

  return (
    <div className="properties-page">

      {/* Search + Filters */}
<div className="properties-top search-wrapper">
          <SearchBar />
        <FiltersRow />
      </div>

      {/* Grid */}
      <div className="properties-grid">
        <div className="row g-4">
          {currentProperties.map((property) => (
            <div
              key={property.id}
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
            >
              <PropertyCard
                property={property}
                onBookmarkChange={handleBookmarkChange}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="properties-pagination-wrapper">
        <div className="properties-pagination">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label={`${currentItemNumber} of ${allProperties.length}`}
          />
        </div>
      </div>

    </div>
  );
}