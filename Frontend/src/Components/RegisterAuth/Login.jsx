import React, { useState, useContext } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext"; 

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      
      const { user, token } = res.data;

      
      const { password, ...safeUserData } = user;

      updateUser(safeUserData); 
      localStorage.setItem("user", JSON.stringify(safeUserData)); 
      localStorage.setItem("token", token); // Store token

      navigate("/");
      console.log("Login successful:", safeUserData);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/path-to-your-homepage-image.jpg')" }}
    >
      <div className="bg-white shadow-2xl rounded-xl flex w-[90%] max-w-3xl">
        
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-gray-500 mb-6">Welcome back! Please login to your account.</p>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
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

            <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-4">
            Don't have an account?{" "}
            <span
              className="text-green-500 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>

        <div className="w-1/2 bg-green-500 flex items-center justify-center rounded-r-xl text-white text-center p-8">
          <div>
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="mt-2 text-white text-sm">Login and continue your journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
