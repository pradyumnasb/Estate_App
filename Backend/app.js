const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { createServer } = require("http"); 
const socket = require("./socket"); // ✅ Import the socket module

const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const testRoute = require("./routes/test.route");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chat.route");
const messageRoute = require("./routes/message.route");
const workerRoute = require("./routes/worker.routes");
const bookingRoutes = require("./routes/booking.routes");
const notificationRoutes = require("./routes/notification.routes");


dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Initialize socket.io
socket.init(server);

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
app.use("/api/workers", workerRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
