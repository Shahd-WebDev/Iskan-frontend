import toast from "react-hot-toast";
import SkeletonCard from "../../../components/common/SkeletonCard";
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
  return (
    <div className="pd-page">
      <div className="listings-grid">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    </div>
  );
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
console.log(property.facilities);
console.log(property);

const galleryImages =
  property?.images?.length > 0
    ? property.images.map(
        (img) =>
          `https://isskan-1.runasp.net${img.imageUrl}`
      )
    : [];

    console.log("IMAGES", property.images);
console.log("COUNT", property.images?.length);
  
  
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


      
{galleryImages.length > 0 ? (
  <ImageGallery
    images={galleryImages}
    showMap={showMap}
    setShowMap={setShowMap}
    lat={property.latitude}
    lng={property.longitude}
  />
) : (
  <div className="no-images-card">
    <img
      src="/no-image.png"
      alt="No Images"
      className="no-images-img"
    />

    <p>No property images uploaded</p>
  </div>
)}
<div className="verification-summary">
  <h3>Verification Information</h3>

<div className="verification-info-grid">
    <div className="verification-item">
      <span>Owner Name</span>
      <p>{property.ownerName}</p>
    </div>

    <div className="verification-item">
      <span>Owner Email</span>
      <p>{property.ownerEmail}</p>
    </div>

    <div className="verification-item">
      <span>Property Type</span>
      <p>{property.propertyType}</p>
    </div>

    <div className="verification-item">
      <span>Status</span>
     <span
  className={`status-badge ${property.verificationStatus.toLowerCase()}`}
>
  {property.verificationStatus}
</span>
    </div>

    <div className="verification-item">
      <span>Rooms</span>
      <p>{property.roomsNumber}</p>
    </div>

    <div className="verification-item">
      <span>Bathrooms</span>
      <p>{property.bathroomsNumber}</p>
    </div>

    <div className="verification-item">
      <span>Monthly Price</span>
      <p>{property.pricePerMonth} EGP</p>
    </div>

    <div className="verification-item">
      <span>Created At</span>
      <p>
        {new Date(
          property.createdAt
        ).toLocaleDateString()}
      </p>
    </div>

  </div>
</div>

        <div className="pd-mid-section align-items-start">
          

          <div className="pd-right-col">

{property.documents?.length === 0 && (
  <div className="verification-warning">
    <h4>No Documents Uploaded</h4>
    <p>
      The owner did not upload any verification
      documents for this property.
    </p>
  </div>
)}

{property.documents?.length > 0 && (
  <div className="documents-section">

    <h3>Uploaded Documents</h3>

    {property.documents.map((doc) => (
      <div
        key={doc.id}
        className="document-card"
      >
        <div>
          <h4>{doc.fileName}</h4>

          <p>{doc.documentType}</p>
        </div>

        <a
          href={`https://isskan-1.runasp.net${doc.documentUrl}`}
          target="_blank"
          rel="noreferrer"
          className="view-document-btn"
        >
          View
        </a>
      </div>
    ))}
  </div>
)}
     </div>
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