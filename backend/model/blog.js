const mongoose = require('mongoose');
const User = require("../model/user")

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type:String,

  },
  bio: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;