import React, { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";

function HireWorkerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    address: "",
    problemDescription: "",
    phoneNumber: "",
  });
  const [bookingStatus, setBookingStatus] = useState({}); // Store worker booking statuses

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/workers/");
        const data = await response.json();
        setWorkers(data);
  
        // Fetch booking status for each worker
        data.forEach(worker => {
          fetchBookingStatus(worker._id);
        });
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
  
    fetchWorkers();
  }, []);

  const fetchBookingStatus = async (workerId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  
    if (!storedUser || !token) return;
  
    try {
      const response = await fetch(
        `http://localhost:4000/api/bookings/status/${workerId}/${storedUser._id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
      setBookingStatus((prev) => ({
        ...prev,
        [workerId]: data.status || "none",
      }));
    } catch (error) {
      console.error("Error fetching booking status:", error);
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.userId.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      worker.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || worker.category === selectedCategory;

    const matchesPriceRange =
      priceRange === "all" ||
      (priceRange === "low" && worker.hourly_rate <= 55) ||
      (priceRange === "medium" &&
        worker.hourly_rate > 55 &&
        worker.hourly_rate <= 65) ||
      (priceRange === "high" && worker.hourly_rate > 65);

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const confirmBooking = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); 
  
    console.log("Token from LocalStorage:", token); 
  
    if (!storedUser || !token) {
      alert("User not logged in. Please log in first.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Include token here
        },
        body: JSON.stringify({
          workerId: selectedWorker,
          userId: storedUser._id,
          date: appointment.date,
          time: appointment.time,
          address: appointment.address,
          phoneNumber: appointment.phoneNumber,
          problemDescription: appointment.problemDescription,
        }),
      });
  
      const data = await response.json();
      console.log("Response:", data); // 🔥 Debugging
  
      if (response.ok) {
        alert("Booking request sent successfully!");
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  

  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-400">
            Find Trusted Professionals
          </h1>
          <p className="text-gray-300 mt-2">
            Licensed, vetted, and ready to help with your home needs
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex justify-center mb-8 gap-4">
          <div className="flex items-center bg-gray-800 rounded-lg shadow-md p-3 w-full max-w-xl">
            <Search className="w-6 h-6 text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search services or professionals..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-800 text-white p-2 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="gardening">Gardening</option>
            <option value="painting">Painting</option>
          </select>
          <select
            className="bg-gray-800 text-white p-2 rounded-lg"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="low">Low ($0 - $55)</option>
            <option value="medium">Medium ($56 - $65)</option>
            <option value="high">High ($66+)</option>
          </select>
        </div>

        {/* Worker List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker._id}
              className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <img
                  src={worker.profileImage || "https://via.placeholder.com/150"}
                  alt={worker.userId.username}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {worker.userId.username}
                  </h3>
                  <p className="text-indigo-400 capitalize">
                    {worker.category}
                  </p>
                  <p className="text-gray-300">Email: {worker.userId.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-300">
                  Experience: {worker.experience} years
                </p>
                <p className="text-gray-300">
                  Hourly Rate: ${worker.hourly_rate}/hr
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {worker.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hire Button */}
              {selectedWorker !== worker._id && (
                <button
                className={`w-full py-2 rounded-md transition duration-300 mt-4 ${
                  bookingStatus[worker._id] === "pending"
                    ? "bg-yellow-500 text-white"
                    : bookingStatus[worker._id] === "accepted"
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                disabled={bookingStatus[worker._id] === "pending"} // Disable if pending
                onClick={() => setSelectedWorker(worker._id)}
              >
                {bookingStatus[worker._id] === "pending"
                  ? "Pending"
                  : bookingStatus[worker._id] === "accepted"
                  ? "Accepted"
                  : "Hire a Professional"}
              </button>              
              )}
              {/* Appointment Form */}
              {selectedWorker === worker._id && (
                <div className="bg-gray-700 p-4 rounded-lg mt-4">
                  <h4 className="text-white font-semibold mb-3">
                    Schedule Service
                  </h4>
                  <div className="space-y-3">
                    {/* Date */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="bg-gray-600 text-white w-full px-3 py-2 rounded-md focus:outline-none"
                        min={new Date().toISOString().split("T")[0]}
                        value={appointment.date}
                        onChange={(e) =>
                          setAppointment({
                            ...appointment,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className="bg-gray-600 text-white w-full px-3 py-2 rounded-md focus:outline-none"
                        value={appointment.time}
                        onChange={(e) =>
                          setAppointment({
                            ...appointment,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        className="bg-gray-600 text-white w-full px-3 py-2 rounded-md focus:outline-none"
                        placeholder="Enter your address"
                        value={appointment.address}
                        onChange={(e) =>
                          setAppointment({
                            ...appointment,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Problem Description */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Explain Your Problem
                      </label>
                      <textarea
                        className="bg-gray-600 text-white w-full px-3 py-2 rounded-md focus:outline-none"
                        placeholder="Describe your issue..."
                        value={appointment.problemDescription}
                        onChange={(e) =>
                          setAppointment({
                            ...appointment,
                            problemDescription: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="bg-gray-600 text-white w-full px-3 py-2 rounded-md focus:outline-none"
                        placeholder="Enter your phone number"
                        value={appointment.phoneNumber}
                        onChange={(e) =>
                          setAppointment({
                            ...appointment,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Confirm & Cancel */}
                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                        onClick={confirmBooking}
                      >
                        Confirm Booking
                      </button>

                      <button className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300">
                        Request a Call Back
                      </button>
                      <button
                        className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-500 transition duration-300"
                        onClick={() => setSelectedWorker(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No professionals found.
          </p>
        )}
      </div>
    </div>
  );
}

export default HireWorkerPage;
