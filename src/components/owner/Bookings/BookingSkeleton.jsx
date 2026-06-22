import styles from "./Bookings.module.css";

export default function BookingSkeleton() {
  return (
    <>
      {/* Stats Skeleton */}
      <div className={styles["skeleton-stats"]}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`${styles["skeleton"]} ${styles["skeleton-stat"]}`} />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className={styles["skeleton-grid"]}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles["skeleton-card"]}>
            <div className={`${styles["skeleton"]} ${styles["skeleton-img"]}`} />
            <div className={styles["skeleton-body"]}>
              <div className={`${styles["skeleton"]} ${styles["skeleton-line"]} ${styles["skeleton-line--sm"]}`} />
              <div className={`${styles["skeleton"]} ${styles["skeleton-line"]} ${styles["skeleton-line--lg"]}`} style={{ height: 50, borderRadius: 10 }} />
              <div className={`${styles["skeleton"]} ${styles["skeleton-line"]} ${styles["skeleton-line--md"]}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
