import { useEffect, useState } from "react";
import UserPropertyCard from "../../components/home/PropertyCard";
import { Clock, BadgeCheck, CheckCircle } from "lucide-react";
import api from "../../services/api";

const statusConfig = {
  pending: { bg: "#FFF3E0", color: "#E65100", Icon: Clock },
  approved: { bg: "#E8F5E9", color: "#2E7D32", Icon: BadgeCheck },
  confirmed: { bg: "#E3F2FD", color: "#1565C0", Icon: CheckCircle },
};

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log(" Fetching bookings...");
      
      const res = await api.get("/Bookings/GetMyBookings", {
        params: { PageIndex: 1, PageSize: 20 },
      });

      console.log(" Bookings response:", res.data);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(" Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "40px" }}>
        <div className="container">
          <h5 className="fw-semibold mb-4" style={{ borderLeft: "4px solid #ccc", paddingLeft: 12, fontSize: 20 }}>
            My Booking
          </h5>
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading...
          </div>
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
              onClick={() => window.location.href = "/properties"}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {bookings.map((b) => {
              const statusKey = (b.status || "").toLowerCase();
              const config = statusConfig[statusKey] || statusConfig.pending;
              const { bg, color, Icon } = config;

              const property = {
                id: b.id,
                title: b.propertyTitle,
              };

              return (
                <div key={b.id} style={{ position: "relative" }}>
                  <span
                    className="d-inline-flex align-items-center gap-1"
                    style={{
                      position: "absolute",
                      top: 18,
                      left: 18,
                      zIndex: 10,
                      background: bg,
                      color: color,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    <Icon size={13} strokeWidth={2.5} />
                    {b.status}
                  </span>
                  <UserPropertyCard property={property} hideBookmark />
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