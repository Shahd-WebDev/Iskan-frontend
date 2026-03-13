// import FilterDropdown from "../home/FilterdropDown"; 
// import locationIcon   from "../../assets/home/location.png";
// import propertyIcon   from "../../assets/home/property.png";
// import pricingIcon    from "../../assets/home/pricing.png";
// import roomsIcon      from "../../assets/home/n.roums.png";
// import facilitiesIcon from "../../assets/home/facilities.png";

// const PRICE_OPTIONS = ["800 - 1000", "1000 - 1300", "1300 - 1600", "1600 - 2000", "2000+"];

// function FiltersRow({ onFilterChange, filters = {}, dynamicOptions = {} }) {
 
//   const locationOptions  = dynamicOptions.locations  || [];
//   const typeOptions      = dynamicOptions.types      || [];
//   const roomsOptions     = dynamicOptions.rooms      || [];
//   const facilityOptions  = dynamicOptions.facilities || [];

//   return (
//     <div className="filters-row position-relative">

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={locationIcon}
//           label="Location"
//           options={locationOptions}
//           value={filters.location || ""}
//           onChange={(val) => onFilterChange?.("location", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={propertyIcon}
//           label="Property Type"
//           options={typeOptions}
//           value={filters.propertyType || ""}
//           onChange={(val) => onFilterChange?.("propertyType", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={pricingIcon}
//           label="Pricing Range"
//           options={PRICE_OPTIONS}
//           value={filters.priceRange || ""}
//           onChange={(val) => onFilterChange?.("priceRange", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={roomsIcon}
//           label="No. of Rooms / Beds"
//           options={roomsOptions}
//           value={filters.rooms || ""}
//           onChange={(val) => onFilterChange?.("rooms", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={facilitiesIcon}
//           label="Facilities"
//           options={facilityOptions}
//           value={filters.facilities || []}
//           onChange={(val) => onFilterChange?.("facilities", val ? [val] : [])}
//         />
//       </div>

//     </div>
//   );
// }

// export default FiltersRow;

// import FilterDropdown from "../home/FilterdropDown";
// import locationIcon   from "../../assets/home/location.png";
// import propertyIcon   from "../../assets/home/property.png";
// import pricingIcon    from "../../assets/home/pricing.png";
// import roomsIcon      from "../../assets/home/n.roums.png";
// import facilitiesIcon from "../../assets/home/facilities.png";

// const PRICE_OPTIONS = ["800 - 1000", "1000 - 1300", "1300 - 1600", "1600 - 2000", "2000+"];

// function FiltersRow({ onFilterChange, filters = {}, dynamicOptions = {} }) {
//   const locationOptions = dynamicOptions.locations  || [];
//   const typeOptions     = dynamicOptions.types      || [];
//   const roomsOptions    = dynamicOptions.rooms      || [];
//   const facilityOptions = dynamicOptions.facilities || [];

//   return (
//     <div className="filters-row position-relative">

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={locationIcon}
//           label="Location"
//           options={locationOptions}
//           value={filters.location || ""}
//           onChange={(val) => onFilterChange?.("location", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={propertyIcon}
//           label="Property Type"
//           options={typeOptions}
//           value={filters.propertyType || ""}
//           onChange={(val) => onFilterChange?.("propertyType", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={pricingIcon}
//           label="Pricing Range"
//           options={PRICE_OPTIONS}
//           value={filters.priceRange || ""}
//           onChange={(val) => onFilterChange?.("priceRange", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={roomsIcon}
//           label="No. of Rooms / Beds"
//           options={roomsOptions}
//           value={filters.rooms || ""}
//           onChange={(val) => onFilterChange?.("rooms", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={facilitiesIcon}
//           label="Facilities"
//           options={facilityOptions}
//           value={filters.facilities || []}
//           onChange={(val) => onFilterChange?.("facilities", val ? [val] : [])}
//         />
//       </div>

//     </div>
//   );
// }

// export default FiltersRow;

