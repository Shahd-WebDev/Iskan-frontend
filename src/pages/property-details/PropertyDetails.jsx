import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import PropertyHeader from "../../components/PropertiesDetails/PropertyHeader";
import ImageGallery from "../../components/PropertiesDetails/PropertyGallery";
import PropertyActions from "../../components/PropertiesDetails/PropertyActions";
import PropertyDescription from "../../components/PropertiesDetails/Propertydescription";
import KeyFeatures from "../../components/PropertiesDetails/KeyFeatures";
import BookingContact from "../../components/PropertiesDetails/BookingContact";
import ReviewSection from "../../components/PropertiesDetails/ReviewsSection";
import RecommendedProperties from "../../components/PropertiesDetails/RecommendedProperties";
import BookingStatusAlert from "../../components/booking/BookingStatusAlert";
import RequestBookingModal from "../../components/booking/RequestBookingModal";
import PropertyMap from "../../components/PropertiesDetails/PropertyMap";
import api from "../../services/api";
import toast from "react-hot-toast";
import "../property-details/PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [property, setProperty] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatusLoading, setBookingStatusLoading] = useState(true); 
 
  const [showMap, setShowMap] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [showAlert, setShowAlert] = useState(false);


  const refreshBookingStatus = useCallback(async () => {
    
    if (!token || !property?.id) {
      console.log("⚠️ Cannot fetch booking: missing token or property ID");
   setBookingStatusLoading(false);
      return;
    }

    try {
      setBookingStatusLoading(true);
      console.log("🔄 Fetching booking status for property:", property.id);
      
      const res = await api.get("/Bookings/GetMyBookings", {
        params: { PageIndex: 1, PageSize: 100 },
      });

      const bookings = res.data.data || [];
      console.log("📋 All bookings:", bookings);

      console.log("🔍 First booking object:", bookings[0]);
console.log("🔍 Property ID we're looking for:", property.id);

      const booking = bookings.find(
  (b) =>
    b.propertyId === property.id ||
    b.property?.id === property.id ||
    b.propertyTitle === property.title
);

      if (!booking) {
        console.log(" No booking found for this property");
        setBookingStatus(null);
        setBookingId(null);
        return;
      }

      console.log(" Found booking with status:", booking.status);
      setBookingStatus(booking.status.toLowerCase());
      setBookingId(booking.id);

    } catch (err) {
      console.error(" Error fetching booking status:", err);
    }finally {
    setBookingStatusLoading(false); 
  }
  }, [token, property?.id]);

  // جلب بيانات العقار
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/Property/GetDetails?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setProperty(data.property ?? data);
      } catch {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, token]);

  // ✅ جلب حالة الحجز عند تحميل العقار
  useEffect(() => {
    if (property?.id && token) {
      refreshBookingStatus();
    }
  }, [property?.id, token, refreshBookingStatus]);


  // ✅ دالة معالجة تأكيد الحجز (للمالك)
  const handleConfirmBooking = async () => {
    if (!bookingId) {
      console.error("❌ No booking ID to confirm");
      return;
    }

    try {
      console.log("✅ Confirming booking:", bookingId);
      
      const res = await fetch(`/api/Bookings/Confirm/${bookingId}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        console.log("✅ Booking confirmed successfully");
        await refreshBookingStatus(); 
        toast.success("Booking confirmed successfully!");
      } else {
        console.error("❌ Failed to confirm booking");
        toast.error("Failed to confirm booking");
      }
    } catch (err) {
      console.error("❌ Error confirming booking:", err);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
  const fetchFacilities = async () => {
    try {
      const res = await fetch(`/api/Facility/GetAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setAllFacilities(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching facilities:", err);
    }
  };
  fetchFacilities();
}, [token]);

// جلب التوصيات
useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/Ai/GetRecommendations/recommend/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setRecommendations([]);
        return;
      }

      const data = await res.json();
      setRecommendations(data.recommendations ?? data ?? []);
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
      setRecommendations([]);
    }
  };

  if (id) fetchRecommendations();
}, [id, token]);
  // ✅ دالة معالجة تقديم طلب حجز جديد
  const handleBookingSubmit = async () => {
  console.log("📝 Booking submitted, refreshing status...");
  setOpen(false);
  await refreshBookingStatus();
  setShowAlert(true); 
};

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        Loading...
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

  return (
    <>
      <div className="pd-page">
        <PropertyHeader
          property={property}
          onLocationClick={() => setShowMap((prev) => !prev)}
          showMap={showMap}
        />

        <ImageGallery
          images={galleryImages}
          showMap={showMap}
          setShowMap={setShowMap}
          propertyId={id}
        />

        <div className="pd-mid-section align-items-start">
          <div className="pd-left-col">
            <PropertyActions
                        
              bookingStatus={bookingStatusLoading ? "loading" : bookingStatus}
              property={property}
              onOpenBooking={() => setOpen(true)}
              onOpenStatusAlert={() => setShowAlert(true)}
            />
            
                      
            <BookingStatusAlert
              bookingStatus={bookingStatus}
              visible={showAlert}
              onDismiss={() => setShowAlert(false)}
              onConfirm={handleConfirmBooking}
            />

            <PropertyDescription
              property={property}
              allFacilities={allFacilities}
            />
          </div>

          <div className="pd-right-col">
            <KeyFeatures
              facilities={property.facilities}
              allFacilities={allFacilities}
            />
          </div>
        </div>

        <BookingContact property={property} bookingStatus={bookingStatus} />

        <ReviewSection
          propertyId={property.id}
          bookingStatus={bookingStatus}
        />

        {recommendations && recommendations.length > 0 && (
              <RecommendedProperties
              currentPropertyId={property.id}
              recommendations={recommendations}
              allFacilities={allFacilities}
            />
        )}
      </div>

      <RequestBookingModal
        open={open}
        onClose={() => setOpen(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        onSubmit={handleBookingSubmit}
      />
    </>
  );
}