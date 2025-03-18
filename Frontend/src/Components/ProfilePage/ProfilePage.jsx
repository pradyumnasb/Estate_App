import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Chat from "./Chat";
import List from "./List";
import { LogOut } from "lucide-react"; 



function ProfilePage() {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]); // User's uploaded posts
  const [savedPosts, setSavedPosts] = useState([]); // User's saved posts
  const [loadingSavedPosts, setLoadingSavedPosts] = useState(true);
  const [workerDetails, setWorkerDetails] = useState(null);
  const { currentUser, updateUser } = useContext(AuthContext);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      fetchMyPosts();
      fetchSavedPosts();
      fetchWorkerDetails();
    }
  }, [currentUser, navigate]);

  

  // ✅ Function to remove notification after acknowledgment
  const handleAcknowledge = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };


  // Fetch the posts uploaded by the user
  const fetchMyPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/user/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user posts");

      const data = await response.json();
      setMyPosts(data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  // Fetch the saved posts by the user
  const fetchSavedPosts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("🚨 No token found in localStorage");
      return;
    }

    setLoadingSavedPosts(true); // Start loading state

    try {
      const res = await fetch(`http://localhost:4000/api/posts/saved`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📩 Response Status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch saved posts");
      }

      const data = await res.json();

      setSavedPosts(data);
    } catch (error) {
      console.error("❌ Error fetching saved posts:", error);
      alert(error.message); // Display error message to the user
    } finally {
      setLoadingSavedPosts(false); // Stop loading state
    }
  };

  const fetchWorkerDetails = async () => {
    console.log("Fetching worker details..."); // ✅ Debug Log
    try {
      const res = await fetch(
        `http://localhost:4000/api/workers/${currentUser._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Worker Data:", data); // ✅ Check what you receive
        setWorkerDetails(data);
      } else {
        console.warn("Worker profile not found");
        setWorkerDetails(null);
      }
    } catch (error) {
      console.error("Error fetching worker details:", error);
      setWorkerDetails(null);
    }
  };

  // Handle post save/unsave action
  const handleSaveToggle = async (postId) => {
    try {
      // Check if the post is already saved
      const isAlreadySaved = savedPosts.some((post) => post._id === postId);

      // If it's already saved, unsave it
      if (isAlreadySaved) {
        setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        // Save the post
        const response = await fetch(
          `http://localhost:4000/api/posts/save/${postId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to update saved post");

        const result = await response.json();

        // After saving, fetch the post details
        const savedPostResponse = await fetch(
          `http://localhost:4000/api/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!savedPostResponse.ok)
          throw new Error("Failed to fetch saved post details");

        const savedPost = await savedPostResponse.json();
        setSavedPosts((prev) => [...prev, savedPost]); // Add post to saved list
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

   const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      updateUser(null);
      navigate("/login");
    };

  // Delete Account function
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:4000/api/users/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    <div className="flex h-[calc(100vh-4rem)] mt-3 mx-16  gap-8">

      {/* Left Side: User Info & Listings */}
      <div className="flex-1 p-8 overflow-y-scroll scrollbar-hide bg-white rounded-2xl">
        {/* User & Worker Info in one row */}
        <div className="flex justify-between">
          {/* User Info */}
          <div className="w-1/2">
            <h1 className="text-2xl font-semibold">User Information</h1>
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
              <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
            </div>
          </div>

          {/* Worker Info on the right */}
          <div className="w-1/2  bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">Worker Information</h2>
            {workerDetails ? (
              <div className="mt-4">
                <p>
                  <b>Profession:</b> {workerDetails?.category}
                </p>
                <p>
                  <b>Experience:</b> {workerDetails?.experience} years
                </p>
                <p>
                  <b>Hourly Rate:</b> ${workerDetails?.hourly_rate}
                </p>
              </div>
            ) : (
              <button onClick={() => navigate("/register-worker")}>
                Register as Worker
              </button>
            )}
          </div>
        </div>

        {/* My Listings Section */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <h1 className="text-2xl font-semibold">My Listings</h1>
          <button
            onClick={() => navigate("/new-post")}
            className="px-4 py-2 bg-yellow-400 cursor-pointer border-none rounded-md text-sm"
          >
            Create New Post
          </button>
        </div>

        {/* Show only the user's uploaded posts */}
        <List fetchType="user" posts={myPosts} />

        {/* Saved Properties Section */}
        <div className="flex items-center justify-between mt-10 mb-6">
          <h1 className="text-2xl font-semibold">Saved Properties</h1>
        </div>

        {/* Show saved posts or a "No saved posts" message */}
        {savedPosts.length > 0 ? (
          <List posts={savedPosts} onSaveToggle={handleSaveToggle} />
        ) : (
          <p className="text-gray-500 text-center">No saved posts yet.</p>
        )}
      </div>

      {/* Right Side: Chat Section */}
      <div className="w-1/3 h-full sticky top-56 mt-3">
        <Chat userId={currentUser?._id} />
      </div>
    </div>
  );
}

export default ProfilePage;
