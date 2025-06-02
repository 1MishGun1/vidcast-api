const reactionRouter = require("express").Router();
const {
  toggleReaction,
  getReactions,
  getLikedVideoByUser,
} = require("../controllers/ReactionController");
const checkMe = require("../middlewares/checkMe");

//! Like / Dislike
reactionRouter.post("/", checkMe, toggleReaction);

//! Get reaction
reactionRouter.get("/:videoId", checkMe, getReactions);

//! Get liked video by user
reactionRouter.get("/liked/me", checkMe, getLikedVideoByUser);

module.exports = reactionRouter;
