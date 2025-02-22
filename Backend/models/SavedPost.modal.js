const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const SavedPost = mongoose.model('SavedPost', savedPostSchema);
module.exports = SavedPost;
