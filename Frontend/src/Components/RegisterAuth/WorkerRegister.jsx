import React, { useState, useRef } from "react";
import { Briefcase, Upload, XCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkerRegister() {
  const navigate = useNavigate();


  const [specialty, setSpecialty] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input field

  const [formData, setFormData] = useState({
    category: "plumbing",
    hourly_rate: "",
    experience: "",
    specialties: [],
    profileImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setImagePreview(null);

    // Reset file input value (this is the fix!)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddSpecialty = () => {
    if (specialty.trim() && !formData.specialties.includes(specialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty.trim()],
      }));
      setSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workerData = new FormData();
    workerData.append("category", formData.category);
    workerData.append("hourly_rate", formData.hourly_rate);
    workerData.append("experience", formData.experience);
    workerData.append("profileImage", formData.profileImage);

    formData.specialties.forEach((specialty, index) => {
      workerData.append(`specialties[${index}]`, specialty);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/workers/register",
        workerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Worker registered:", response.data);
      alert("Worker profile created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error registering worker:", error.response?.data || error);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center mb-8">
            <Briefcase className="w-8 h-8 text-indigo-500 mr-4" />
            <h1 className="text-3xl font-bold text-white">Register as a Professional</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="plumbing">Plumber</option>
              <option value="electrical">Electrician</option>
              <option value="gardening">Gardener</option>
              <option value="painting">Painter</option>
            </select>

            <input
              type="number"
              name="hourly_rate"
              placeholder="Hourly Rate ($)"
              value={formData.hourly_rate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />

            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />

            <div>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Add a specialty"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialties.map((spec, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full flex items-center"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(index)}
                    className="ml-2 text-gray-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <label className="block text-white">Upload Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef} // Added ref to reset input
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-gray-800 text-red-500 rounded-full p-1"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md flex items-center justify-center"
            >
              <Upload className="h-5 w-5 mr-2" /> Register as Professional
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkerRegister;
