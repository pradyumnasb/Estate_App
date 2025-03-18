import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]); // Handle failure gracefully
    }
  };

  // Mark notification as read (both UI and backend)
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, status: "read" } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
