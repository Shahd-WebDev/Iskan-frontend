import { useState, useRef, useEffect } from "react";
import dropDown from "../../assets/home/dropdown.png";
function FilterDropdown({ icon, label, options = [], value = "", onChange }) {
  const [open, setOpen] = useState(false);
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

  const isArray  = Array.isArray(value);
  const hasValue = isArray ? value.length > 0 : !!value;

  const handleSelect = (option) => {
    if (isArray) {
      const newVal = value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option];
      onChange?.(newVal);
    } else {
      // Single select: toggle or clear, close dropdown
      onChange?.(option === value ? "" : option);
      setOpen(false);
    }
  };

  const renderDisplayValue = () => {
    if (!hasValue) return <span className="filter-label">{label}</span>;

    if (isArray) {
      return (
        <div
          className="d-flex align-items-center gap-1"
          style={{ overflowX: "auto", flexWrap: "nowrap", maxWidth: "150px", scrollbarWidth: "none" }}
        >
          {value.map((v) => (
            <span key={v} className="facility-badge" style={{ flexShrink: 0 }}>{v}</span>
          ))}
        </div>
      );
    }

   
    return (
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maxWidth: "120px",
        }}
        className="location-scroll"
      >
        <span className="filter-label">{value}</span>
      </div>
    );
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        className={`filter-dropdown d-flex align-items-center justify-content-between ${open ? "active" : ""} ${hasValue ? "has-value" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className="left d-flex align-items-center gap-2" style={{flex: 1,minWidth: 0, overflow: "hidden",}}>
          <img src={icon} alt={label} className="filter-icon object-fit-contain" />
          {renderDisplayValue()}
        </div>
        <img
          src={dropDown}
          className={`dropdown-arrow object-fit-contain ${open || hasValue ? "rotate" : ""}`}
          alt="arrow"
        />
      </button>

        {open && (
          <div className="dropdown-menu overflow-auto" style={{ display: "block" }}>
            {options.map((option, index) => {
              const isSelected = isArray ? value.includes(option) : option === value;
              return (
                <div
                  key={index}
                  className={`dropdown-item d-flex align-items-center gap-2 ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(option)}
                >
                  {isArray && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ pointerEvents: "none", accentColor: "var(--primary, #333)" }}
                    />
                  )}
                  {option}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

export default FilterDropdown;