import toast from "react-hot-toast";
import SkeletonCard from "../../../components/common/SkeletonCard";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropertyHeader from "../../../components/PropertiesDetails/PropertyHeader";
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

  const [mainImage, setMainImage] = useState(null);
const [activeThumb, setActiveThumb] = useState(0);

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

useEffect(() => {
  if (property?.images?.length > 0) {
    setMainImage(
      `https://isskan-1.runasp.net${property.images[0].imageUrl}`
    );
  }
}, [property]);
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
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

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


const thumbnails =
  property?.images?.map((img, i) => ({
    src: `https://isskan-1.runasp.net${img.imageUrl}`,
    label: `Image ${i + 1}`,
    status: img.isMain ? "verified" : null,
  })) || [];
  

    console.log("IMAGES", property.images);
    const propertyTypeMap = {
  0: "Room",
  1: "Apartment",
  2: "Studio",
};

const propertyType =
  propertyTypeMap[Number(property.propertyType)] ||
  property.propertyType;
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


      
<div className="ai-card">
  <div className="ai-card-header">
    <h3 className="ai-card-title">Property Images</h3>
  </div>

  <div className="main-image-wrapper">
  {showMap ? (
    <iframe
      title="Property Location"
      src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
      width="100%"
      height="100%"
      style={{
        border: 0,
        borderRadius: "16px",
      }}
      loading="lazy"
    />
  ) : mainImage ? (
    <img
      src={mainImage}
      className="main-image"
      alt="Main Property"
    />
  ) : (
    <div className="no-property-images">
      <h3>📷 No Images Uploaded</h3>
      <p>
        The owner has not uploaded any property images.
      </p>
    </div>
  )}
</div>

  {thumbnails.length > 0 && (
  <div className="thumbnail-strip">
    <div className="thumbnail-row">
      {thumbnails.map((thumb, i) => (
        <button
          key={i}
          className={`thumb-wrapper${
            activeThumb === i ? " thumb-wrapper--active" : ""
          }`}
          onClick={() => {
            setMainImage(thumb.src);
            setActiveThumb(i);
          }}
        >
          <img
            src={thumb.src}
            className="thumbnail-img"
            alt={thumb.label}
          />
        </button>
      ))}
    </div>
  </div>
)}
</div>
<div className="verification-summary">

  <div className="verification-header">
    <div className="verification-icon">🛡️</div>

    <div>
      <h3>Verification Information</h3>
      <p>
        Property and owner details for verification
      </p>
    </div>
  </div>

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
      <p>{propertyType}</p>
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
        {new Date(property.createdAt).toLocaleDateString()}
      </p>
    </div>

  </div>

</div>
<KeyFeatures facilities={property.facilities} />

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