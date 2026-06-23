import { useEffect, useState } from "react";
import UserPropertyCard from "../../components/home/PropertyCard";
import { Clock, BadgeCheck, CheckCircle, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./MyBooking.css";

const statusConfig = {
  pending: { color: "#FF8D28",border:"1px solid #FF8D28", Icon: Clock },
  approved: {  color: "#FFFFFF",border:"1px solid #FFFFFF", Icon: BadgeCheck },
  confirmed: {  color: "#34C759",border:"1px solid #34C759", Icon: BadgeCheck },
   cancelled: {  color: "#FF383C", border: "1px solid #FF383C", Icon: X },
};

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allFacilities, setAllFacilities] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (bookingId) => {
    toast.custom(
      (t) => (
        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: "400px",
          }}
        >
          <p style={{ margin: "0 0 16px 0" }}>
            Are you sure you want to cancel this booking?
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performCancel(bookingId);
              }}
              style={{
                padding: "6px 16px",
                background: "#E53935",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "6px 16px",
                background: "#e0e0e0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const performCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await api.put(`/Bookings/Cancel/${bookingId}/cancel`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking cancelled successfully");
      // 🔥 مهم جدًا
      window.dispatchEvent(new Event("bookingChanged"));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log(" Fetching bookings...");
      let allBookings = [];
      let pageIndex = 1;
      let totalCount = Infinity;

      while (allBookings.length < totalCount) {
        const res = await api.get("/Bookings/GetMyBookings", {
          params: {
            PageIndex: pageIndex,
            PageSize: 20,
          },
        });
        console.log(` Bookings page ${pageIndex} response:`, res.data);
        const pageData = res.data.data || [];
        totalCount = res.data.count ?? pageData.length;
        allBookings = [...allBookings, ...pageData];
        if (pageData.length === 0) break; 
        pageIndex += 1;
      }

      const bookingsData = allBookings;

      // Fetch full property details for each booking using propertyId
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (b) => {
          if (!b.propertyId) return b;
          try {
            const detailsRes = await api.get("/Property/GetDetails", {
              params: { id: b.propertyId },
            });
            const propertyDetails = detailsRes.data.property ?? detailsRes.data;
            return { ...b, propertyDetails };
          } catch (err) {
            console.error(
              " Error fetching property details for",
              b.propertyId,
              err
            );
            return b;
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      console.error(" Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await api.get("/Facility/GetAll");
      setAllFacilities(res.data.data ?? res.data ?? []);
    } catch (err) {
      console.error(" Error fetching facilities:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#fff", padding: "40px" }}
      >
        <div className="container">
          <h5 className="booking-label">
          
            My Booking
          </h5>
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div className="container py-4">
        <h5
          className="fw-semibold mb-4"
          style={{
            borderLeft: "4px solid #ccc",
            paddingLeft: 12,
            fontSize: 20,
          }}
        >
          My Booking {bookings.length > 0 && `(${bookings.length})`}
        </h5>

        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 18, color: "#666" }}>
              You don't have any bookings yet.
            </p>
            <button
              onClick={() => (window.location.href = "/properties")}
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
              Browse Properties
            </button>
          </div>
        ) : (
            <div className="booking-grid">
          
            {bookings.map((b) => {
              const statusKey = (b.status || "").toLowerCase();
              const config = statusConfig[statusKey] || statusConfig.pending;
              const { bg, color, border, Icon } = config;
              const pd = b.propertyDetails || {};
              const property = {
                id: b.propertyId,
                title: pd.title || b.propertyTitle,
                pricePerMonth: pd.pricePerMonth,
                mainImageUrl: pd.imagesUrl?.[0],
                address: pd.address,
                roomsNumber: pd.bedroomsNumber,
                bathroomsNumber: pd.bathroomsNumber,
                propertyType: pd.propertyType,
                facilities: pd.facilities,
              };

              return (
               <div key={b.id} className="booking-item">
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{
                      position: "absolute",
                      top: 18,
                      left: 18,
                      right: 18,
                      zIndex: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="d-inline-flex align-items-center gap-1"
                      style={{
                        background: bg,
                        color: color,
                        border:border,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      <Icon size={13} strokeWidth={2.5} />
                      {b.status}
                    </span>

                    {statusKey === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        title="Cancel booking"
                        className="d-flex align-items-center justify-content-center bg-white border-0 rounded-circle"
                        style={{
                          width: 28,
                          height: 28,
                          cursor:
                            cancellingId === b.id ? "not-allowed" : "pointer",
                          opacity: cancellingId === b.id ? 0.5 : 1,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        }}
                      >
                        <X size={14} color="#E53935" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  <UserPropertyCard
                    property={property}
                    facilities={allFacilities}
                    hideBookmark
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBooking;