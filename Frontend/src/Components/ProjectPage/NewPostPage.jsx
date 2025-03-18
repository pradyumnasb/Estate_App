import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Upload,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  School,
  Bus,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

function NewPostPage() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    desc: "",
    title: "",
    price: "0",
    address: "",
    city: "",
    bedroom: "0",
    bathroom: "0",
    latitude: "0",
    longitude: "0",
    size: "0",
    school: "0",
    bus: "0",
    restaurant: "0",
    type: "rent",
    property: "apartment",
    utilities: "owner",
    pet: "allowed",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }
  
    // Ensure latitude & longitude are valid
    const latitude = parseFloat(formData.latitude) || 0;
    const longitude = parseFloat(formData.longitude) || 0;
    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Invalid latitude or longitude values.");
      setLoading(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
  
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        let value = formData[key];
  
        if (
          ["latitude", "longitude", "price", "bedroom", "bathroom", "size", "school", "bus", "restaurant"].includes(key)
        ) {
          value = parseFloat(value) || 0; // Ensure valid numbers
        }
  
        formDataToSend.append(key, value);
      });
  
      // ✅ Ensure description is included properly
      formDataToSend.append("desc", formData.desc.trim() || "");
  
      // ✅ Ensure pet policy is included
      formDataToSend.append("pet", formData.pet.trim());
  
      // ✅ Ensure `postDetail` is included (if required)
      formDataToSend.append("postDetail", formData.postDetail || "");
  
      // ✅ Append images correctly
      images.forEach((image) => {
        formDataToSend.append("images", image.file || image);
      });
  
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      const response = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // No Content-Type for FormData
        body: formDataToSend,
      });
  
      const data = await response.json();

    if (!response.ok || !data.post) {
      throw new Error(data.message || "Failed to create listing");
    }

    const newPostId = data.post._id; // Now safely accessing `_id`
    alert("Listing created successfully!");
    navigate(`/property/${newPostId}`);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + images.length > 10) {
      setError("You can only upload up to 10 images.");
      return;
    }

    // Validate file types
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const inputFields = [
    {
      label: "Title",
      id: "title",
      type: "text",
      icon: <Home className="w-5 h-5" />,
      required: true,
    },
    {
      label: "Price",
      id: "price",
      type: "number",
      icon: <DollarSign className="w-5 h-5" />,
      min: 0,
      required: true,
    },
    {
      label: "Address",
      id: "address",
      type: "text",
      icon: <MapPin className="w-5 h-5" />,
      required: true,
    },
    {
      label: "City",
      id: "city",
      type: "text",
      icon: <MapPin className="w-5 h-5" />,
      required: true,
    },
    {
      label: "Bedroom",
      id: "bedroom",
      type: "number",
      icon: <Bed className="w-5 h-5" />,
      min: 1,
      required: true,
    },
    {
      label: "Bathroom",
      id: "bathroom",
      type: "number",
      icon: <Bath className="w-5 h-5" />,
      min: 1,
      required: true,
    },
    {
      label: "Latitude",
      id: "latitude",
      type: "number", // ✅ Fix: Change to number
      icon: <MapPin className="w-5 h-5" />,
      required: true,
    },
    {
      label: "Longitude",
      id: "longitude",
      type: "number", // ✅ Fix: Change to number
      icon: <MapPin className="w-5 h-5" />,
      required: true,
    },
    {
      label: "Total Size (sqft)",
      id: "size",
      type: "number",
      icon: <Ruler className="w-5 h-5" />,
      min: 0,
      required: true,
    },
    {
      label: "School Distance (km)",
      id: "school",
      type: "number",
      icon: <School className="w-5 h-5" />,
      min: 0,
      required: true,
    },
    {
      label: "Bus Stop Distance (km)",
      id: "bus",
      type: "number",
      icon: <Bus className="w-5 h-5" />,
      min: 0,
      required: true,
    },
    {
      label: "Restaurant Distance (km)",
      id: "restaurant",
      type: "number",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      min: 0,
      required: true,
    },
  ];

  const selectFields = [
    {
      label: "Type",
      id: "type",
      options: [
        { value: "rent", label: "For Rent" },
        { value: "buy", label: "For Sale" },
      ],
    },
    {
      label: "Property",
      id: "property",
      options: [
        { value: "apartment", label: "Apartment" },
        { value: "house", label: "House" },
        { value: "condo", label: "Condo" },
        { value: "land", label: "Land" },
      ],
    },
    {
      label: "Utilities Policy",
      id: "utilities",
      options: [
        { value: "owner", label: "Included in Rent" },
        { value: "tenant", label: "Paid by Tenant" },
        { value: "shared", label: "Shared" },
      ],
    },
    {
      label: "Pet Policy",
      id: "pet",
      options: [
        { value: "allowed", label: "Pets Allowed" },
        { value: "not-allowed", label: "No Pets" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Create New Listing
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Property Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={image.preview}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Upload up to 10 high-quality images of your property
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inputFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label
                      htmlFor={field.id}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      {field.icon}
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      min={field.min}
                      required={field.required}
                      value={formData[field.id]} // ✅ Controlled input
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      } // ✅ Update state
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <select
                      id={field.id}
                      name={field.id} // Ensure the name attribute is set
                      value={formData[field.id] || ""} // Handle undefined values safely
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="desc"
                    name="desc"
                    value={formData.desc || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                    placeholder="Describe your property in detail..."
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {formData.desc?.length || 0} characters
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-sm transition duration-200 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                }`}
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
