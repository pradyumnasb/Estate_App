import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";

function Card({ item, onDelete }) {
  const { currentUser } = useContext(AuthContext);

  if (!item) {
    console.error("Card component received undefined item");
    return <p className="text-red-500">Error: Invalid property data</p>;
  }

  const isOwner = currentUser && currentUser._id === (item?.user || item?.userId);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${item._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      onDelete(item._id); // ✅ Remove post from UI
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="relative flex gap-5 border p-4 rounded-lg shadow-md">
      <Link to={`/property/${item._id || "#"}`} className="flex-2 h-52 hidden md:block">
        <img
          src={item.images?.length > 0 ? item.images[0] : "/default-image.jpg"} 
          alt={item.title || "Property Image"}
          className="w-full h-full object-cover rounded-xl"
        />
      </Link>

      <div className="flex-3 flex flex-col justify-between gap-2.5">
        <h2 className="text-xl font-semibold text-gray-700 transition-all duration-300 hover:text-black hover:scale-[1.01]">
          <Link to={`/property/${item._id || "#"}`}>{item.title || "No title available"}</Link>
        </h2>

        <p className="text-sm flex items-center gap-1.5 text-gray-500">
          <LocationOnIcon className="text-gray-500" fontSize="small" />
          <span>{item.city || "Unknown City"}, {item.address || "Unknown Address"}</span>
        </p>

        <p className="text-xl font-light px-2 py-1 bg-yellow-300/50 rounded-md w-max">
          $ {item.price || "N/A"}
        </p>

        <div className="flex justify-between gap-2.5">
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <BedIcon className="text-gray-600" fontSize="small" />
              <span>{item.bedroom ?? "N/A"} bedroom{item.bedroom > 1 ? "s" : ""}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <BathtubIcon className="text-gray-600" fontSize="small" />
              <span>{item.bathroom ?? "N/A"} bathroom{item.bathroom > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* ✅ Show delete button only for owner */}
        {isOwner && (
          <button 
            onClick={handleDelete} 
            className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
