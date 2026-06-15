import api from "./api";

// 1. Get reviews listing for owner (paginated, option to filter by isReplied)
export const getOwnerReviews = async (params = {}) => {
  const response = await api.get("/OwnerReviews/GetReviews", { params });
  return response.data;
};

// 2. Submit reply to guest review
export const replyToReview = async (reviewId, replyText) => {
  const response = await api.post(`/OwnerReviews/Reply/${reviewId}/reply`, { replyText });
  return response.data;
};

// 3. Delete owner's reply to guest review
export const deleteReviewReply = async (reviewId) => {
  const response = await api.delete(`/OwnerReviews/DeleteReply/${reviewId}/reply`);
  return response.data;
};
