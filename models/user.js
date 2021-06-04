const mongoose = require("mongoose");
const Song = require("./song");

var userSchema = new mongoose.Schema({
  role: ["artist", "user"],
  name: {
    type: String,
    uppercase: true,
    required: true,
  },
  phone: {
    type: Number,
    minlength: 10,
  },
  userid: {
    type: String,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Song,
    },
  ],
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Song,
    },
  ],
  uploads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Song,
    },
  ],
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Song,
    },
  ],
  views: [
    {
      song: mongoose.Schema.Types.ObjectId,
      count: Number,
    },
  ],
  likes: [
    {
      song: mongoose.Schema.Types.ObjectId,
      count: Number,
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
