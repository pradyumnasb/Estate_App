import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000", { withCredentials: true });

function ChatPopup({ chatId, userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when chat opens
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId]);

  // Listen for new messages
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        chatId,
        text: message,
        userId,
      };
  
      try {
        // ✅ Send message to backend
        const res = await axios.post(
          `http://localhost:4000/api/messages/${chatId}`,
          newMessage,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
  
        const savedMessage = res.data; // ✅ Store returned message
        setMessages((prev) => [...prev, savedMessage]);
  
        // ✅ Emit via socket
        socket.emit("sendMessage", savedMessage);
  
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };
  

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={chatRef}
      className="fixed bottom-4 right-4 w-80 h-96 flex flex-col border rounded-lg shadow-lg p-4 bg-white"
    >
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-red-500 text-xl font-bold"
        onClick={onClose}
        aria-label="Close chat"
      >
        ✖
      </button>

      <h3 className="font-bold mb-2">Chat</h3>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-2 border rounded-lg">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.userId === userId ? "bg-blue-200 text-right" : "bg-gray-300"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500">
              {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Time not available"}
              </span>
            </div>
          ))
        )}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Send button */}
      <div className="flex items-center mt-2">
        <textarea
          className="flex-1 p-2 border rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className={`ml-2 px-4 py-2 rounded-lg ${
            message.trim() ? "bg-yellow-400" : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={sendMessage}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPopup;
