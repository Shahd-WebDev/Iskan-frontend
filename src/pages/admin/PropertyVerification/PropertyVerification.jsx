import "./propertyVerification.css";

import AdminPropertyCard from "../../../components/admin/PropertyCard/AdminPropertyCard";
import SearchBar from "../../../components/home/SearchBar";
import PaginationControls from "../../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { getPendingProperties } from "../../../services/adminProperties";


export default function PropertyVerification() {
   const [properties, setProperties] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(true);


  const itemsPerPage = 9; // 3 × 3

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const data = await getPendingProperties(currentPage, itemsPerPage);

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
}, [currentPage]);


  
  return (
    <div className="property-verification">

      {/* search */}
      <div className="top-bar">
        <SearchBar />
      </div>

      {/* grid */}
      <div className="verification-grid">
{loading
  ? "Loading..."
  : properties.map((item) => (
             <AdminPropertyCard
  key={item.id}
  property={item}
  isVerification={true}
/>

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