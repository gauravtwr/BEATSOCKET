const mongoose = require("mongoose");

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
  media: {
    data: Buffer,
    contentType: String,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
