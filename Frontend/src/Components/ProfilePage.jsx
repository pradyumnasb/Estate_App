import Chat from "../Components/Profile/Chat";
import List from "../Components/Profile/List";

function ProfilePage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] mt-8 mx-12 gap-8">
      {/* Left Side: User Info and Lists with Scroll */}
      <div className="flex flex-col gap-8 w-full lg:w-3/4 p-8 overflow-y-scroll scrollbar-hide bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-light text-xl">User Information</h1>
          <button className="px-6 py-3 bg-yellow-400 cursor-pointer border-none rounded-xl shadow-sm">Update Profile</button>
        </div>

        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-5">
            Avatar:
            <img
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
          </span>
          <span className="flex items-center gap-5">
            Username: <b>John Doe</b>
          </span>
          <span className="flex items-center gap-5">
            E-mail: <b>john@gmail.com</b>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="font-light text-xl">My List</h1>
          <button className="px-6 py-3 bg-yellow-400 cursor-pointer border-none rounded-xl shadow-sm">Create New Post</button>
        </div>
        <List />

        <div className="flex items-center justify-between">
          <h1 className="font-light text-xl">Saved List</h1>
        </div>
        <List />

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">1</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">2</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">3</button>
        </div>
      </div>

      {/* Right Side: Fixed Chat */}
      <div className="w-full lg:w-1/3 h-[calc(100vh-4rem)] sticky top-16 p-6 bg-gradient-to-b from-[#fcf5f3] to-[#fce7e3] rounded-3xl shadow-xl flex flex-col">
        <h1 className="font-semibold text-2xl text-gray-800 mb-4">Messages</h1>
        <div className="flex-grow overflow-hidden rounded-xl shadow-md bg-white p-4">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;