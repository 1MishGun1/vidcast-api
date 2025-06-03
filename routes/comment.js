const commentRouter = require("express").Router();
const {
  getCommentsByVideo,
  createComment,
  deleteComment,
} = require("../controllers/CommentController");
const checkMe = require("../middlewares/checkMe");

//! Get comments by video
commentRouter.get("/:videoId", checkMe, getCommentsByVideo);

//! Create comment by video
commentRouter.post("/", checkMe, createComment);

//! Delete comment by video
commentRouter.delete("/:id", checkMe, deleteComment);

module.exports = commentRouter;