// import FilterDropdown from "../home/FilterdropDown";
// import locationIcon   from "../../assets/home/location.png";
// import propertyIcon   from "../../assets/home/property.png";
// import pricingIcon    from "../../assets/home/pricing.png";
// import roomsIcon      from "../../assets/home/n.roums.png";
// import facilitiesIcon from "../../assets/home/facilities.png";

// function FiltersRow({ onFilterChange, filters = {}, dynamicOptions = {} }) {
//   const locationOptions = dynamicOptions.locations || [];
//   const typeOptions     = dynamicOptions.types     || [];
//   const priceOptions    = dynamicOptions.prices    || [];
//   const roomsOptions    = dynamicOptions.rooms     || [];
//   const facilityOptions = dynamicOptions.facilities|| [];

//   return (
//     <div className="filters-row position-relative">

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={locationIcon}
//           label="Location"
//           options={locationOptions}
//           value={filters.location || ""}
//           onChange={(val) => onFilterChange?.("location", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={propertyIcon}
//           label="Property Type"
//           options={typeOptions}
//           value={filters.propertyType || ""}
//           onChange={(val) => onFilterChange?.("propertyType", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={pricingIcon}
//           label="Pricing Range"
//           options={priceOptions}
//           value={filters.priceRange || ""}
//           onChange={(val) => onFilterChange?.("priceRange", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={roomsIcon}
//           label="No. of Rooms / Beds"
//           options={roomsOptions}
//           value={filters.rooms || ""}
//           onChange={(val) => onFilterChange?.("rooms", val)}
//         />
//       </div>

//       <div className="dropdown-container position-relative">
//         <FilterDropdown
//           icon={facilitiesIcon}
//           label="Facilities"
//           options={facilityOptions}
//           value={filters.facilities || []}
//           onChange={(val) => onFilterChange?.("facilities", val ? [val] : [])}
//         />
//       </div>

//     </div>
//   );
// }

// export default FiltersRow;


import FilterDropdown from "../home/FilterdropDown";
import locationIcon   from "../../assets/home/location.png";
import propertyIcon   from "../../assets/home/property.png";
import pricingIcon    from "../../assets/home/pricing.png";
import roomsIcon      from "../../assets/home/n.roums.png";
import facilitiesIcon from "../../assets/home/facilities.png";

function FiltersRow({ onFilterChange, filters = {}, dynamicOptions = {} }) {
  const locationOptions = dynamicOptions.locations || [];
  const typeOptions     = dynamicOptions.types     || [];
  const priceOptions    = dynamicOptions.prices    || [];
  const roomsOptions    = dynamicOptions.rooms     || [];
  const facilityOptions = dynamicOptions.facilities|| [];

  return (
    <div className="filters-row position-relative">

      <div className="dropdown-container position-relative">
        <FilterDropdown
          icon={locationIcon}
          label="Location"
          options={locationOptions}
          value={filters.location || ""}
          onChange={(val) => onFilterChange?.("location", val)}
        />
      </div>

      <div className="dropdown-container position-relative">
        <FilterDropdown
          icon={propertyIcon}
          label="Property Type"
          options={typeOptions}
          value={filters.propertyType || ""}
          onChange={(val) => onFilterChange?.("propertyType", val)}
        />
      </div>

      <div className="dropdown-container position-relative">
        <FilterDropdown
          icon={pricingIcon}
          label="Pricing Range"
          options={priceOptions}
          value={filters.priceRange || ""}
          onChange={(val) => onFilterChange?.("priceRange", val)}
        />
      </div>

      <div className="dropdown-container position-relative">
        <FilterDropdown
          icon={roomsIcon}
          label="No. of Rooms / Beds"
          options={roomsOptions}
          value={filters.rooms || ""}
          onChange={(val) => onFilterChange?.("rooms", val)}
        />
      </div>

      <div className="dropdown-container position-relative">
        <FilterDropdown
          icon={facilitiesIcon}
          label="Facilities"
          options={facilityOptions}
          value={filters.facilities || []}
          onChange={(val) => onFilterChange?.("facilities", val)}
        />
      </div>

    </div>
  );
}

export default FiltersRow;