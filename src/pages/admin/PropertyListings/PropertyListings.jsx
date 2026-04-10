import "./propertyListings.css";

import PropertyCard from "../../../components/home/PropertyCard";
import SearchBar from "../../../components/home/SearchBar";
import PaginationControls from "../../../components/Pagination/Pagination";
import { allProperties } from "../../../components/data/PropertiesData";

import { useState } from "react";

export default function PropertyListings() {

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9; // 👈 3 rows × 3 columns

  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = allProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="property-listings">

      {/* search */}
      <div className="top-bar">
        <SearchBar />
      </div>

      {/* grid */}
      <div className="listings-grid">
        {currentData.map((item) => (
<PropertyCard key={item.id} property={item} isAdmin={true} />
        ))}
      </div>

      {/* pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        label={`${startIndex + 1} - ${
          Math.min(startIndex + itemsPerPage, allProperties.length)
        } of ${allProperties.length}`}
      />

    </div>
  );
}