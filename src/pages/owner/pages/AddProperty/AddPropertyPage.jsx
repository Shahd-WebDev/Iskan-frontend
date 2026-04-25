import { useNavigate, useLocation } from "react-router-dom";
import AddPropertyModal from "../../features/add-property/AddPropertyModal";

/**
 * AddPropertyPage
 * 
 * A simple page wrapper that reuses the existing AddPropertyModal component.
 * It provides an onClose handler that navigates the user back to the previous page.
 */
const AddPropertyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the path to go back to and the property to edit from location state
  const from = location.state?.from || "/owner-dashboard/dashboard";
  const propertyToEdit = location.state?.propertyToEdit;

  const handleClose = () => {
    // Navigate back to the previous page when the form is closed or successfully submitted
    navigate(from);
  };

  return (
    <div className="add-property-page-container">
      <AddPropertyModal onClose={handleClose} propertyToEdit={propertyToEdit} />
    </div>
  );
};

export default AddPropertyPage;
