import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Edit2, X } from "lucide-react";

export default function ProfileUpdate() {
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  };

  const currentUser = getUserFromStorage();

  const [profile, setProfile] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    newPassword: "",
  });

  const [editing, setEditing] = useState({
    username: false,
    email: false,
    password: false,
  });

  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        username: currentUser.username,
        email: currentUser.email,
      }));
    }
  }, []);

  const handleEdit = (field) => {
    setEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (editing[field] && currentUser) {
      setProfile((prev) => ({
        ...prev,
        [field]: currentUser[field] || "",
      }));
    }
  };

  const handleUpdate = async (field) => {
    if (!currentUser?._id) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");
    const updateData = { [field]: profile[field] };

    console.log("Updating field:", field);
    console.log("Request Data:", updateData);
    console.log("User ID:", currentUser._id);

    try {
      const res = await fetch(`http://localhost:4000/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditing((prev) => ({ ...prev, [field]: false }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg mt-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Profile Settings
      </h2>
      <div className="space-y-6">
        {["username", "email", "password"].map((field) => (
          <div key={field} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <button
                onClick={() => handleEdit(field)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {editing[field] ? <X className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
              </button>
            </div>
            {editing[field] ? (
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field === "username" ? (
                      <User className="h-5 w-5 text-gray-400" />
                    ) : field === "email" ? (
                      <Mail className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type={field.includes("password") ? "password" : "text"}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={profile[field]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                  />
                </div>
                <button
                  onClick={() => handleUpdate(field)}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Update {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-600">
                {field === "username" ? (
                  <User className="h-5 w-5" />
                ) : field === "email" ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
                <span>{field === "password" ? "••••••••" : profile[field]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
