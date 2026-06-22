import { Search } from "lucide-react";
import styles from "./Bookings.module.css";

const STATUSES = ["All", "Pending", "Confirmed", "Rejected", "Cancelled"];

export default function BookingFilters({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  bookingsCountMap,
}) {
  return (
    <div className={styles["filters-bar"]}>
      {/* Search Input */}
      <div className={styles["search-wrapper"]}>
        <Search size={16} className={styles["search-icon"]} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name, email, or property title..."
          className={styles["search-input"]}
        />
      </div>

      {/* Tabs */}
      <div className={styles["filters-tabs"]}>
        {STATUSES.map((status) => {
          const count = bookingsCountMap[status.toLowerCase()] ?? 0;
          const isActive = activeFilter.toLowerCase() === status.toLowerCase();
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`${styles["filter-tab"]} ${styles[`filter-tab--${status.toLowerCase()}`]} ${
                isActive ? styles["filter-tab--active"] : ""
              }`}
            >
              {status}
              <span className={styles["filter-count"]}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={styles["sort-select"]}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="move-in">Move-in date</option>
      </select>
    </div>
  );
}
