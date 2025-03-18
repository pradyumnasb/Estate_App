import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { Home, Menu, X, User, Bell } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import { NotificationContext } from "../Context/NotificationContext";
import axios from "axios";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { notifications = [], setNotifications } = useContext(NotificationContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [window.location.pathname]);

  const navigateToHome = () => {
    if (currentPath === "/") {
      scroll.scrollToTop({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        scroll.scrollToTop({ behavior: "smooth" });
      }, 100);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser?._id) return;

    try {
      const response = await axios.get(`/api/notifications/${currentUser._id}`);
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentUser]);

  return (
    <nav className="bg-gray-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Logo - Click to navigate home */}
          <div
            className="flex items-center cursor-pointer"
            onClick={navigateToHome}
          >
            <Home className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl text-white">LuxuryEstates</span>
          </div>

          {/* Desktop Menu */}
          <div className="flex justify-center space-x-8">
            {window.location.pathname === "/" ? (
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-100}
                className="text-white cursor-pointer hover:text-blue-400"
              >
                About
              </ScrollLink>
            ) : (
              <RouterLink
                to="/aboutpage"
                className="text-white cursor-pointer hover:text-blue-400"
              >
                About
              </RouterLink>
            )}
            {window.location.pathname === "/" ? (
              <ScrollLink
                to="projects"
                smooth={true}
                duration={500}
                offset={-100}
                className="text-white cursor-pointer hover:text-blue-400"
              >
                Projects
              </ScrollLink>
            ) : (
              <RouterLink
                to="/property"
                className="text-white cursor-pointer hover:text-blue-400"
              >
                Projects
              </RouterLink>
            )}

            {window.location.pathname === "/" ? (
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-100}
                className="text-white cursor-pointer hover:text-blue-400"
              >
                Contact
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                className="text-white cursor-pointer hover:text-blue-400"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    scroll.scrollTo("contact", {
                      smooth: true,
                      duration: 500,
                      offset: -100,
                    });
                  }, 100); // Delay scrolling slightly to ensure navigation completes
                }}
              >
                Contact
              </RouterLink>
            )}

            <RouterLink
              to="/worker-page"
              className="text-white cursor-pointer hover:text-blue-400"
            >
              Find A Worker
            </RouterLink>
          </div>

          {/* Profile & Auth Buttons */}
          <div className="ml-auto flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Hi, {currentUser.username}</span>
                <RouterLink
                  to="/profile"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </RouterLink>
              </div>
            ) : (
              <div className="space-x-2">
                <RouterLink to="/login" className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50">
                  Sign In
                </RouterLink>
                <RouterLink to="/signup" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Sign Up
                </RouterLink>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <Bell className="h-6 w-6 text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-2">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-sm">No new notifications</p>
                    ) : (
                      notifications.map((notif, index) => (
                        <div key={notif._id} className="p-2 border-b last:border-none hover:bg-gray-100">
                          <p className="text-sm text-gray-700">{notif.message}</p>
                          <button onClick={() => markAsRead(notif._id)} className="text-blue-500 text-xs">
                            Mark as Read
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-700"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {window.location.pathname === "/" ? (
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                offset={-100}
                className="block px-3 py-2 text-white hover:bg-gray-700"
                onClick={() => {
                  setMenuOpen(false);
                  scroll.scrollToTop({ behavior: "smooth" });
                }}
              >
                Home
              </ScrollLink>
            ) : (
              <RouterLink
                to="/"
                className="block px-3 py-2 text-white hover:bg-gray-700"
                onClick={() => {
                  setMenuOpen(false);
                  navigateToHome();
                }}
              >
                Home
              </RouterLink>
            )}
            <ScrollLink
              to="about"
              smooth={true}
              duration={500}
              offset={-100}
              className="block px-3 py-2 text-white hover:bg-gray-700"
            >
              About
            </ScrollLink>
            <ScrollLink
              to="projects"
              smooth={true}
              duration={500}
              offset={-100}
              className="block px-3 py-2 text-white hover:bg-gray-700"
            >
              Projects
            </ScrollLink>
            <ScrollLink
              to="contact"
              smooth={true}
              duration={500}
              offset={-100}
              className="block px-3 py-2 text-white hover:bg-gray-700"
            >
              Contact
            </ScrollLink>
            {currentUser ? (
              <div className="space-y-1">
                <span className="block px-3 py-2 text-white">
                  Hi, {currentUser.username}
                </span>
                <RouterLink
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-white hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </RouterLink>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-3 py-2">
                <RouterLink
                  to="/login"
                  className="block w-full px-4 py-2 rounded-lg border border-blue-600 text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/signup"
                  className="block w-full px-4 py-2 rounded-lg bg-blue-600 text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </RouterLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
