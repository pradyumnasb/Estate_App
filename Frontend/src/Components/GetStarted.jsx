import React, { useState } from "react";
import { FaFacebookF, FaGoogle, FaRegEnvelope, FaUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const GetStarted = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to navigate to login page
  const handleNavigateToLogin = () => {
    navigate("/login"); // This will redirect to the login page
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("Registration failed. Please try again.");
    }
    finally{
      setIsLoading(false);
    }
  };

  
 

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/path-to-your-homepage-image.jpg')" }}
    >
      <div className="bg-white shadow-2xl rounded-xl flex w-[90%] max-w-3xl">
        {/* Left Side - Get Started Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mb-6">Join us and get started today!</p>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Username</label>
            <div className="w-full p-3 border rounded-lg mb-4 flex items-center">
              <FaUser className="text-gray-400 mx-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full outline-none"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <label className="text-gray-600 text-sm mb-1">Email</label>
            <div className="w-full p-3 border rounded-lg mb-4 flex items-center">
              <FaRegEnvelope className="text-gray-400 mx-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <label className="text-gray-600 text-sm mb-1">Password</label>
            <div className="w-full p-3 border rounded-lg mb-4 flex items-center">
              <MdLockOutline className="text-gray-400 mx-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button disabled={isLoading} className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
              Sign Up
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <span
              className="text-green-500 hover:underline cursor-pointer"
              onClick={handleNavigateToLogin} // Add the navigation handler here
            >
              Login
            </span>
          </p>
        </div>

        {/* Right Side - Welcome Message */}
        <div className="w-1/2 bg-green-500 flex items-center justify-center rounded-r-xl text-white text-center p-8">
          <div>
            <h2 className="text-2xl font-bold">Welcome to Our Community!</h2>
            <p className="mt-2 text-white text-sm">
              Create an account and start your journey with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
