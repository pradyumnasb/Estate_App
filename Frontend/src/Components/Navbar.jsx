import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser && storedUser.trim() !== "") {
      setIsLoggedIn(true);
      setUsername(storedUser);
    }
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-cover bg-center shadow-md z-50" style={{ backgroundImage: 'url(./nav.png)' }}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <a href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
          <span className="hidden md:inline">Estate</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-white ml-16">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
          <Link to="/agents" className="hover:text-gray-300">Agents</Link>
        </ul>

        {/* Buttons */}
        <div className="hidden md:flex gap-4 items-center -ml-8">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold hidden sm:inline">Hi, {username}</span>
              <Link to="/profile" className="relative bg-blue-500 px-5 py-2 rounded-full hover:bg-blue-600 text-white cursor-pointer">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  3
                </div>
                Profile
              </Link>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="bg-white px-5 py-2 rounded-full hover:bg-gray-200 text-black">Sign in</Link>
              <Link to="/signup" className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <img src="./menu_icon.svg" alt="Menu" className="w-9 h-9 invert" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col text-center bg-transparent py-4 shadow-lg text-white">
          <Link to="/" className="py-2 hover:text-gray-500">Home</Link>
          <Link to="/about" className="py-2 hover:text-gray-500">About</Link>
          <Link to="/contact" className="py-2 hover:text-gray-500">Contact</Link>
          <Link to="/agents" className="py-2 hover:text-gray-500">Agents</Link>
          {isLoggedIn ? (
            <>
              <span className="py-2 font-semibold">Hi, {username}</span>
              <Link to="/profile" className="py-2 hover:text-gray-500">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 hover:text-gray-500">Sign in</Link>
              <Link to="/signup" className="py-2 hover:text-gray-500">Sign up</Link>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
