import FilterDropdown from "../home/FilterdropDown";
import locationIcon from "../../assets/home/location.png";
import propertyIcon from "../../assets/home/property.png";
import pricingIcon from "../../assets/home/pricing.png";
import roomsIcon from "../../assets/home/n.roums.png";
import facilitiesIcon from "../../assets/home/facilities.png";

function FiltersRow() {
  return (
    <div className="filters-row position-relative">
      <div className="dropdown-container position-relative">
        <FilterDropdown icon={locationIcon}   label="Location"            options={[]} />
      </div>
      <div className="dropdown-container position-relative">
        <FilterDropdown icon={propertyIcon}   label="Property Type"       options={[]} />
      </div>
      <div className="dropdown-container position-relative">
        <FilterDropdown icon={pricingIcon}    label="Pricing Range"       options={[]} />
      </div>
      <div className="dropdown-container position-relative">
        <FilterDropdown icon={roomsIcon}      label="No. of Rooms / Beds" options={[]} />
      </div>
      <div className="dropdown-container position-relative">
        <FilterDropdown icon={facilitiesIcon} label="Facilities"          options={[]} />
      </div>
    </div>
  );
}
export default  FiltersRow