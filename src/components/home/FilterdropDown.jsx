import { useState, useRef, useEffect } from "react";
import dropdownIcon from "../../assets/home/dropdown.png";

function FilterDropdown({ icon, label, options = [] }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (option) => {
    setSelectedValue(option);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        className={`filter-dropdown d-flex align-items-center justify-content-between ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className="left d-flex align-items-center">
          <img src={icon} alt={label} className="filter-icon object-fit-contain" />
          <span className="filter-label">{selectedValue || label}</span>
        </div>
        <img
          src={dropdownIcon}
          className={`dropdown-arrow object-fit-contain ${open ? "rotate" : ""}`}
          alt="arrow"
        />
      </button>
      {open && (
        <div className="dropdown-menu overflow-auto">
          {options.map((option, index) => (
            <div key={index} className="dropdown-item" onClick={() => handleSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default  FilterDropdown