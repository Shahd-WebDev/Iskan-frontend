import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  label,
}) {

  const [pageInput, setPageInput] =
    useState("");

  const handleJump = () => {

    const page = Number(pageInput);

    if (
      page >= 1 &&
      page <= totalPages
    ) {
      onPageChange(page);
      setPageInput("");
    }
  };

  return (
    <div className="pagination-wrapper">

      <div className="pagination-inner">

        <span className="pagination-info">
          {label}
        </span>

        <div className="pagination-controls">

          <button
            className="pagination-btn"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            <ArrowLeft size={18} />
          </button>

          <button
            className="pagination-btn"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
          >
            <ArrowRight size={18} />
          </button>

          {/* NEW */}
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            placeholder="Page"
            className="pagination-input"
            onChange={(e) =>
              setPageInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleJump();
              }
            }}
          />

          <button
            className="pagination-go-btn"
            onClick={handleJump}
          >
            Go
          </button>

        </div>

      </div>

    </div>
  );
}

export default PaginationControls;