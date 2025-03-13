const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { createServer } = require("http"); // Import HTTP server
const { Server } = require("socket.io"); // Import Socket.io

const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const testRoute = require("./routes/test.route");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chat.route");
const messageRoute = require("./routes/message.route");

const Chat = require("./models/Chat.modal"); // Import Chat model
const Message = require("./models/Message.modal"); // Import Message model

dotenv.config();

const app = express();
const server = createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Use routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Socket.io Connection Handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining chat
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Handle incoming messages (store in MongoDB)
  socket.on("sendMessage", async (messageData) => {
    try {
      console.log("Received Message:", messageData);

      const { chatId, text, userId } = messageData;

      // Check if chat exists
      const chat = await Chat.findById(chatId);
      if (!chat) return console.error("Chat not found!");

      // Save message in MongoDB
      const message = new Message({
        text,
        chat: chatId,
        userId,
      });
      await message.save();

      // Update chat with last message
      await Chat.findByIdAndUpdate(chatId, {
        $set: { lastMessage: text },
        $push: { messages: message._id },
        $addToSet: { seenBy: userId },
      });

      // Emit the message to users in the chat room
      io.to(chatId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
