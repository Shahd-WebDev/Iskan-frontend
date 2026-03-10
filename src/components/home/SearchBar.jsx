import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchBar({ value, onChange, onSubmit }) {
  const navigate = useNavigate();
  const [localText, setLocalText] = useState("");

  const isControlled = value !== undefined && onChange !== undefined;
  const inputValue = isControlled ? value : localText;

  const handleChange = (e) => {
    if (isControlled) onChange(e);
    else setLocalText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isControlled) {
      
      onSubmit?.(e);
    } else {
      
      navigate(`/search?q=${encodeURIComponent(localText.trim())}`);
    }
  };

  return (
    <form className="search-bar position-relative d-flex" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search For A Property"
        className="search-input border-0"
        value={inputValue}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="search-btn d-flex justify-content-center align-items-center position-absolute"
      >
        <Search size={14} />
        Find Property
      </button>
    </form>
  );
}

export default SearchBar;
