import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notifications";

/**
 * Centralized notification hook.
 * Single source of truth for all notification state across the owner dashboard.
 * Import this wherever you need notifications or the unread badge count.
 */
export function useNotifications({ autoFetch = true, pageSize = 20 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ── Fetch unread count (lightweight, used for badge) ──────────────────────
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      // Backend may return a number directly or an object { count: number }
      const count =
        typeof data === "number" ? data : data?.count ?? data?.unreadCount ?? 0;
      setUnreadCount(count);
    } catch {
      // Silently fail for badge — don't break the UI
    }
  }, []);

  // ── Fetch paginated notification list ─────────────────────────────────────
  const fetchNotifications = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNotifications(page, pageSize);
        const items = data?.data ?? data ?? [];
        setNotifications(page === 1 ? items : (prev) => [...prev, ...items]);
        setTotalCount(data?.count ?? items.length);
        setPageIndex(page);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
        console.error("useNotifications fetchNotifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // ── Mark single notification as read ──────────────────────────────────────
  const markRead = useCallback(
    async (id) => {
      try {
        await markNotificationRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("useNotifications markRead:", err);
      }
    },
    []
  );

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("useNotifications markAllRead:", err);
    }
  }, []);

  // ── Load more (pagination) ────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    fetchNotifications(pageIndex + 1);
  }, [fetchNotifications, pageIndex]);

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoFetch) {
      fetchUnreadCount();
      fetchNotifications(1);
    }
  }, [autoFetch, fetchUnreadCount, fetchNotifications]);

  const hasMore = notifications.length < totalCount;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    totalCount,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
    loadMore,
    refetch: () => {
      fetchUnreadCount();
      fetchNotifications(1);
    },
  };
}
