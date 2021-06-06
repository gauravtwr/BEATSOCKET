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
  language: {
    type: String,
    enum: ["English", "Hindi"],
    default: "Hindi",
  },
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
  media: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Song", songSchema);
