import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext"; // Import AuthContext
import Slider from "../List/Slider";
import ChatPopUp from "../ProfilePage/ChatPopup";
import Map from "./Map";
import {
  MdLocationOn,
  MdOutlinePets,
  MdOutlineAttachMoney,
  MdChat,
  MdBookmark,
  MdAspectRatio,
  MdHotel,
  MdBathtub,
  MdSchool,
  MdDirectionsBus,
  MdRestaurant,
  MdHome,
} from "react-icons/md";

function SinglePage() {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);  // ✅ Added missing state
  const [chatId, setChatId] = useState(null); // ✅ Added chatId state
  const [messages, setMessages] = useState([]);


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?._id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/posts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch property details.");
        const data = await response.json();
        setPost(data);
  
        console.log("Fetched post data:", data); // Debugging log
  
        if (userId && token) {
          checkIfSaved(data._id); // ✅ Ensures saved status updates after post is fetched
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const checkIfSaved = async (postId) => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch saved posts");
  
        const savedPosts = await res.json();
        console.log("Saved Posts:", savedPosts); // Debugging log
  
        // ✅ Check if the current post is in the saved list and update state
        const isSaved = savedPosts.some((savedPost) => savedPost._id === postId);
        console.log("Is Post Saved?", isSaved);
        setSaved(isSaved); // 🔥 This updates the button correctly after refresh
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setSaved(false); // ❌ Ensures saved state does not stay undefined
      }
    };
  
    if (id) {
      fetchPost();
    }
  }, [id, userId, token]); // ✅ Dependencies to re-run on changes
  
  

  useEffect(() => {

    if (showChat && post?.chatId) {
      fetchChats();
    }
  }, [showChat, post?.chatId]);

  const fetchChats = async () => {
    if (!post?.chatId) {
      console.warn("No chatId available. Skipping fetch.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/chats/${post.chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Log error response
        console.error("Fetch error:", response.status, errorText);
        return;
      }

      const data = await response.json();
      console.log("Fetched chat data:", data);

      if (data.messages) {
        setMessages(data.messages);
      } else {
        console.log("No messages found.");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
};


  // Check if the post is already saved (from backend)
  const checkIfSaved = async () => {
    if (!userId || !token) return; // Ensure user is logged in

    try {
      const response = await fetch(`http://localhost:4000/api/posts/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch saved posts: ${response.statusText}`);
      }

      const savedPosts = await response.json();

      if (!Array.isArray(savedPosts)) {
        console.error("Unexpected response format:", savedPosts);
        return;
      }

      // Check if the current post ID exists in the saved posts
      setSaved(savedPosts.some(({ _id }) => _id === id));
    } catch (error) {
      console.error("Error checking saved posts:", error);
    }
  };

  const handleStartChat = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ postId: id }), // ✅ Corrected postId reference
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      console.log("Chat started:", data);

      // ✅ Store chat ID and show chat popup
      setChatId(data._id);
      setShowChat(true);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };
  

  // Handle saving/unsaving a post
  const handleSavePost = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/posts/save/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
      const data = await res.json();
      console.log("Save response:", data);
  
      setSaved(data.saved); // ✅ Update saved state based on backend response
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  
  

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center">No property found.</p>;

  return (
    <div className="flex flex-col lg:flex-row h-full md:overflow-auto gap-8 pt-10 px-8">
      {/* Left Section: Images and Details */}
      <div className="flex-1 h-full overflow-auto md:h-auto md:mb-12">
        <Slider images={post.images || []} />
        <div className="flex flex-col mt-7 md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MdLocationOn className="w-5 h-5 text-blue-500" />
              <span>{post.address}</span>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="px-4 py-2 bg-blue-100 rounded-lg text-2xl font-bold text-blue-800">
              ${post.price.toLocaleString()}
              {post.type === "rent" ? "/month" : ""}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <MdHotel className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-lg font-semibold">{post.bedroom}</span>
              <span className="text-sm text-gray-500">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <MdBathtub className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-lg font-semibold">{post.bathroom}</span>
              <span className="text-sm text-gray-500">Bathrooms</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <MdAspectRatio className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-lg font-semibold">
                {post.postDetail?.size || "N/A"}
              </span>
              <span className="text-sm text-gray-500">Sq Ft</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <MdHome className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-lg font-semibold capitalize">
                {post.type}
              </span>
              <span className="text-sm text-gray-500">Property Type</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {post.postDetail?.desc || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Features and User Info */}
      <div className="w-full lg:w-1/3 bg-[#fcf5f3] h-full overflow-auto md:h-auto md:mb-12 p-5 space-y-6">
        {/* General Features */}
        <div>
          <h2 className="font-bold text-lg mb-3">General</h2>
          <div className="bg-white p-4 rounded-lg space-y-4">
            {[
              {
                icon: <MdOutlineAttachMoney />,
                title: "Utilities",
                desc: post.postDetail?.utilities || "N/A",
              },
              {
                icon: <MdOutlinePets />,
                title: "Pet Policy",
                desc: post.postDetail?.pet || "Not Allowed",
              },
            ].map((feature, index) => (
              <div className="flex items-center gap-3" key={index}>
                <div className="w-6 h-6 bg-yellow-300/20 p-1 rounded flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-bold">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div>
          <h2 className="font-bold text-lg mb-3">Nearby Places</h2>
          <div className="space-y-4">
            {[
              {
                icon: <MdSchool />,
                title: "School",
                desc: `${post.postDetail?.school || "N/A"}m away`,
              },
              {
                icon: <MdDirectionsBus />,
                title: "Bus Stop",
                desc: `${post.postDetail?.bus || "N/A"}m away`,
              },
              {
                icon: <MdRestaurant />,
                title: "Restaurant",
                desc: `${post.postDetail?.restaurant || "N/A"}m away`,
              },
            ].map((place, index) => (
              <div
                className="flex items-center gap-3 bg-white p-4 rounded-lg"
                key={index}
              >
                <div className="w-6 h-6 bg-yellow-300/20 p-1 rounded flex items-center justify-center">
                  {place.icon}
                </div>
                <div>
                  <p className="font-bold">{place.title}</p>
                  <p className="text-sm text-gray-600">{place.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <h2 className="font-bold text-lg">Location</h2>
          <div className="relative w-full h-52 rounded-lg overflow-hidden">
            <Map items={[post]} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 pt-8">
          <button
            onClick={handleStartChat}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-yellow-300 rounded-lg text-sm hover:bg-yellow-50"
          >
            <MdChat />
            {showChat ? "Close Chat" : "Send a Message"}
          </button>

          <button
            onClick={handleSavePost}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg text-sm ${
              saved
                ? "bg-yellow-400 text-white"
                : "bg-white border-yellow-300 hover:bg-yellow-50"
            }`}
          >
            <MdBookmark />
            {saved ? "Saved" : "Save the Place"}
          </button>
        </div>

        {/* Chat Popup */}
        {showChat && chatId && (
          <ChatPopUp
            chatId={chatId}
            userId={currentUser?._id}
            messages={[]} // Initially empty, will be fetched inside ChatPopUp
            onClose={() => setShowChat(false)}
            onSendMessage={handleStartChat}
          />
        )}
      </div>
    </div>
  );
}

export default SinglePage;
