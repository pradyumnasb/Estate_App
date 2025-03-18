import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Edit2, X } from "lucide-react";

export default function ProfileUpdate() {
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const currentUser = getUserFromStorage();

  const [profile, setProfile] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    currentPassword: "",
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
  };

  const handleUpdate = async (field) => {
    if (!currentUser?._id) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");
    let updateData = {};

    if (field === "password") {
      if (!profile.currentPassword || !profile.newPassword) {
        alert("Please enter your current and new password.");
        return;
      }
      updateData = {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword,
      };
    } else {
      updateData = { [field]: profile[field] };
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/users/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await res.json();
      console.log("Update Response:", result); // Log response for debugging

      if (!res.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      localStorage.setItem("user", JSON.stringify(result));
      setEditing((prev) => ({ ...prev, [field]: false }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Update Profile
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Make changes to your profile information below
          </p>
        </div>

        <div className="space-y-6">
          {["username", "email", "password"].map((field) => (
            <div key={field} className="relative space-y-2">
              <label htmlFor={field} className="sr-only">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <div className="relative">
                {field === "password" ? (
                  <>
                    {/* Current Password */}
                    <div className="relative">
                      <input
                        type="password"
                        className="block w-full pl-12 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="Current Password"
                        value={profile.currentPassword}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      <div className="absolute inset-y-0 left-4 flex items-center">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="relative mt-2">
                      <input
                        type="password"
                        className="block w-full pl-12 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        placeholder="New Password"
                        value={profile.newPassword}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <div className="absolute inset-y-0 left-4 flex items-center">
                        <Lock className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </>
                ) : (
                  <input
                    type="text"
                    className="block w-full pl-12 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={profile[field]}
                    onChange={(e) =>
                      setProfile({ ...profile, [field]: e.target.value })
                    }
                    disabled={!editing[field]}
                  />
                )}
              </div>

              {/* Edit and Save Buttons */}
              <div className="flex justify-end space-x-2">
                {editing[field] && (
                  <button
                    onClick={() => handleUpdate(field)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => handleEdit(field)}
                  className="absolute right-3 top-3 text-indigo-400 hover:text-indigo-300"
                >
                  {editing[field] ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Edit2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => handleUpdate("password")}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Save className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
