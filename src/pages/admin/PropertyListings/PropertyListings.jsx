import SkeletonCard from "../../../components/common/SkeletonCard";
import "./propertyListings.css";

import { useEffect, useState } from "react";
import { getPendingProperties } from "../../../services/adminProperties";

import AdminPropertyCard from "../../../components/admin/PropertyCard/AdminPropertyCard";
import SearchBar from "../../../components/home/SearchBar";
import PaginationControls from "../../../components/Pagination/Pagination";

export default function PropertyListings() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const data = await getPendingProperties(currentPage, 9);

        console.log("DATA:", data);

        setProperties(data.data || []);
        setTotalPages(Math.ceil(data.count / data.pageSize));

      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage]); // 👈 ده المهم

  return (
    <div className="property-listings">

      {/* search */}
      <div className="top-bar">
        <SearchBar />
      </div>

      {/* grid */}
      <div className="listings-grid">
        {loading
          ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : properties.map((item) => (
<AdminPropertyCard key={item.id} property={item} />
            ))}
      </div>

      {/* pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        label={`Page ${currentPage}`}
      />

    </div>
  );
}