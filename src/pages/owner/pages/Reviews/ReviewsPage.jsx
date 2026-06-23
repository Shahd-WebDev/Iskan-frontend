import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Trash2,
  Edit2,
  CornerDownRight,
  AlertCircle,
  RefreshCw,
  StarHalf,
  Search,
  CheckCircle,
  HelpCircle,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import {
  getOwnerReviews,
  replyToReview,
  deleteReviewReply,
} from "../../../../services/ownerReviews";
import toast from "react-hot-toast";
import styles from "./ReviewsPage.module.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [replyFilter, setReplyFilter] = useState("all"); // "all", "replied", "unreplied"
  const [sortOption, setSortOption] = useState("newest"); // "newest", "highest", "lowest"

  // Pagination
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  // Reply Modal States
  const [replyModal, setReplyModal] = useState({ open: false, reviewId: null, text: "" });
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOwnerReviews();
      setReviews(
        Array.isArray(data) ? data : data?.data || data?.reviews || [],
      );
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to fetch guest reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReplySubmit = async () => {
    if (!replyModal.text.trim() || !replyModal.reviewId) return;
    try {
      setSubmittingReply(true);
      await replyToReview(replyModal.reviewId, replyModal.text);
      toast.success("Reply submitted successfully!");
      setReplyModal({ open: false, reviewId: null, text: "" });
      await fetchReviews();
    } catch (err) {
      console.error("Failed to submit reply:", err);
      toast.error("Failed to submit reply. Please try again.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      await deleteReviewReply(reviewId);
      toast.success("Reply deleted successfully.");
      await fetchReviews();
    } catch (err) {
      console.error("Failed to delete reply:", err);
      toast.error("Failed to delete reply. Please try again.");
    }
  };

  const openReplyModal = (reviewId, existingText = "") => {
    setReplyModal({ open: true, reviewId, text: existingText });
  };

  // Helper to extract fields safely
  const getReviewFields = (rev) => {
    const id = rev.id || rev.reviewId;
    const rating = Number(rev.rating || rev.stars || 0);
    const comment = rev.comment || rev.text || rev.reviewText || "No comment provided.";
    const createdAt = rev.createdAt || rev.date || rev.reviewDate;
    const studentName = rev.studentName || rev.reviewerName || rev.user?.name || "Student Guest";
    const studentImage = rev.studentImageUrl || rev.studentImage || rev.reviewerImage || rev.user?.profileImageUrl || null;
    const propertyName = rev.propertyName || rev.propertyTitle || "My Property";
    const reply = rev.reply || rev.ownerReply || null;
    return {
      id,
      rating,
      comment,
      createdAt,
      studentName,
      studentImage,
      propertyName,
      reply,
    };
  };

  // Stats calculations based on all fetched reviews
  const totalReviews = reviews.length;
  const repliedReviewsCount = reviews.filter((r) => !!getReviewFields(r).reply).length;
  const unrepliedReviewsCount = totalReviews - repliedReviewsCount;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + getReviewFields(r).rating, 0) / totalReviews
      : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rating = Math.min(5, Math.max(1, Math.round(getReviewFields(r).rating)));
    ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
  });

  // Filter & Search & Sort logic
  const filteredAndSortedReviews = reviews
    .map((r) => getReviewFields(r))
    .filter((rev) => {
      // Reply Filter
      if (replyFilter === "replied" && !rev.reply) return false;
      if (replyFilter === "unreplied" && rev.reply) return false;

      // Search (by Student Name or Property Name)
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const matchesStudent = rev.studentName.toLowerCase().includes(term);
        const matchesProperty = rev.propertyName.toLowerCase().includes(term);
        if (!matchesStudent && !matchesProperty) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOption === "highest") {
        return b.rating - a.rating;
      }
      if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

  // Reset pagination when filters change
  useEffect(() => {
    setPageIndex(1);
  }, [searchTerm, replyFilter, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedReviews.length / pageSize) || 1;
  const paginatedReviews = filteredAndSortedReviews.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} size={16} className={styles["star-filled"]} />,
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <StarHalf key={i} size={16} className={styles["star-filled"]} />,
        );
      } else {
        stars.push(<Star key={i} size={16} className={styles["star-empty"]} />);
      }
    }
    return stars;
  };

  return (
    <div className={styles["reviews-wrapper"]}>
      <div className={styles["reviews-header"]}>
        <div>
          <h1 className={styles["reviews-title"]}>Guest Reviews & Ratings</h1>
          <p className={styles["reviews-subtitle"]}>
            Manage feedback, monitor ratings, and reply to your tenants.
          </p>
        </div>
      </div>

      {loading && reviews.length === 0 ? (
        /* Loading Skeleton */
        <div>
          <div className={styles["stats-grid"]}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${styles["stats-card-mini"]} ${styles["skeleton"]}`}></div>
            ))}
          </div>
          <div className={`${styles["stats-card-main"]} ${styles["skeleton"]}`} style={{ height: "200px", marginBottom: "24px" }}></div>
          {[1, 2].map((i) => (
            <div key={i} className={`${styles["review-card"]} ${styles["skeleton"]}`} style={{ height: "150px", marginBottom: "16px" }}></div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className={styles["empty-state"]}>
          <AlertCircle
            size={40}
            color="#EF4444"
            style={{ marginBottom: "12px" }}
          />
          <h3>Failed to Load Reviews</h3>
          <p>{error}</p>
          <button onClick={fetchReviews} className={styles["btn-primary"]}>
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className={styles["stats-grid"]}>
            <div className={styles["stats-card-mini"]}>
              <div className={styles["stats-card-icon"]}>⭐</div>
              <div className={styles["stats-card-info"]}>
                <span className={styles["stats-card-label"]}>Average Rating</span>
                <span className={styles["stats-card-value"]}>{averageRating.toFixed(1)}</span>
              </div>
            </div>

            <div className={styles["stats-card-mini"]}>
              <div className={styles["stats-card-icon"]}>💬</div>
              <div className={styles["stats-card-info"]}>
                <span className={styles["stats-card-label"]}>Total Reviews</span>
                <span className={styles["stats-card-value"]}>{totalReviews}</span>
              </div>
            </div>

            <div className={styles["stats-card-mini"]}>
              <div className={styles["stats-card-icon"]} style={{ color: "#10B981" }}>✓</div>
              <div className={styles["stats-card-info"]}>
                <span className={styles["stats-card-label"]}>Replied</span>
                <span className={styles["stats-card-value"]}>{repliedReviewsCount}</span>
              </div>
            </div>

            <div className={styles["stats-card-mini"]}>
              <div className={styles["stats-card-icon"]} style={{ color: "#F59E0B" }}>⌛</div>
              <div className={styles["stats-card-info"]}>
                <span className={styles["stats-card-label"]}>Unreplied</span>
                <span className={styles["stats-card-value"]}>{unrepliedReviewsCount}</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution Main Card */}
          <div className={styles["stats-card-main"]}>
            <div className={styles["stats-left"]}>
              <h2>{averageRating.toFixed(1)}</h2>
              <div className={styles["rating-stars-row"]}>
                {renderStars(averageRating)}
              </div>
              <p>{totalReviews} Guest Reviews</p>
            </div>

            <div className={styles["stats-divider"]}></div>

            <div className={styles["stats-right"]}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className={styles["distribution-row"]}>
                    <span>{stars} ★</span>
                    <div className={styles["progress-bar-bg"]}>
                      <div
                        className={styles["progress-bar-fill"]}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div className={styles["controls-row"]}>
            <div className={styles["search-box"]}>
              <Search size={18} className={styles["search-icon"]} />
              <input
                type="text"
                placeholder="Search by student or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
              />
            </div>

            <div className={styles["filters-wrapper"]}>
              <div className={styles["filter-group"]}>
                <button
                  className={`${styles["filter-pill"]} ${replyFilter === "all" ? styles["active"] : ""}`}
                  onClick={() => setReplyFilter("all")}
                >
                  All Reviews
                </button>
                <button
                  className={`${styles["filter-pill"]} ${replyFilter === "replied" ? styles["active"] : ""}`}
                  onClick={() => setReplyFilter("replied")}
                >
                  Replied
                </button>
                <button
                  className={`${styles["filter-pill"]} ${replyFilter === "unreplied" ? styles["active"] : ""}`}
                  onClick={() => setReplyFilter("unreplied")}
                >
                  Unreplied
                </button>
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={styles["sort-select"]}
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className={styles["reviews-list"]}>
            {paginatedReviews.length === 0 ? (
              <div className={styles["empty-state"]}>
                <MessageSquare
                  size={48}
                  color="#9CA3AF"
                  style={{ marginBottom: "16px" }}
                />
                <h3>No reviews found</h3>
                <p>
                  We couldn't find any reviews matching your search or filters.
                </p>
              </div>
            ) : (
              paginatedReviews.map((rev) => {
                const {
                  id,
                  rating,
                  comment,
                  createdAt,
                  studentName,
                  studentImage,
                  propertyName,
                  reply,
                } = rev;
                const formattedDate = createdAt
                  ? new Date(createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "";

                return (
                  <div key={id} className={styles["review-card"]}>
                    <div className={styles["review-header"]}>
                      <div className={styles["student-profile"]}>
                        <div className={styles["student-avatar"]}>
                          {studentImage ? (
                            <img src={studentImage} alt={studentName} />
                          ) : (
                            <span className={styles["avatar-initial"]}>
                              {studentName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className={styles["reviewer-name"]}>{studentName}</h4>
                          <span className={styles["property-tag"]}>{propertyName}</span>
                        </div>
                      </div>
                      <div className={styles["review-meta"]}>
                        <div className={styles["stars-container"]}>
                          {renderStars(rating)}
                        </div>
                        <span className={styles["review-date"]}>{formattedDate}</span>
                      </div>
                    </div>

                    <p className={styles["review-comment"]}>{comment}</p>

                    {/* Owner Reply Section */}
                    {reply ? (
                      <div className={styles["reply-box"]}>
                        <div className={styles["reply-header"]}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <CornerDownRight
                              size={14}
                              className={styles["reply-arrow"]}
                            />
                            <h5 className={styles["reply-title"]}>Your Response</h5>
                          </div>
                          <div className={styles["reply-actions"]}>
                            <button
                              onClick={() =>
                                openReplyModal(id, reply.replyText || reply.text)
                              }
                              className={styles["reply-action-btn"]}
                              title="Edit Response"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteReply(id)}
                              className={`${styles["reply-action-btn"]} ${styles["delete"]}`}
                              title="Delete Response"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <p className={styles["reply-text"]}>
                          {reply.replyText || reply.text}
                        </p>
                      </div>
                    ) : (
                      /* Write Response Button */
                      <button
                        onClick={() => openReplyModal(id, "")}
                        className={styles["btn-reply-trigger"]}
                      >
                        <MessageSquare size={14} />
                        <span>Write Response</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {filteredAndSortedReviews.length > pageSize && (
            <div className={styles["pagination"]}>
              <button
                className={styles["page-btn"]}
                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                disabled={pageIndex === 1}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className={styles["page-info"]}>
                Page <strong>{pageIndex}</strong> of {totalPages}
              </span>
              <button
                className={styles["page-btn"]}
                onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
                disabled={pageIndex === totalPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className={styles["modal-overlay"]} onClick={() => setReplyModal({ open: false, reviewId: null, text: "" })}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>Reply to Review</h3>
              <button
                className={styles["close-modal-btn"]}
                onClick={() => setReplyModal({ open: false, reviewId: null, text: "" })}
              >
                &times;
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <p>Write a warm, professional response to your tenant's review. This will be publicly visible.</p>
              <textarea
                className={styles["reason-textarea"]}
                placeholder="Thank you for your feedback..."
                value={replyModal.text}
                onChange={(e) => setReplyModal((prev) => ({ ...prev, text: e.target.value }))}
                rows={5}
                autoFocus
              />
            </div>
            <div className={styles["modal-footer"]}>
              <button
                className={styles["modal-cancel-btn"]}
                onClick={() => setReplyModal({ open: false, reviewId: null, text: "" })}
                disabled={submittingReply}
              >
                Cancel
              </button>
              <button
                className={styles["modal-submit-btn"]}
                onClick={handleReplySubmit}
                disabled={!replyModal.text.trim() || submittingReply}
              >
                <Send size={14} /> {submittingReply ? "Submitting..." : "Send Response"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
