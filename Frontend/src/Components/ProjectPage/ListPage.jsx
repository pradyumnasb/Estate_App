import { useEffect, useState } from "react";
import Filter from "./Filter";
import Card from "./Card";
import Map from "./Map";



function ListPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // Store filter values

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:4000/api/posts?${queryString}`);
      
      if (!response.ok) throw new Error("Failed to fetch listings");
      
      const data = await response.json();
      setListings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings when filters change
  useEffect(() => {
    fetchListings();
  }, [filters]); // Re-run fetch when filters change

  // Handle filter submission
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters, // Merge new filters with existing ones
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] mt-4 px-4 gap-4">
      {/* Left Side: Filter and Listings */}
      <div className="flex flex-col gap-8 w-full lg:w-1/2 p-5 overflow-y-scroll scrollbar-hide bg-white rounded-2xl shadow-md">
        <Filter onFilterChange={handleFilterChange} />
        
        {loading ? (
          <p>Loading properties...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col gap-12">
            {listings.length > 0 ? (
              listings.map((item) => <Card key={item._id} item={item} />)
            ) : (
              <p>No properties found</p>
            )}
          </div>
        )}
      </div>

      {/* Right Side: Map */}
      <div className="w-full lg:w-[48%] h-full sticky top-16 p-2 bg-white rounded-2xl shadow-md">
        <Map items={listings} />
      </div>
    </div>
  );
}

export default ListPage;
