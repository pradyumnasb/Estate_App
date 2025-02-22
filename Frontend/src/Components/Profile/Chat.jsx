import { useState } from "react";

function Chat() {
  const [chat, setChat] = useState(true);

  return (
    <div className="h-full flex flex-col">
      {/* Messages List */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-scroll scrollbar-hide">
        <h1 className="font-bold">Messages</h1>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg flex items-center gap-5 cursor-pointer"
          >
            <img
              src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold">John Doe</span>
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      {chat && (
        <div className="flex-1 bg-white flex flex-col justify-between">
          {/* Chat Header */}
          <div className="bg-yellow-300/50 p-5 font-bold flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
                className="w-7.5 h-7.5 rounded-full object-cover"
              />
              John Doe
            </div>
            <span className="cursor-pointer" onClick={() => setChat(null)}>
              X
            </span>
          </div>

          {/* Chat Messages */}
          <div className="h-[350px] overflow-scroll scrollbar-hide p-5 flex flex-col gap-5">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className={`w-1/2 ${
                  index % 2 === 1 ? "self-end text-right" : ""
                }`}
              >
                <p>Lorem ipsum dolor sit amet</p>
                <span className="text-xs bg-yellow-300/25 p-0.5 rounded">
                  1 hour ago
                </span>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="border-t-2 border-yellow-300/50 h-15 flex items-center justify-between">
            <textarea className="flex-3 h-full border-none p-5" />
            <button className="flex-1 bg-yellow-300/50 h-full border-none cursor-pointer">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
