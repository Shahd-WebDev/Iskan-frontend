import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import abstractDesign from "../../assets/home/Abstract Design.png";
import FAQCard from "../home/FAQCard";
import PaginationControls from "../../components/Pagination/Pagination";

const ITEMS_PER_PAGE = 3;
const TOTAL_PAGES = 10;

function FAQSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/FAQ/GetFAQs/items")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFaqs(data.data.slice(0, 10));
        }
      })
      .catch((err) => console.error("Failed to fetch FAQs:", err));
  }, []);

  const currentFaqs = faqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="faq-section">
      <div className="section-header d-flex justify-content-between align-items-start">
        <div>
          <div className="section-badge">
            <img src={abstractDesign} alt="Abstract Design" />
          </div>
          <h2 className="section-title text-black">Frequently Asked Questions</h2>
          <p className="section-description">
            Find answers to common questions about Iskan's services, property
            listings, and the real estate process. We're here to provide clarity
            and assist you every step of the way.
          </p>
        </div>
        <button className="view-all-Faq mt-auto"  onClick={() => navigate("/faqs")} >View All FAQ's</button>
      </div>

      <div className="row g-3 mb-4">
        {currentFaqs.map((faq) => (
          <div key={faq.id} className="col-12 col-md-6 col-lg-4" style={{ maxWidth: "33.333%" }}> {/* هنا */}
            <FAQCard faq={faq} />
          </div>
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
        label={`${Math.min(currentPage * ITEMS_PER_PAGE, faqs.length)} of ${faqs.length}`}
      />
    </section>
  );
}

export default FAQSection;




