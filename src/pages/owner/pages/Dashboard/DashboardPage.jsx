import { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  Star,
  AlertCircle,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import { useAuth } from "../../../../context/AuthContext";
import { getOwnerDashboard } from "../../../../services/ownerDashboard";
import { getOwnerProperties } from "../../../../services/ownerProperties";
import { getOwnerReviews } from "../../../../services/ownerReviews";
import { getBookingsByProperty } from "../../../../services/bookings";
import VerificationBanner from "../../../../components/owner/VerificationBanner";
import "../../../../styles/verification.css";

export default function DashboardPage() {
  const location = useLocation();
  const { user, verificationStatus } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allProperties, setAllProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalActiveBookings, setTotalActiveBookings] = useState(0);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, propsData, reviewsData] = await Promise.all([
        getOwnerDashboard(),
        getOwnerProperties({ PageIndex: 1, PageSize: 1000 }),
        getOwnerReviews(),
      ]);
      setDashboardData(data);
      const ownedProperties = Array.isArray(propsData?.items)
        ? propsData.items
        : Array.isArray(propsData?.data)
          ? propsData.data
          : Array.isArray(propsData)
            ? propsData
            : [];
      setAllProperties(ownedProperties);
      setReviews(
        Array.isArray(reviewsData)
          ? reviewsData
          : reviewsData?.data || reviewsData?.reviews || []
      );

      // ── Compute real active booking count from all properties ──
      if (ownedProperties.length > 0) {
        const bookingResults = await Promise.allSettled(
          ownedProperties.map((p) =>
            getBookingsByProperty(p.id, { PageIndex: 1, PageSize: 1 })
          )
        );
        const total = bookingResults.reduce((sum, result) => {
          if (result.status === "fulfilled") {
            const count =
              result.value?.count ??
              result.value?.totalCount ??
              result.value?.data?.length ??
              0;
            return sum + Number(count);
          }
          return sum;
        }, 0);
        setTotalActiveBookings(total);
      } else {
        // Fall back to dashboard stat when no properties loaded yet
        const fallback = data?.stats?.activeBookings ?? 0;
        setTotalActiveBookings(fallback);
      }
    } catch (err) {
      console.error("Failed to fetch owner dashboard data:", err);
      setError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const displayName = dashboardData?.ownerName || user?.name || "Owner";

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = "https://isskan-1.runasp.net";
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  const getActivityIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("verify") || t.includes("approve")) {
      return {
        icon: <CheckCircle2 size={18} className={styles["green-icon"]} />,
        bgClass: styles["green-light-bg"],
      };
    }
    if (t.includes("message") || t.includes("chat")) {
      return {
        icon: <MessageSquare size={18} className={styles["blue-icon"]} />,
        bgClass: styles["blue-light-bg"],
      };
    }
    if (t.includes("booking") || t.includes("rent")) {
      return {
        icon: <CalendarCheck size={18} className={styles["green-icon"]} />,
        bgClass: styles["green-light-bg"],
      };
    }
    return {
      icon: <AlertTriangle size={18} className={styles["yellow-icon"]} />,
      bgClass: styles["yellow-light-bg"],
    };
  };

  if (loading) {
    return (
      <div className={styles["dashboard-content-wrapper"]}>
        <div className={styles["dc-header"]}>
          <div
            className="skeleton-title"
            style={{
              height: "32px",
              width: "300px",
              backgroundColor: "#E5E7EB",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
          ></div>
          <div
            className="skeleton-subtitle"
            style={{
              height: "18px",
              width: "400px",
              backgroundColor: "#F3F4F6",
              borderRadius: "4px",
            }}
          ></div>
        </div>

        {/* Stats Skeleton */}
        <div className={styles["dc-stats-grid"]}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={styles["dc-stat-card"]}
              style={{ animation: "pulse 1.5s infinite ease-in-out" }}
            >
              <div className={styles["dc-stat-header"]}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#E5E7EB",
                  }}
                ></div>
              </div>
              <div className={styles["dc-stat-body"]}>
                <div
                  style={{
                    height: "28px",
                    width: "60px",
                    backgroundColor: "#E5E7EB",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  style={{
                    height: "14px",
                    width: "100px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Grid Skeleton */}
        <div className={styles["dc-bottom-grid"]}>
          <div
            className={styles["dc-section-card"]}
            style={{ animation: "pulse 1.5s infinite ease-in-out" }}
          >
            <div
              style={{
                height: "20px",
                width: "200px",
                backgroundColor: "#E5E7EB",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            ></div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "60px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div
            className={styles["dc-section-card"]}
            style={{ animation: "pulse 1.5s infinite ease-in-out" }}
          >
            <div
              style={{
                height: "20px",
                width: "200px",
                backgroundColor: "#E5E7EB",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            ></div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "70px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["dashboard-content-wrapper"]}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <AlertCircle
            size={48}
            color="#EF4444"
            style={{ marginBottom: "16px" }}
          />
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Something Went Wrong
          </h2>
          <p
            style={{
              color: "#6B7280",
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
          >
            <RefreshCw size={16} />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalProperties: 0,
    propertiesGrowth: 0,
    activeBookings: 0,
    actionRequired: false,
    averageRating: 0,
    ratingChange: 0,
    pendingActions: 0,
  };

  const activities = dashboardData?.recentActivities || [];
  const properties = dashboardData?.recentProperties || [];

  const totalCount = stats.totalProperties ?? 0;
  const activeBookings = totalActiveBookings;
  const pendingActions = stats.pendingActions ?? 0;

  // Compute dynamic average rating from backend reviews API
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating || r.stars || 0), 0) / reviews.length
    : 0;

  const renderDashboardStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} className={styles["star-filled"]} style={{ fill: "#F59E0B", color: "#F59E0B" }} />);
      } else {
        stars.push(<Star key={i} size={14} className={styles["star-empty"]} style={{ color: "#CBD5E1" }} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles["dashboard-content-wrapper"]}>
      {/* ── Account Verification Status Banner ── */}
      <VerificationBanner verificationStatus={verificationStatus} />

      {/* ── Per-property Status Banners ── */}
      {properties
        .filter((p) => p.verificationStatus === "Pending")
        .slice(0, 1)
        .map((p) => (
          <div key={p.id} className="pending-banner">
            <Clock size={18} />
            <span>
              <strong>"{p.title}"</strong> is under review. You'll be notified
              once it's approved.
            </span>
          </div>
        ))}
      {properties
        .filter((p) => p.verificationStatus === "Rejected")
        .map((p) => (
          <div
            key={p.id}
            className="pending-banner"
            style={{
              background: "#fee2e2",
              borderColor: "#fca5a5",
              color: "#991b1b",
            }}
          >
            <AlertCircle size={18} />
            <span>
              <strong>"{p.title}"</strong> was rejected.
              {p.rejectionReason ? <> Reason: {p.rejectionReason}</> : null}
            </span>
          </div>
        ))}

      <div className={styles["dc-header"]}>
        <h1 className={styles["dc-title"]}>Welcome Back, {displayName}!</h1>
        <p className={styles["dc-subtitle"]}>
          Here's what's happening with your properties today
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles["dc-stats-grid"]}>
        {/* Total Properties */}
        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div
              className={`${styles["dc-stat-icon-wrapper"]} ${styles["blue-bg"]}`}
            >
              <Building2 size={20} className={styles["blue-icon"]} />
            </div>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>{totalCount}</h3>
            <p>Total Properties</p>
          </div>
        </div>

        {/* Active Bookings */}
        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div
              className={`${styles["dc-stat-icon-wrapper"]} ${styles["green-bg"]}`}
            >
              <Calendar size={20} className={styles["green-icon"]} />
            </div>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>{activeBookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div
              className={`${styles["dc-stat-icon-wrapper"]} ${styles["yellow-bg"]}`}
            >
              <Star size={20} className={styles["yellow-icon"]} />
            </div>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>
              {typeof averageRating === "number"
                ? averageRating.toFixed(1)
                : averageRating}
            </h3>
            <p>Average Rating</p>
          </div>
        </div>

        {/* Pending Actions */}
        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div
              className={`${styles["dc-stat-icon-wrapper"]} ${styles["red-bg"]}`}
            >
              <AlertTriangle size={20} className={styles["red-icon"]} />
            </div>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>{pendingActions}</h3>
            <p>Pending Actions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles["dc-section-card"]}>
        <h2 className={styles["dc-section-title"]}>Quick Actions</h2>
        <div className={styles["dc-quick-actions"]}>
          <Link
            to="/owner-dashboard/add-property"
            state={{ from: location.pathname }}
            style={{ textDecoration: "none" }}
          >
            <button className={`${styles["btn"]} ${styles["btn-primary"]}`}>
              <Plus size={18} />
              <span>Add New Property</span>
            </button>
          </Link>
          <Link
            to="/owner-dashboard/bookings"
            style={{ textDecoration: "none" }}
          >
            <button className={`${styles["btn"]} ${styles["btn-outline"]}`}>
              <Calendar size={18} />
              <span>View All Bookings</span>
            </button>
          </Link>
          <Link
            to="/owner-dashboard/messages"
            state={{ tab: "messages" }}
            style={{ textDecoration: "none" }}
          >
            <button className={`${styles["btn"]} ${styles["btn-outline"]}`}>
              <MessageSquare size={18} />
              <span>Check Messages</span>
            </button>
          </Link>
        </div>
      </div>

      <div className={styles["dc-bottom-grid"]}>
        {/* Recent Activity & Notifications */}
        <div className={styles["dc-section-card"]}>
          <h2 className={styles["dc-section-title"]}>
            Recent Activity & Notifications
          </h2>
          <div className={styles["dc-activity-list"]}>
            {activities.length > 0 ? (
              activities.map((act, index) => {
                const iconDetails = getActivityIcon(act.type);
                return (
                  <div
                    key={index}
                    className={`${styles["dc-activity-item"]} ${iconDetails.bgClass}`}
                  >
                    {iconDetails.icon}
                    <div className={styles["dc-activity-text"]}>
                      <p>{act.description}</p>
                      <span>{act.timeAgo}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "#6B7280",
                }}
              >
                No recent activity.
              </div>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className={styles["dc-section-card"]}>
          <div className={styles["dc-section-header"]}>
            <h2 className={styles["dc-section-title"]}>Recent Properties</h2>
            <Link
              to="/owner-dashboard/properties"
              className={styles["dc-view-all"]}
            >
              View All
            </Link>
          </div>

          <div className={styles["dc-properties-list"]}>
            {properties.length > 0 ? (
              properties.map((prop) => {
                const coverImage = getImageUrl(prop.mainImageUrl);
                const statusClass =
                  prop.verificationStatus === "Approved"
                    ? "green"
                    : prop.verificationStatus === "Pending"
                      ? "yellow"
                      : "red";
                return (
                  <div key={prop.id} className={styles["dc-property-item"]}>
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={prop.title}
                        className={styles["dc-property-img"]}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className={styles["dc-property-img"]}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9CA3AF",
                        }}
                      >
                        <Building2 size={24} />
                      </div>
                    )}
                    <div className={styles["dc-property-info"]}>
                      <h4>{prop.title}</h4>
                      <p>{prop.address}</p>
                    </div>
                    <span
                      className={`${styles["dc-badge"]} ${styles[statusClass]}`}
                    >
                      {prop.verificationStatus === "Pending"
                        ? "Under Review"
                        : prop.verificationStatus}
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "#6B7280",
                }}
              >
                No properties registered.
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews Card */}
        <div className={styles["dc-section-card"]}>
          <div className={styles["dc-section-header"]}>
            <h2 className={styles["dc-section-title"]}>Recent Guest Reviews</h2>
            <Link
              to="/owner-dashboard/reviews"
              className={styles["dc-view-all"]}
            >
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            {reviews.slice(0, 3).length > 0 ? (
              reviews.slice(0, 3).map((rev) => {
                const id = rev.id || rev.reviewId;
                const rating = Number(rev.rating || rev.stars || 0);
                const comment = rev.comment || rev.text || rev.reviewText || "No comment provided.";
                const createdAt = rev.createdAt || rev.date || rev.reviewDate;
                const studentName = rev.studentName || rev.reviewerName || rev.user?.name || "Student Guest";
                const propertyName = rev.propertyName || rev.propertyTitle || "My Property";

                const formattedDate = createdAt
                  ? new Date(createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  : "";

                return (
                  <div key={id} style={{ display: "flex", flexDirection: "column", padding: "12px", border: "1px solid #F3F4F6", borderRadius: "10px", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{studentName}</span>
                        <span style={{ fontSize: "10px", backgroundColor: "#F3F4F6", color: "#4B5563", padding: "2px 6px", borderRadius: "9999px", marginLeft: "8px", fontWeight: "600" }}>
                          {propertyName}
                        </span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{formattedDate}</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {renderDashboardStars(rating)}
                    </div>
                    <p style={{ fontSize: "13px", color: "#4B5563", margin: "4px 0 0 0", lineBreak: "anywhere", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {comment}
                    </p>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "#6B7280",
                }}
              >
                No reviews yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
