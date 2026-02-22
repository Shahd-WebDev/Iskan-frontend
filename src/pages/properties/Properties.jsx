import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../../components/home/FiltersRow";
import PropertyCard from "../../components/home/propertyCard";
import { allProperties } from "../../components/data/PropertiesData";
import { useState } from "react";
import PaginationControls from "../../components/Pagination/Pagination";

export default function Properties() {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16; 
  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = allProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleBookmarkChange = (isAdding) => {
    setBookmarkedCount((prev) =>
      isAdding ? prev + 1 : Math.max(0, prev - 1)
    );
  };

  return (
   
    <>
      <div className="mt-5">
        <SearchBar />
        <FiltersRow />
      </div>

      <div className="row g-4  properties-section">
        {currentProperties.map((property) => (
          <div key={property.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <PropertyCard
              property={property}
              onBookmarkChange={handleBookmarkChange}
            />
          </div>
        ))}
      
              
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label={`${bookmarkedCount} of ${allProperties.length}`}
        />   
      </div>
    
    </>
  );
}
