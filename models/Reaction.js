const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reaction", ReactionSchema);
