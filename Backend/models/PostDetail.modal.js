const mongoose = require('mongoose');

const postDetailSchema = new mongoose.Schema(
  {
    desc: { type: String, required: true }, // Description
    utilities: { type: String, enum: ["owner", "tenant", "shared"], required: true }, // Utilities Policy
    pet: { type: String, enum: ["allowed", "not-allowed"], required: true }, // Pet Policy
    size: { type: Number, required: true }, // Total Size (sqft)
    school: { type: Number, required: true }, // School Distance (km)
    bus: { type: Number, required: true }, // Bus Stop Distance (km)
    restaurant: { type: Number, required: true }, // Restaurant Distance (km)
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to Post
  },
  { timestamps: true }
);

const PostDetail = mongoose.model("PostDetail", postDetailSchema);
module.exports = PostDetail;
