import { useState, useRef, useEffect } from "react";
import abstractDesign from "../../assets/home/Abstract Design.png";
import PropertyCard from "../home/propertyCard";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../../components/Pagination/Pagination";
import { useAuth } from "../../context/AuthContext";

function PropertiesSection() {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const [totalCount, setTotalCount] = useState(0);
  const [facilities, setFacilities] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch properties و facilities 
        const [propertiesRes, facilitiesRes] = await Promise.all([
          fetch(`/api/Property/GetAll?pageSize=1000`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/Facility/GetAll`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);


        if (!propertiesRes.ok) throw new Error("Failed to fetch properties");
        if (!facilitiesRes.ok) throw new Error("Failed to fetch facilities");

        const propertiesData = await propertiesRes.json();
        const facilitiesData = await facilitiesRes.json();

        console.log(propertiesData.data?.[0]); 
        setProperties(propertiesData.data || []);
      
        setTotalCount(propertiesData.count || 0);
        setFacilities(facilitiesData.data || []);
        console.log("facilitiesData:", facilitiesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const itemsPerPage = 4;
  const totalPages = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = properties.slice(startIndex, startIndex + itemsPerPage);


  const handleBookmarkChange = (isAdding) => {
    setBookmarkedCount(prev => isAdding ? prev + 1 : Math.max(0, prev - 1));
  };

  const navigate = useNavigate();

  return (
    <section className="properties-section" ref={sectionRef}>
      <div className="section-header d-flex justify-content-between align-items-start">
        <div>
          <div className="section-badge">
            <img src={abstractDesign} alt="Abstract Design" />
          </div>
          <h2 className="section-title text-black">Discover a World of Possibilities</h2>
          <p className="section-description">
            Our portfolio of properties is as diverse as your dreams. Explore
            the following categories to find the perfect property that resonates
            with your vision of home.
          </p>
        </div>
        <button
          className="view-all-btn border-0 mt-auto text-white"
          onClick={() => navigate("/properties")}
        >
          View All Properties
        </button>
      </div>

      {loading && <p className="text-center">Loading properties...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="d-flex flex-wrap gap-3 mb-4 w-100">
            {currentProperties.map((property) => (
              <div key={property.id} style={{ width: "calc(25% - 12px)", flex: "0 0 auto" }}>
                <PropertyCard
                  property={property}
                  facilities={facilities}        
                  onBookmarkChange={handleBookmarkChange}
                />
              </div>
            ))}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            label={`${currentPage} of ${totalPages}`}
          />
        </>
      )}
    </section>
  );
}

export default PropertiesSection;