import { ArrowLeft, ArrowRight } from "lucide-react";

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  label,
}) {
  return (
    <div className="pagination-wrapper">

      <div className="pagination-inner">
        {/* Left text */}
        <span className="pagination-info">
          {label}
        </span>

        {/* Arrows */}
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={18} />
          </button>

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default PaginationControls;