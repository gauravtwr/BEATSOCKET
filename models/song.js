const mongoose = require("mongoose");
const User = require("./user");

var songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  language: ["English", "Hindi"],
  genre: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
});

module.exports = mongoose.model("Song", songSchema);
