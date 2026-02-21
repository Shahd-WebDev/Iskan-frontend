import { useState } from "react";
import RequestBookingModal from "../components/booking/RequestBookingModal";

export default function TestBookingModal() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Test Booking Modal</h1>

      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Open Booking Modal
      </button>

      <RequestBookingModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => {
          alert("Submitted!");
          setOpen(false);
        }}
      />
    </div>
  );
}
