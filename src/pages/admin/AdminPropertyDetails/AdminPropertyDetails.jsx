import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropertyHeader from "../../../components/PropertiesDetails/PropertyHeader";
import ImageGallery from "../../../components/PropertiesDetails/PropertyGallery";
import PropertyDescription from "../../../components/PropertiesDetails/Propertydescription";
import "../../property-details/PropertyDetails.css";
import KeyFeatures from "../../../components/PropertiesDetails/KeyFeatures";
import "./AdminPropertyDetails.css";
import {
  getPropertyById,
  approveProperty,
  rejectProperty,
} from "../../../services/adminProperties";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ======================
  // STATES
  // ======================

  // يبدأ بدون حالة


  const [showMap, setShowMap] = useState(false);
  const [property, setProperty] = useState(null);
const [loading, setLoading] = useState(true);
const [showRejectModal, setShowRejectModal] =
  useState(false);

const [rejectReason, setRejectReason] =
  useState("");
useEffect(() => {
  async function fetchProperty() {
    try {
      setLoading(true);

      const data = await getPropertyById(id);

      setProperty(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  fetchProperty();
}, [id]);

const handleApprove = async () => {
  try {
    await approveProperty(property.id);

    setProperty((prev) => ({
      ...prev,
      verificationStatus: "Approved",
    }));

toast.success("Property approved successfully");

  } catch (error) {

    if (error.response?.status === 500) {
      setProperty((prev) => ({
        ...prev,
        verificationStatus: "Approved",
      }));

toast.success("Property approved successfully");
    } else {
  toast.error("Failed to approve property");
}

    console.log(error);
  }
};

const handleReject = async () => {
  try {
if (!rejectReason.trim()) {
toast.error("Please enter rejection reason");
  return;
}
    

    await rejectProperty(
      property.id,
      rejectReason
    );

    setProperty((prev) => ({
      ...prev,
      verificationStatus: "Rejected",
    }));
    setShowRejectModal(false);
setRejectReason("");

toast.success("Property rejected successfully");
  } catch (error) {

    if (error.response?.status === 500) {

      setProperty((prev) => ({
        ...prev,
        verificationStatus: "Rejected",
      }));
setShowRejectModal(false);
setRejectReason("");
toast.success("Property rejected successfully");
    } else {
toast.error("Failed to reject property");
    }

    console.log(error);
  }
};



  // ======================
  // NOT FOUND
  // ======================
  if (loading) {
  return <p>Loading...</p>;
}

  if (!property) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Property not found</h2>

        <button
          onClick={() => navigate("/properties")}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: "#0088FF",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Back to Properties
        </button>
      </div>
    );
  }

const galleryImages =
  property?.images?.length > 0
    ? property.images.map(
        (img) =>
          img.imageUrl
            ? `https://isskan-1.runasp.net${img.imageUrl}`
            : "/img.webp"
      )
    : ["/img.webp"];

  
  
  // ======================
  // UI
  // ======================
  return (
    <>
      <div className="pd-page">
<PropertyHeader
  property={property}
onLocationClick={() => setShowMap(prev => !prev)}
  showMap={showMap}
/>


      
<ImageGallery
  images={galleryImages}
  showMap={showMap}
  setShowMap={setShowMap}
  lat={property.latitude}
lng={property.longitude}
/>


        <div className="pd-mid-section align-items-start">
          <div className="pd-left-col">
            

            <PropertyDescription property={property} />
          </div>

          <div className="pd-right-col">
<KeyFeatures
  features={
    property.facilities?.map(
      (item) => item.facilityName
    ) || []
  }
/>      </div>
        </div>
{property.verificationStatus === "Pending" && (
  <div className="admin-actions">
      <button
    className="approve-btn"
    onClick={handleApprove}
  >
    Approve
  </button>

  <button
    className="reject-btn"
onClick={() => setShowRejectModal(true)}
  >
    Reject
  </button>
</div>
)}

    {showRejectModal && (
  <div className="reject-modal-overlay">

    <div className="reject-modal">

      <h3>Reject Property</h3>

      <textarea
        placeholder="Write rejection reason..."
        value={rejectReason}
        onChange={(e) =>
          setRejectReason(e.target.value)
        }
      />

      <div className="reject-modal-actions">

        <button
          className="cancel-btn"
          onClick={() => {
            setShowRejectModal(false);
            setRejectReason("");
          }}
        >
          Cancel
        </button>

        <button
          className="confirm-reject-btn"
          onClick={handleReject}
        >
          Confirm Reject
        </button>

      </div>
    </div>
  </div>
)}    

      </div>

      
      
    </>
  );
}