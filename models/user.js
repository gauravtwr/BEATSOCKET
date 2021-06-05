const mongoose = require("mongoose");
const Song = require("./song");

var userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["Artist", "User"],
    default: "User",
  },
  name: {
    type: String,
    uppercase: true,
    required: "Required field",
  },
  phone: {
    type: Number,
    min: [10, "Enter valid number"],
  },
  userid: {
    type: String,
    lowercase: true,
    required: "Required field",
  },
  email: {
    type: String,
    required: "Required field",
  },
  password: {
    type: String,
    required: "Required field",
  },
  confirmPassword: {
    type: String,
    required: "Required field",
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
