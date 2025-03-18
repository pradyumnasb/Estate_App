import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true); // Track loading state

  // Function to update or clear user
  const updateUser = (data) => {
    if (data) {
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      setCurrentUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // Fetch user from backend on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/current-user", { withCredentials: true });
        console.log("✅ Authenticated User:", res.data);
        updateUser(res.data);
      } catch (error) {
        console.error("❌ Auth Error:", error.response?.data || error.message);
        updateUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
