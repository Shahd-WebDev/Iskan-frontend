import api from "./api";

// ======================
// CREATE BOOKING (Student)
// POST /api/Bookings/Create
// ======================
export const createBooking = async ({
  PropertyId,
  MoveInDate,
  DurationInMonths,
  NumberOfOccupants,
  Message,
}) => {
  const response = await api.post("/Bookings/Create", null, {
    params: { PropertyId, MoveInDate, DurationInMonths, NumberOfOccupants, Message },
  });
  return response.data;
};

// ======================
// GET BOOKINGS BY PROPERTY (Owner)
// GET /api/Bookings/GetByProperty/property/{propertyId}
// ======================
export const getBookingsByProperty = async (propertyId) => {
  const response = await api.get(`/Bookings/GetByProperty/property/${propertyId}`);
  return response.data;
};

// ======================
// CONFIRM BOOKING (Owner)
// PUT /api/Bookings/Confirm/{id}/confirm
// ======================
export const confirmBooking = async (id) => {
  const response = await api.put(`/Bookings/Confirm/${id}/confirm`);
  return response.data;
};

// ======================
// REJECT BOOKING (Owner)
// PUT /api/Bookings/Reject/{id}/reject
// ======================
export const rejectBooking = async (id) => {
  const response = await api.put(`/Bookings/Reject/${id}/reject`);
  return response.data;
};

// ======================
// CANCEL BOOKING (Student or Owner)
// PUT /api/Bookings/Cancel/{id}/cancel
// ======================
export const cancelBooking = async (id) => {
  const response = await api.put(`/Bookings/Cancel/${id}/cancel`);
  return response.data;
};
