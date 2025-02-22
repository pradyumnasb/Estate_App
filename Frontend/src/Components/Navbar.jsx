import React, { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // ✅ Import react-scroll
import { Home, Menu, X, User, LogOut } from "lucide-react";
import { AuthContext } from "./Context/AuthContext";

const Navbar = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    updateUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-400" />
            <span className="ml-2 font-bold text-xl text-white">LuxuryEstates</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              spy={true}
              offset={-100}
              className="text-white cursor-pointer hover:text-blue-400"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // ✅ Scrolls to top
            >
              Home
            </ScrollLink>
            <ScrollLink to="about" smooth={true} duration={500} className="text-white cursor-pointer hover:text-blue-400">
              About
            </ScrollLink>
            <ScrollLink to="projects" smooth={true} duration={500} className="text-white cursor-pointer hover:text-blue-400">
              Projects
            </ScrollLink>
            <ScrollLink to="contact" smooth={true} duration={500} className="text-white cursor-pointer hover:text-blue-400">
              Contact
            </ScrollLink>
          </div>

          {/* Profile & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Hi, {currentUser.username}</span>
                <RouterLink to="/profile" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </RouterLink>
                <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-gray-700">
              {menuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <ScrollLink to="home" smooth={true} duration={500} spy={true} offset={-100} className="block px-3 py-2 text-white hover:bg-gray-700">
              Home
            </ScrollLink>
            <ScrollLink to="about" smooth={true} duration={500} className="block px-3 py-2 text-white hover:bg-gray-700">
              About
            </ScrollLink>
            <ScrollLink to="projects" smooth={true} duration={500} className="block px-3 py-2 text-white hover:bg-gray-700">
              Projects
            </ScrollLink>
            <ScrollLink to="contact" smooth={true} duration={500} className="block px-3 py-2 text-white hover:bg-gray-700">
              Contact
            </ScrollLink>
            {currentUser ? (
              <div className="space-y-1">
                <span className="block px-3 py-2 text-white">Hi, {currentUser.username}</span>
                <RouterLink to="/profile" className="block px-3 py-2 rounded-md text-white hover:bg-gray-700">Profile</RouterLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-white hover:bg-gray-700">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-3 py-2">
                <RouterLink to="/login" className="block w-full px-4 py-2 rounded-lg border border-blue-600 text-blue-600">
                  Sign In
                </RouterLink>
                <RouterLink to="/signup" className="block w-full px-4 py-2 rounded-lg bg-blue-600 text-white">
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
