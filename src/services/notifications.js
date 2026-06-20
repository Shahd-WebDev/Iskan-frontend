import api from "./api";

// ======================
// GET NOTIFICATIONS (paginated)
// GET /api/Notification/Get
// ======================
export const getNotifications = async (pageIndex = 1, pageSize = 20) => {
  const response = await api.get("/Notification/Get", {
    params: { PageIndex: pageIndex, PageSize: pageSize },
  });
  return response.data;
};

// ======================
// GET UNREAD COUNT
// GET /api/Notification/UnreadCount/unread-count
// ======================
export const getUnreadCount = async () => {
  const response = await api.get("/Notification/UnreadCount/unread-count");
  return response.data;
};

// ======================
// MARK SINGLE NOTIFICATION AS READ
// PUT /api/Notification/MarkRead/{id}/read
// ======================
export const markNotificationRead = async (id) => {
  const response = await api.put(`/Notification/MarkRead/${id}/read`);
  return response.data;
};

// ======================
// MARK ALL NOTIFICATIONS AS READ
// PUT /api/Notification/MarkAllRead/read-all
// ======================
export const markAllNotificationsRead = async () => {
  const response = await api.put("/Notification/MarkAllRead/read-all");
  return response.data;
};

// ======================
// GET NOTIFICATION PREFERENCES
// GET /api/notifications/preferences
// ======================
export const getNotificationPreferences = async () => {
  const response = await api.get("/notifications/preferences");
  return response.data;
};

// ======================
// UPDATE A SINGLE PREFERENCE
// PUT /api/notifications/preferences
// Body: UpdateNotificationPreferenceDto { type, isEnabled }
// ======================
export const updateNotificationPreference = async (type, isEnabled) => {
  const response = await api.put("/notifications/preferences", { type, isEnabled });
  return response.data;
};

// ======================
// BATCH SAVE PREFERENCES
// PUT /api/notifications/preferences/save
// Body: SaveNotificationPreferencesDto { preferences: [...] }
// ======================
export const saveNotificationPreferences = async (preferences) => {
  const response = await api.put("/notifications/preferences/save", { preferences });
  return response.data;
};

// ======================
// TURN OFF ALL NOTIFICATIONS
// PUT /api/notifications/preferences/turn-off-all
// ======================
export const turnOffAllNotifications = async () => {
  const response = await api.put("/notifications/preferences/turn-off-all");
  return response.data;
};
