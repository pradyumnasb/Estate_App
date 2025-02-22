const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const testRoute = require('./routes/test.route');
const userRoute = require('./routes/user.route'); // ✅ Added User Routes
const cookieParser = require('cookie-parser');

dotenv.config(); 

const app = express();

// Use middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json()); 
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Use routes
app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);
app.use('/api/users', userRoute); // ✅ Added User Routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
