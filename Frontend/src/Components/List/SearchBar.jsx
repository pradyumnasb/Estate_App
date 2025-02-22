import { useState } from "react";
import { MdSearch } from "react-icons/md";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Type Selection Buttons */}
      <div className="flex mb-2 w-full max-w-5xl">
        {types.map((type, index) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`px-10 py-3 border border-gray-400 cursor-pointer capitalize text-lg font-medium shadow-md transition-colors duration-300 
              ${query.type === type ? "bg-black text-white" : "bg-white text-black"}
              ${index === 0 ? "rounded-tl-md border-r-0" : ""}
              ${index === types.length - 1 ? "rounded-tr-md border-l-0" : ""}
              w-1/2 sm:w-auto`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form className="border border-gray-400 flex flex-col lg:flex-row w-full max-w-5xl mt-0">
        <input
          type="text"
          name="location"
          placeholder="City Location"
          className="border-b lg:border-none lg:border-r border-gray-400 px-5 lg:px-6 py-3 lg:py-4 text-white placeholder-gray-300 bg-transparent focus:outline-none w-full lg:w-1/3"
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          className="border-b lg:border-none lg:border-r border-gray-400 px-5 lg:px-6 py-3 lg:py-4 text-white placeholder-gray-300 bg-transparent focus:outline-none w-full lg:w-1/3"
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          className="px-5 lg:px-6 py-3 lg:py-4 text-white placeholder-gray-300 bg-transparent focus:outline-none w-full lg:w-1/3"
        />
        <button className="bg-yellow-400 flex items-center justify-center py-3 lg:py-4 lg:px-6">
          <MdSearch className="w-7 h-7 text-white" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
