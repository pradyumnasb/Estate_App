import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
    } else {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }
  };

  return (
    <div className="w-full h-[350px] flex gap-5 sm:h-[280px] relative">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black flex justify-between items-center z-[9999]">
          {/* Left Arrow */}
          <div className="flex-1 flex justify-center items-center cursor-pointer" onClick={() => changeSlide("left")}>
            <ChevronLeft className="w-12 h-12 md:w-8 md:h-8 sm:w-5 sm:h-5 text-white" />
          </div>

          {/* Main Image */}
          <div className="flex-[10]">
            <img src={images[imageIndex]} alt="slide" className="w-full h-full object-cover" />
          </div>

          {/* Right Arrow */}
          <div className="flex-1 flex justify-center items-center cursor-pointer" onClick={() => changeSlide("right")}>
            <ChevronRight className="w-12 h-12 md:w-8 md:h-8 sm:w-5 sm:h-5 text-white" />
          </div>

          {/* Close Icon */}
          <div className="absolute top-0 right-0 text-white text-4xl font-bold p-12 cursor-pointer" onClick={() => setImageIndex(null)}>
            <X className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Main Image Thumbnail */}
      <div className="flex-[3] sm:flex-[2] cursor-pointer">
        <img src={images[0]} alt="main" className="w-full h-full object-cover rounded-xl" onClick={() => setImageIndex(0)} />
      </div>

      {/* Small Thumbnails */}
      <div className="flex-1 flex flex-col justify-between gap-5">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt={`thumbnail-${index}`}
            key={index}
            className="w-full h-[100px] sm:h-[80px] object-cover rounded-xl cursor-pointer"
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
