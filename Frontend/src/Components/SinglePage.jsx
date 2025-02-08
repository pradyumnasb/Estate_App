import Slider from "../Components/List/Slider";
import Map from "../Components/List/Map";
import { singlePostData, userData } from "../Components/LIB/DummyData";
import { MdLocationOn, MdOutlinePets, MdOutlineAttachMoney, MdAspectRatio, MdHotel, MdBathtub, MdSchool, MdDirectionsBus, MdRestaurant, MdChat, MdBookmark } from "react-icons/md";

function SinglePage() {
  return (
    <div className="flex flex-col lg:flex-row h-full md:overflow-auto gap-8 p-4 pt-20 px-8">
      {/* Left Section: Images and Details */}
      <div className="flex-1 h-full overflow-auto md:h-auto md:mb-12">
        <Slider images={singlePostData.images} />
        <div className="mt-8 space-y-6">
          <h1 className="text-2xl font-bold">{singlePostData.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MdLocationOn className="w-5 h-5 text-red-500" />
            <span>{singlePostData.address}</span>
          </div>
          <div className="px-4 py-2 bg-yellow-300/50 rounded-lg inline-block text-xl font-semibold">
            $ {singlePostData.price}
          </div>
          <div className="text-gray-700 leading-6">
            {singlePostData.description}
          </div>
        </div>
      </div>

      {/* Right Section: Features and User Info */}
      <div className="w-full lg:w-1/3 bg-[#fcf5f3] h-full overflow-auto md:h-auto md:mb-12 p-5 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4 bg-yellow-300/20 p-4 rounded-lg">
          <img
            src={userData.img}
            alt={userData.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="font-semibold text-lg">{userData.name}</span>
        </div>

        {/* General Features */}
        <div>
          <h2 className="font-bold text-lg mb-3">General</h2>
          <div className="bg-white p-4 rounded-lg space-y-4">
            {[{ icon: <MdOutlineAttachMoney />, title: "Utilities", desc: "Renter is responsible" },
              { icon: <MdOutlinePets />, title: "Pet Policy", desc: "Pets Allowed" },
              { icon: <MdOutlineAttachMoney />, title: "Property Fees", desc: "Must have 3x the rent in total household income" }
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

        {/* Sizes */}
        <div>
          <h2 className="font-bold text-lg mb-3">Sizes</h2>
          <div className="flex justify-between bg-white p-4 rounded-lg text-sm">
            {[{ icon: <MdAspectRatio />, text: "80 sqft" },
              { icon: <MdHotel />, text: "2 beds" },
              { icon: <MdBathtub />, text: "1 bathroom" }
            ].map((size, index) => (
              <div className="flex items-center gap-2" key={index}>
                <div className="w-6 h-6 flex items-center justify-center">
                  {size.icon}
                </div>
                <span>{size.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Places */}
        <div>
          <h2 className="font-bold text-lg mb-3">Nearby Places</h2>
          <div className="space-y-4">
            {[{ icon: <MdSchool />, title: "School", desc: "250m away" },
              { icon: <MdDirectionsBus />, title: "Bus Stop", desc: "100m away" },
              { icon: <MdRestaurant />, title: "Restaurant", desc: "200m away" }
            ].map((place, index) => (
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg" key={index}>
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
          <h2 className="font-bold text-lg mb-3">Location</h2>
          <div className="w-full h-52 rounded-lg overflow-hidden">
            <Map items={[singlePostData]} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          {[{ icon: <MdChat />, text: "Send a Message" },
            { icon: <MdBookmark />, text: "Save the Place" }
          ].map((button, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-yellow-300 rounded-lg text-sm hover:bg-yellow-50"
            >
              {button.icon}
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
