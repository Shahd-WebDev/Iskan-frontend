import { useState, useRef } from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
import abstractDesign from "../../assets/home/Abstract Design.png";
import { allProperties } from "../data/PropertiesData";
import PropertyCard from "../home/propertyCard";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../../components/Pagination/Pagination";


function PropertiesSection() {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef(null);

  const displayedProperties = allProperties.slice(0, 10);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(displayedProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = displayedProperties.slice(startIndex, startIndex + itemsPerPage);

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
          <button className="view-all-btn  border-0 mt-auto text-white" onClick={() => navigate("/properties")}>View All Properties</button>
        </div>

        <div className="row g-3 mb-4 w-100">
          {currentProperties.map((property) => (
            <div key={property.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <PropertyCard property={property} onBookmarkChange={handleBookmarkChange} />
            </div>
          ))}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label={`${bookmarkedCount} of ${displayedProperties.length}`}
        />
    </section>
  );
}

export default PropertiesSection