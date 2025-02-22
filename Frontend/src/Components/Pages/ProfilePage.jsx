import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Chat from "../Profile/Chat";
import List from "../Profile/List";

function ProfilePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Delete Account function
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/users/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      // Remove user data from local storage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (!currentUser) return null; // Prevent rendering before redirect

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-3 mx-16 gap-8">
      {/* Left Side: User Info and Lists */}
      <div className="flex-1 p-8 overflow-y-scroll scrollbar-hide bg-white rounded-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">User Information</h1>
        </div>

        <div className="flex flex-col gap-5 mt-4">
          <span className="flex items-center gap-5">
            Username: <b>{currentUser?.username || "Guest"}</b>
          </span>
          <span className="flex items-center gap-5">
            E-mail: <b>{currentUser?.email || "Not available"}</b>
          </span>
        </div>

        {/* Buttons: Delete Account & Update Profile */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white cursor-pointer border-none rounded-md text-sm"
          >
            Delete Account
          </button>

          <button
            onClick={() => navigate("/profile/update")}
            className="px-4 py-2 bg-blue-500 text-white cursor-pointer border-none rounded-md text-sm"
          >
            Update Profile
          </button>
        </div>

        {/* My List Section */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <h1 className="text-2xl font-semibold">My List</h1>
          <button className="px-4 py-2 bg-yellow-400 cursor-pointer border-none rounded-md text-sm">
            Create New Post
          </button>
        </div>

        <List />

        {/* Saved List Section */}
        <div className="flex items-center justify-between mt-10 mb-6">
          <h1 className="text-2xl font-semibold">Saved List</h1>
        </div>

        <List />
      </div>

      {/* Right Side: Chat Section */}
      <div className="w-1/3 h-full sticky top-56 mt-3">
        <Chat />
      </div>
    </div>
  );
}

export default ProfilePage;
