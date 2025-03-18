import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ChatPopup from "./ChatPopup"; // Import the new ChatPopup component

const socket = io("http://localhost:4000", { withCredentials: true });

function Chat({ userId }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/chats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const fetchMessages = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await axios.get(`http://localhost:4000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = (chatId, text) => {
    const newMessage = {
      chatId,
      text,
      userId,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-full flex flex-col border rounded-lg shadow-lg p-4 bg-white">
      <h1 className="font-bold text-lg mb-3">Messages</h1>

      {/* Chat List */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-scroll scrollbar-hide">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500">Start a conversation now!</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-gray-200 ${
                selectedChat === chat._id ? "bg-yellow-300" : ""
              }`}
              onClick={() => fetchMessages(chat._id)}
            >
              <span className="font-semibold">{chat.receiver?.username}</span>
            </div>
          ))
        )}
      </div>

      {/* Chat Popup */}
      {selectedChat && (
        <ChatPopup
          chatId={selectedChat}
          userId={userId}
          messages={messages}
          onClose={() => setSelectedChat(null)}
          onSendMessage={sendMessage}
        />
      )}
    </div>
  );
}

export default Chat;
