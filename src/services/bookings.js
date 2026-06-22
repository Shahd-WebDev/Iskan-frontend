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
// Returns paginated response: { pageIndex, pageSize, count, data: [...] }
// Each booking item includes an embedded `student` object.
// ======================
export const getBookingsByProperty = async (propertyId, params = {}) => {
  const response = await api.get(
    `/Bookings/GetBookingsByProperty/property/${propertyId}`,
    { params }
  );
  return response.data;
};

// ======================
// CONFIRM BOOKING (Owner)
// POST /api/Bookings/Confirm/{id}/confirm
// ======================
export const confirmBooking = async (id) => {
  const response = await api.put(`/Bookings/Confirm/${id}/confirm`);
  return response.data;
};

// ======================
// REJECT BOOKING (Owner)
// POST /api/Bookings/Reject/{id}/reject
// ======================
export const rejectBooking = async (id) => {
  const response = await api.put(`/Bookings/Reject/${id}/reject`);
  return response.data;
};

// ======================
// CANCEL BOOKING (Student or Owner)
// POST /api/Bookings/Cancel/{id}/cancel
// ======================
export const cancelBooking = async (id) => {
  const response = await api.put(`/Bookings/Cancel/${id}/cancel`);
  return response.data;
};
