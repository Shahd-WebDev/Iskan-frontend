import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="search-bar position-relative d-flex">
      <input
        type="text"
        placeholder="Search For A Property"
        className="search-input border-0"
      />
      <button className="search-btn d-flex justify-content-center align-items-center position-absolute" >
        <Search size={14} />
        Find Property
      </button>
    </div>
  );
}
export default  SearchBar