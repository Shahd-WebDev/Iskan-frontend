import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import AddPropertyModal from "../../features/add-property/AddPropertyModal";

/**
 * AddPropertyPage
 *
 * A simple page wrapper that reuses the existing AddPropertyModal component.
 * It provides an onClose handler that navigates the user back to the previous page.
 *
 * PERMISSION CHECK:
 * - Only Approved owners can add properties
 * - Pending/Rejected owners are redirected to dashboard
 */
const AddPropertyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationStatus } = useAuth();

  // Retrieve the path to go back to and the property to edit from location state
  const from = location.state?.from || "/owner-dashboard/dashboard";
  const propertyToEdit = location.state?.propertyToEdit;

  // Prevent Pending users from accessing add property page
  useEffect(() => {
    if (
      verificationStatus === "Pending" ||
      verificationStatus === "Rejected" ||
      verificationStatus === "NotSubmitted"
    ) {
      navigate("/owner-dashboard/properties");
    }
  }, [verificationStatus, navigate]);

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
