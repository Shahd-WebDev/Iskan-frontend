import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2, Edit2, CornerDownRight, AlertCircle, RefreshCw, StarHalf } from "lucide-react";
import { getOwnerReviews, replyToReview, deleteReviewReply } from "../../../../services/ownerReviews";
import styles from "./ReviewsPage.module.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Stats
  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyFilter, setReplyFilter] = useState("all"); // "all", "replied", "unreplied"

  // Reply States
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOwnerReviews();
      // Swagger spec defines no response content, so we handle array defensively
      setReviews(Array.isArray(data) ? data : data?.data || data?.reviews || []);
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

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      await replyToReview(reviewId, replyText);
      
      // Update local state optimistically
      setReviews(prev => prev.map(rev => {
        const id = rev.id || rev.reviewId;
        if (id === reviewId) {
          return {
            ...rev,
            reply: {
              replyText: replyText,
              createdAt: new Date().toISOString()
            }
          };
        }
        return rev;
      }));

      setReplyingToId(null);
      setReplyText("");
    } catch (err) {
      console.error("Failed to submit reply:", err);
      alert("Failed to submit reply. Please try again.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    try {
      await deleteReviewReply(reviewId);
      
      // Update local state optimistically
      setReviews(prev => prev.map(rev => {
        const id = rev.id || rev.reviewId;
        if (id === reviewId) {
          return { ...rev, reply: null };
        }
        return rev;
      }));
    } catch (err) {
      console.error("Failed to delete reply:", err);
      alert("Failed to delete reply. Please try again.");
    }
  };

  const handleEditReply = (reviewId, existingText) => {
    setReplyingToId(reviewId);
    setReplyText(existingText);
  };

  // Defensive mappings of review objects
  const getReviewFields = (rev) => {
    return {
      id: rev.id || rev.reviewId,
      rating: Number(rev.rating || rev.stars || 0),
      comment: rev.comment || rev.text || rev.reviewText || "No comment provided.",
      createdAt: rev.createdAt || rev.date || rev.reviewDate,
      studentName: rev.studentName || rev.reviewerName || rev.user?.name || "Student Guest",
      propertyName: rev.propertyName || rev.propertyTitle || "My Property",
      reply: rev.reply || rev.ownerReply || null
    };
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + getReviewFields(r).rating, 0) / totalReviews
    : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rating = Math.min(5, Math.max(1, Math.round(getReviewFields(r).rating)));
    ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
  });

  // Filters application
  const filteredReviews = reviews.filter(rev => {
    const { rating, reply } = getReviewFields(rev);
    
    // Rating Filter
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "high" && rating >= 4) ||
      (ratingFilter === "low" && rating <= 3) ||
      (Number(ratingFilter) === rating);

    // Reply Filter
    const matchesReply = replyFilter === "all" ||
      (replyFilter === "replied" && !!reply) ||
      (replyFilter === "unreplied" && !reply);

    return matchesRating && matchesReply;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} className={styles["star-filled"]} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} size={16} className={styles["star-filled"]} />);
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
          <h1 className={styles["reviews-title"]}>Guest Reviews</h1>
          <p className={styles["reviews-subtitle"]}>See feedback and reply to your tenants</p>
        </div>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div style={{ padding: "40px 0" }}>
          <div className={styles["stats-card"]} style={{ animation: "pulse 1.5s infinite", height: "180px", marginBottom: "24px" }}></div>
          {[1, 2].map(i => (
            <div key={i} className={styles["review-card"]} style={{ animation: "pulse 1.5s infinite", height: "140px", marginBottom: "16px" }}></div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className={styles["empty-state"]}>
          <AlertCircle size={40} color="#EF4444" style={{ marginBottom: "12px" }} />
          <h3>Failed to Load Reviews</h3>
          <p>{error}</p>
          <button onClick={fetchReviews} className={styles["btn-primary"]}>
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {/* Summary Stats Card */}
          <div className={styles["stats-card"]}>
            <div className={styles["stats-left"]}>
              <h2>{averageRating.toFixed(1)}</h2>
              <div className={styles["rating-stars-row"]}>
                {renderStars(averageRating)}
              </div>
              <p>{totalReviews} Total Reviews</p>
            </div>
            
            <div className={styles["stats-divider"]}></div>
            
            <div className={styles["stats-right"]}>
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingCounts[stars] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className={styles["distribution-row"]}>
                    <span>{stars} ★</span>
                    <div className={styles["progress-bar-bg"]}>
                      <div className={styles["progress-bar-fill"]} style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className={styles["filter-row"]}>
            <div className={styles["filter-group"]}>
              <button 
                className={`${styles["filter-tab"]} ${ratingFilter === "all" ? styles["active"] : ""}`}
                onClick={() => setRatingFilter("all")}
              >
                All Ratings
              </button>
              <button 
                className={`${styles["filter-tab"]} ${ratingFilter === "high" ? styles["active"] : ""}`}
                onClick={() => setRatingFilter("high")}
              >
                Good (4★ & 5★)
              </button>
              <button 
                className={`${styles["filter-tab"]} ${ratingFilter === "low" ? styles["active"] : ""}`}
                onClick={() => setRatingFilter("low")}
              >
                Needs Work (≤ 3★)
              </button>
            </div>

            <div className={styles["filter-group"]}>
              <select 
                value={replyFilter} 
                onChange={(e) => setReplyFilter(e.target.value)}
                className={styles["filter-select"]}
              >
                <option value="all">All Replies</option>
                <option value="replied">Replied</option>
                <option value="unreplied">Awaiting Reply</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className={styles["reviews-list"]}>
            {filteredReviews.length === 0 ? (
              <div className={styles["empty-state"]}>
                <MessageSquare size={48} color="#9CA3AF" style={{ marginBottom: "16px" }} />
                <h3>No Matching Reviews</h3>
                <p>There are no guest reviews matching the selected filter criteria.</p>
              </div>
            ) : (
              filteredReviews.map(rev => {
                const { id, rating, comment, createdAt, studentName, propertyName, reply } = getReviewFields(rev);
                const isReplying = replyingToId === id;
                const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "";

                return (
                  <div key={id} className={styles["review-card"]}>
                    <div className={styles["review-header"]}>
                      <div>
                        <h4 className={styles["reviewer-name"]}>{studentName}</h4>
                        <span className={styles["property-tag"]}>{propertyName}</span>
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
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CornerDownRight size={14} className={styles["reply-arrow"]} />
                            <h5 className={styles["reply-title"]}>Your Response</h5>
                          </div>
                          <div className={styles["reply-actions"]}>
                            <button 
                              onClick={() => handleEditReply(id, reply.replyText || reply.text)} 
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
                        <p className={styles["reply-text"]}>{reply.replyText || reply.text}</p>
                      </div>
                    ) : isReplying ? (
                      /* Inline Reply Textarea */
                      <div className={styles["reply-input-wrapper"]}>
                        <textarea
                          placeholder="Write your professional response to this guest..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className={styles["reply-textarea"]}
                          rows={3}
                        />
                        <div className={styles["reply-input-actions"]}>
                          <button 
                            onClick={() => { setReplyingToId(null); setReplyText(""); }} 
                            className={styles["btn-text"]}
                            disabled={submittingReply}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleReplySubmit(id)} 
                            className={styles["btn-primary-small"]}
                            disabled={submittingReply || !replyText.trim()}
                          >
                            {submittingReply ? "Submitting..." : "Send Response"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Write Response Button */
                      <button 
                        onClick={() => setReplyingToId(id)} 
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
        </>
      )}
    </div>
  );
}
