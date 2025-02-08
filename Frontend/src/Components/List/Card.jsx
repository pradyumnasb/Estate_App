import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function Card({ item }) {
  return (
    <div className="flex gap-5">
      <Link to={`/${item.id}`} className="flex-2 h-52 hidden md:block">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover rounded-xl"
        />
      </Link>

      <div className="flex-3 flex flex-col justify-between gap-2.5">
        <h2 className="text-xl font-semibold text-gray-700 transition-all duration-300 hover:text-black hover:scale-[1.01]">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>

        <p className="text-sm flex items-center gap-1.5 text-gray-500">
          <LocationOnIcon className="text-gray-500" fontSize="small" />
          <span>{item.address}</span>
        </p>

        <p className="text-xl font-light px-2 py-1 bg-yellow-300/50 rounded-md w-max">
          $ {item.price}
        </p>

        <div className="flex justify-between gap-2.5">
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <BedIcon className="text-gray-600" fontSize="small" />
              <span>{item.bedroom} bedroom</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
              <BathtubIcon className="text-gray-600" fontSize="small" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="border border-gray-400 px-1.5 py-0.5 rounded-md cursor-pointer flex items-center justify-center hover:bg-gray-300">
              <BookmarkBorderIcon className="text-gray-600" fontSize="small" />
            </div>

            <div className="border border-gray-400 px-1.5 py-0.5 rounded-md cursor-pointer flex items-center justify-center hover:bg-gray-300">
              <ChatBubbleOutlineIcon className="text-gray-600" fontSize="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
