import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";


function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar position-relative d-flex" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Search For A Property"
        className="search-input border-0"
        value={value}
        onChange={onChange}
      />

      <button type="submit" className="search-btn">
        Find Property
      </button>
    </form>
  );
}

export default SearchBar;
