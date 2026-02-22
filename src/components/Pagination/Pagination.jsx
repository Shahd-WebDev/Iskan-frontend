
import { ArrowLeft, ArrowRight } from "lucide-react";

function PaginationControls({ currentPage, totalPages, onPageChange, label }) {
  return (
    <div className="pagination d-flex justify-content-between align-items-center">
      <span className="pagination-info text-black">
        {label}
      </span>
      <div className="pagination-controls d-flex align-items-center gap-2">
        <button
          className="pagination-btn rounded-circle d-flex align-items-center justify-content-center text-black"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          className="pagination-btn rounded-circle d-flex align-items-center justify-content-center text-black"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;