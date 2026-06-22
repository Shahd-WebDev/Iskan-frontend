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
export const rejectBooking = async (id, reason) => {
  const response = await api.put(`/Bookings/Reject/${id}/reject`, { reason });
  return response.data;
};

// ======================
// GET BOOKINGS FOR OWNER (Owner)
// GET /api/Bookings/GetBookingsForOwner/owner
// Params: Status, PageIndex, PageSize
// ======================
export const getBookingsForOwner = async (params = {}) => {
  const response = await api.get("/Bookings/GetBookingsForOwner/owner", { params });
  return response.data;
};

// ======================
// GET BOOKING DETAILS (Owner)
// GET /api/Bookings/GetBookingDetails/{id}
// ======================
export const getBookingDetails = async (id) => {
  const response = await api.get(`/Bookings/GetBookingDetails/${id}`);
  return response.data;
};

