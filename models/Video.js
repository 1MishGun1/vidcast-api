const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    cover: String,
    videoUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", VideoSchema);
