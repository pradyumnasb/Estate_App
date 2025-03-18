const { Server } = require("socket.io");
const Chat = require("./models/Chat.modal");
const Message = require("./models/Message.modal");

let io;
const bookingTimeouts = {}; // Store timeouts for each booking request

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // 📌 WORKER & USER ROOM JOINING
      socket.on("workerConnected", (workerId) => {
        socket.join(workerId);
        console.log(`📢 Worker ${workerId} joined their room automatically`);
      });

      socket.on("joinWorkerRoom", (workerId) => {
        socket.join(workerId);
        console.log(`📢 Worker ${workerId} joined room: ${workerId}`);
      });

      socket.on("joinUserRoom", (userId) => {
        socket.join(userId);
        console.log(`📢 User ${userId} joined room: ${userId}`);
      });

      // 📌 CHAT FEATURE
      socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`💬 User joined chat room: ${chatId}`);
      });

      socket.on("sendMessage", async (messageData) => {
        try {
          console.log("📨 Received Message:", messageData);
          const { chatId, text, userId } = messageData;

          const chat = await Chat.findById(chatId);
          if (!chat) return console.error("🚨 Chat not found!");

          const message = new Message({ text, chat: chatId, userId });
          await message.save();

          await Chat.findByIdAndUpdate(chatId, {
            $set: { lastMessage: text },
            $push: { messages: message._id },
            $addToSet: { seenBy: userId },
          });

          io.to(chatId).emit("receiveMessage", message);
        } catch (error) {
          console.error("❌ Error saving message:", error.message);
        }
      });

      // 📌 REAL-TIME BOOKING REQUESTS
      socket.on("bookingRequest", ({ workerId, userId, userDetails }) => {
        console.log(`📌 Booking request from User ${userId} to Worker ${workerId}`);

        // Send real-time notification to the worker
        io.to(workerId).emit("newBookingRequest", {
          userId,
          userDetails,
        });

        // Auto-decline after 30 minutes if no response
        const timeout = setTimeout(() => {
          console.log(`⏳ Booking auto-declined for Worker ${workerId}`);

          io.to(userId).emit("bookingRejected", {
            message: "Worker did not respond in time. Try another worker.",
          });

          io.to(workerId).emit("bookingExpired", {
            message: "You did not respond in time. Booking expired.",
          });

        }, 30 * 60 * 1000); // 30 minutes

        // Store the timeout reference
        bookingTimeouts[`${workerId}-${userId}`] = timeout;
      });

      // 📌 HANDLE BOOKING RESPONSE (Accept/Decline)
      socket.on("bookingResponse", ({ workerId, userId, accepted }) => {
        const timeoutKey = `${workerId}-${userId}`;
        if (bookingTimeouts[timeoutKey]) {
          clearTimeout(bookingTimeouts[timeoutKey]); // ✅ Clear timeout
          delete bookingTimeouts[timeoutKey]; // ✅ Remove reference
        }

        if (accepted) {
          console.log(`✅ Worker ${workerId} accepted booking from User ${userId}`);
          io.to(userId).emit("bookingConfirmed", {
            message: "Your booking has been confirmed!",
          });
        } else {
          console.log(`❌ Worker ${workerId} declined booking from User ${userId}`);
          io.to(userId).emit("bookingRejected", {
            message: "Worker declined your booking.",
          });
        }
      });

      // 📌 DISCONNECT HANDLING
      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
