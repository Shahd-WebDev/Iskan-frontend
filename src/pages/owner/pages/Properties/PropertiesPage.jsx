import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import {
  getOwnerProperties,
  getPropertyDetails,
  deleteProperty,
} from "../../../../services/ownerProperties";
import { getPropertyReviews } from "../../../../services/ownerReviews";
import { useAuth } from "../../../../context/AuthContext";
import VerificationBanner from "../../../../components/owner/VerificationBanner";
import { enrichPropertyWithVerificationData } from "../../../../utils/verificationUtils";
import styles from "./PropertiesPage.module.css";

export default function PropertiesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verificationStatus } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getOwnerProperties();
      // Since /Property/GetAll returns a paginated list { count, pageIndex, pageSize, data: [...] }
      // we extract the data array
      const items = result?.data || [];

      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          try {
            // Always fetch full details to get verification data
            const details = await getPropertyDetails(item.id);
            const enrichedProperty =
              enrichPropertyWithVerificationData(details);
            
            // Fetch property reviews
            let reviewsData = [];
            try {
              reviewsData = await getPropertyReviews(item.id);
            } catch (err) {
              console.warn("Failed to load reviews for property:", item.id, err);
            }

            const reviewsList = Array.isArray(reviewsData)
              ? reviewsData
              : reviewsData?.data || reviewsData?.reviews || [];

            const totalReviews = reviewsList.length;
            const avgRating = totalReviews > 0
              ? reviewsList.reduce((sum, r) => sum + Number(r.rating || r.stars || 0), 0) / totalReviews
              : 0;

            return {
              ...item,
              ...enrichedProperty,
              // Ensure verificationStatus is the primary status displayed
              status: enrichedProperty.verificationStatus,
              avgRating,
              totalReviews,
            };
          } catch (detailErr) {
            console.warn(
              "Failed to load property details for status enrichment:",
              item.id,
              detailErr,
            );
            // Return item with default reviews data
            return {
              ...item,
              avgRating: 0,
              totalReviews: 0,
            };
          }
        }),
      );

      setProperties(enrichedItems);
    } catch (err) {
      console.error("Failed to load owner properties:", err);
      setError("Failed to load property listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      setDeleting(true);
      await deleteProperty(propertyToDelete.id);
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  // Client-side filtering
  // Note: verificationStatus may not be present in the paginated list DTO from the API.
  // When absent, all properties pass the status filter so nothing is hidden unintentionally.
  const normalizePropertyStatus = (status) => {
    const raw = String(status || "")
      .trim()
      .toLowerCase();
    if (!raw) return "";
    if (raw === "verified") return "approved";
    if (raw === "approved") return "approved";
    if (raw === "pending") return "pending";
    if (raw === "rejected") return "rejected";
    return raw;
  };

  const filteredProperties = properties.filter((property) => {
    const title = property.title?.toLowerCase() || "";
    const matchesSearch = title.includes(searchQuery.toLowerCase());

    const rawStatus =
      property.status ||
      property.verificationStatus ||
      property.listingStatus ||
      "";
    const status = normalizePropertyStatus(rawStatus);
    const matchesStatus =
      statusFilter === "all" ||
      !status || // if no status field, show in all filters
      status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "approved" || s === "verified") return styles["verified"];
    if (s === "pending") return styles["pending"];
    return styles["rejected"];
  };

  return (
    <div className={styles["owner-properties-wrapper"]}>
      {/* ── Verification Status Banner ── */}
      <VerificationBanner verificationStatus={verificationStatus} />

      <div className={styles["op-header"]}>
        <div>
          <h1 className={styles["op-title"]}>My Properties</h1>
          <p className={styles["op-subtitle"]}>Manage your property listings</p>
        </div>
        {verificationStatus === "Approved" ? (
          <Link
            to="/owner-dashboard/add-property"
            state={{ from: location.pathname }}
            style={{ textDecoration: "none" }}
          >
            <button className={styles["btn-add-property"]}>
              <Plus size={18} />
              <span>Add Property</span>
            </button>
          </Link>
        ) : (
          <button
            className={styles["btn-add-property"]}
            disabled
            title={
              verificationStatus === "Pending"
                ? "Cannot add properties while verification is pending"
                : verificationStatus === "Rejected"
                  ? "Cannot add properties while verification is rejected. Please resubmit."
                  : "Please complete identity verification first"
            }
            style={{
              opacity: 0.5,
              cursor: "not-allowed",
            }}
          >
            <Plus size={18} />
            <span>Add Property</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1", minWidth: "260px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            placeholder="Search properties by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "white",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={18} style={{ color: "#6B7280" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontSize: "14px",
              backgroundColor: "white",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className={styles["op-grid"]}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={styles["op-card"]}
              style={{ animation: "pulse 1.5s infinite ease-in-out" }}
            >
              <div
                className={styles["op-card-image"]}
                style={{ backgroundColor: "#E5E7EB" }}
              ></div>
              <div className={styles["op-card-content"]}>
                <div
                  style={{
                    height: "18px",
                    width: "70%",
                    backgroundColor: "#E5E7EB",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  style={{
                    height: "14px",
                    width: "40%",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "4px",
                    marginBottom: "12px",
                  }}
                ></div>
                <div
                  style={{
                    height: "14px",
                    width: "90%",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "64px 0",
            textAlign: "center",
          }}
        >
          <AlertCircle
            size={40}
            color="#EF4444"
            style={{ marginBottom: "12px" }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Failed to Load Listings
          </h3>
          <p style={{ color: "#6B7280", marginBottom: "16px" }}>{error}</p>
          <button
            onClick={fetchProperties}
            className={styles["btn-add-property"]}
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      ) : filteredProperties.length === 0 ? (
        /* Empty State */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "80px 0",
            textAlign: "center",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
          }}
        >
          <Building2
            size={48}
            color="#9CA3AF"
            style={{ marginBottom: "16px" }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {searchQuery || statusFilter !== "all"
              ? "No Matching Properties"
              : "No Properties Registered"}
          </h3>
          <p
            style={{
              color: "#6B7280",
              marginBottom: "24px",
              maxWidth: "340px",
            }}
          >
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or filter settings to find what you are looking for."
              : "Register your property now to start receiving guest booking requests."}
          </p>
          {!(searchQuery || statusFilter !== "all") && (
            <Link
              to="/owner-dashboard/add-property"
              state={{ from: location.pathname }}
              style={{ textDecoration: "none" }}
            >
              <button className={styles["btn-add-property"]}>
                <Plus size={18} />
                <span>Register a Property</span>
              </button>
            </Link>
          )}
        </div>
      ) : (
        /* Properties Grid */
        <div className={styles["op-grid"]}>
          {filteredProperties.map((property) => {
            // Use mainImageUrl (the dedicated cover photo field from PropertyResultDto)
            const coverImage = getImageUrl(property.mainImageUrl);
            return (
              <div
                key={property.id}
                className={styles["op-card"]}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/owner-properties/${property.id}`)}
              >
                <div
                  className={styles["op-card-image"]}
                  style={{ backgroundColor: "#E5E7EB" }}
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={property.title}
                      className={styles["property-image"]}
                    />
                  ) : (
                    <Building2 size={40} color="#9CA3AF" />
                  )}
                  <div className={styles["op-card-actions"]}>
                    <button
                      className={`${styles["op-action-btn"]} ${styles["blue"]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/owner-dashboard/add-property", {
                          state: {
                            propertyToEdit: property,
                            from: location.pathname,
                          },
                        });
                      }}
                      title="Edit Property"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={`${styles["op-action-btn"]} ${styles["red"]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(property);
                      }}
                      title="Delete Property"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {(property.status || property.verificationStatus) && (
                    <span
                      className={`${styles["op-badge"]} ${getStatusBadgeClass(
                        property.status || property.verificationStatus,
                      )}`}
                    >
                      {property.status || property.verificationStatus}
                    </span>
                  )}
                </div>
                <div className={styles["op-card-content"]}>
                  <h4>{property.title}</h4>
                  <p className={styles["op-card-location"]}>
                    {property.address}
                  </p>
                  <p
                    className={styles["op-card-location"]}
                    style={{ fontWeight: "600", color: "#111827" }}
                  >
                    ${property.pricePerMonth?.toLocaleString()} / month
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "13px",
                      color: "#4B5563",
                      marginTop: "8px",
                    }}
                  >
                    <span>⭐</span>
                    <span style={{ fontWeight: "600" }}>
                      {property.avgRating > 0 ? property.avgRating.toFixed(1) : "0.0"}
                    </span>
                    <span style={{ color: "#6B7280" }}>
                      ({property.totalReviews ?? 0} {property.totalReviews === 1 ? "Review" : "Reviews"})
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "13px",
                      color: "#6B7280",
                      marginTop: "8px",
                    }}
                  >
                    <span>
                      Beds: {property.bedroomsNumber ?? property.roomsNumber}
                    </span>
                    <span>Baths: {property.bathroomsNumber}</span>
                    <span style={{ textTransform: "capitalize" }}>
                      {String(property.propertyType || "").toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
        propertyName={propertyToDelete?.title}
        isLoading={deleting}
      />
    </div>
  );
}
