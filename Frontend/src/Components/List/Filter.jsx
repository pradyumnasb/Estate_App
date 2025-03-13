import { useState } from "react";
import { MdSearch } from "react-icons/md";

function Filter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    property: "",
    minPrice: "",
    maxPrice: "",
    bedroom: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters); // Pass the filters to parent (ListPage)
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <h1 className="font-light text-2xl">
        Search results for <b>{filters.city || "All Locations"}</b>
      </h1>

      <div className="w-full">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="city" className="text-xs">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            value={filters.city}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="type" className="text-xs">Type</label>
          <select
            name="type"
            id="type"
            value={filters.type}
            onChange={handleChange}
            className="w-24 p-2.5 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="property" className="text-xs">Property</label>
          <select
            name="property"
            id="property"
            value={filters.property}
            onChange={handleChange}
            className="w-24 p-2.5 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="minPrice" className="text-xs">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Any"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-24 p-2.5 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="maxPrice" className="text-xs">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-24 p-2.5 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="bedroom" className="text-xs">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            value={filters.bedroom}
            onChange={handleChange}
            className="w-24 p-2.5 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <button type="submit" className="w-24 p-2.5 border-none cursor-pointer bg-yellow-400 rounded-md flex items-center justify-center">
          <MdSearch className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}

export default Filter;
