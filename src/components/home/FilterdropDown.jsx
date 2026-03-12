// import { useState, useRef, useEffect } from "react";
// import dropdownIcon from "../../assets/home/dropDown.png";

// function FilterDropdown({ icon, label, options = [], value = "", onChange }) {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     if (open) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   const handleSelect = (option) => {
//     const newVal = option === value ? "" : option;
//     onChange?.(newVal);
//     setOpen(false);
//   };

//   const isArray  = Array.isArray(value);
//   const hasValue = isArray ? value.length > 0 : !!value;

//   const renderDisplayValue = () => {
//     if (!hasValue) return <span className="filter-label">{label}</span>;

//     if (isArray) {
//       return (
//         <div
//           className="d-flex align-items-center gap-1"
//           style={{
//             overflowX: "auto",
//             flexWrap: "nowrap",
//             maxWidth: "150px",
//             scrollbarWidth: "none",
//           }}
//         >
//           {value.map((v) => (
//             <span key={v} className="facility-badge" style={{ flexShrink: 0 }}>
//               {v}
//             </span>
//           ))}
//         </div>
//       );
//     }

//     return <span className="filter-label">{value}</span>;
//   };

//   return (
//     <div ref={dropdownRef} style={{ position: "relative" }}>
//       <button
//         className={`filter-dropdown d-flex align-items-center justify-content-between ${open ? "active" : ""} ${hasValue ? "has-value" : ""}`}
//         onClick={() => setOpen(!open)}
//         type="button"
//       >
//         <div className="left d-flex align-items-center gap-2" style={{ overflow: "hidden", minWidth: 0 }}>
//           <img src={icon} alt={label} className="filter-icon object-fit-contain" />
//           {renderDisplayValue()}
//         </div>
//         <img
//           src={dropdownIcon}
//           className={`dropdown-arrow object-fit-contain ${open || hasValue ? "rotate" : ""}`}
//           alt="arrow"
//         />
//       </button>

//       {open && (
//         <div className="dropdown-menu overflow-auto">
//           {options.map((option, index) => {
//             const isSelected = isArray ? value.includes(option) : option === value;
//             return (
//               <div
//                 key={index}
//                 className={`dropdown-item ${isSelected ? "selected" : ""}`}
//                 onClick={() => handleSelect(option)}
//               >
//                 {option}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FilterDropdown;

// import { useState, useRef, useEffect } from "react";
// import dropdownIcon from "../../assets/home/dropDown.png";

// function FilterDropdown({ icon, label, options = [], value = "", onChange }) {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Debug: log options when dropdown opens
//   useEffect(() => {
//     if (open) {
//       console.log(`[FilterDropdown: ${label}] options =>`, options);
//     }
//   }, [open, options, label]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     if (open) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [open]);

//   const handleSelect = (option) => {
//     const newVal = option === value ? "" : option;
//     onChange?.(newVal);
//     setOpen(false);
//   };

//   const isArray  = Array.isArray(value);
//   const hasValue = isArray ? value.length > 0 : !!value;

//   const renderDisplayValue = () => {
//     if (!hasValue) return <span className="filter-label">{label}</span>;

//     if (isArray) {
//       return (
//         <div
//           className="d-flex align-items-center gap-1"
//           style={{ overflowX: "auto", flexWrap: "nowrap", maxWidth: "150px", scrollbarWidth: "none" }}
//         >
//           {value.map((v) => (
//             <span key={v} className="facility-badge" style={{ flexShrink: 0 }}>{v}</span>
//           ))}
//         </div>
//       );
//     }

//     return <span className="filter-label">{value}</span>;
//   };

//   return (
//     <div ref={dropdownRef} style={{ position: "relative" }}>
//       <button
//         className={`filter-dropdown d-flex align-items-center justify-content-between ${open ? "active" : ""} ${hasValue ? "has-value" : ""}`}
//         onClick={() => setOpen(!open)}
//         type="button"
//       >
//         <div className="left d-flex align-items-center gap-2" style={{ overflow: "hidden", minWidth: 0 }}>
//           <img src={icon} alt={label} className="filter-icon object-fit-contain" />
//           {renderDisplayValue()}
//         </div>
//         <img
//           src={dropdownIcon}
//           className={`dropdown-arrow object-fit-contain ${open || hasValue ? "rotate" : ""}`}
//           alt="arrow"
//         />
//       </button>

//       {open && (
//         <div className="dropdown-menu overflow-auto" style={{ display: "block" }}>
//           {options.length === 0 ? (
//             <div className="dropdown-item text-muted" style={{ pointerEvents: "none", fontStyle: "italic" }}>
//               No options available
//             </div>
//           ) : (
//             options.map((option, index) => {
//               const isSelected = isArray ? value.includes(option) : option === value;
//               return (
//                 <div
//                   key={index}
//                   className={`dropdown-item ${isSelected ? "selected" : ""}`}
//                   onClick={() => handleSelect(option)}
//                 >
//                   {option}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default FilterDropdown;


import { useState, useRef, useEffect } from "react";
import dropdownIcon from "../../assets/home/dropDown.png";

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
      // Multi-select: toggle item in array, keep dropdown open
      const newVal = value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option];
      onChange?.(newVal);
      // don't close dropdown — let user pick more
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

    return <span className="filter-label">{value}</span>;
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        className={`filter-dropdown d-flex align-items-center justify-content-between ${open ? "active" : ""} ${hasValue ? "has-value" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className="left d-flex align-items-center gap-2" style={{ overflow: "hidden", minWidth: 0 }}>
          <img src={icon} alt={label} className="filter-icon object-fit-contain" />
          {renderDisplayValue()}
        </div>
        <img
          src={dropdownIcon}
          className={`dropdown-arrow object-fit-contain ${open || hasValue ? "rotate" : ""}`}
          alt="arrow"
        />
      </button>

      {open && (
        <div className="dropdown-menu overflow-auto" style={{ display: "block" }}>
          {options.length === 0 ? (
            <div className="dropdown-item text-muted" style={{ pointerEvents: "none", fontStyle: "italic" }}>
              No options available
            </div>
          ) : (
            options.map((option, index) => {
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
            })
          )}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;