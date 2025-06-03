const CommentModel = require("../models/Comment");
const VideoModel = require("../models/Video");

//! Get comments by video
const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await CommentModel.find({
      video: videoId,
      parentComment: null,
    })
      .populate("user", "login avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "login avatar",
        },
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Не удалось получить комментарии к видео" });
  }
};

//! Create comment
const createComment = async (req, res) => {
  const { text, videoId, parentCommentId } = req.body;
  try {
    const doc = await CommentModel({
      text: text,
      user: req.userId,
      video: videoId,
      parentComment: parentCommentId || null,
    });

    const comment = await doc.save();

    const video = await VideoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (parentCommentId) {
      await CommentModel.findByIdAndUpdate(parentCommentId, {
        $push: { replies: savedComment._id },
      });
    }

    const populatedComment = await CommentModel.findById(comment._id).populate(
      "user",
      "login avatar"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Не удалось создать комментарий" });
  }
};

//! Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query;

    const comment = await CommentModel.findById(id).populate("video", "user");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = comment.user.equals(userId);
    const isVideoAuthor = comment.videoId.user.equals(userId);

    if (!isAuthor && !isVideoAuthor) {
      return res
        .status(403)
        .json({ message: "Нельзя удалить комментарий из-за не авторизации" });
    }

    // Удаляем все ответы на этот комментарий
    await CommentModel.deleteMany({ _id: { $in: comment.replies } });

    // Если это ответ, удаляем ссылку из родительского комментария
    if (comment.parentComment) {
      await CommentModel.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    await CommentModel.findByIdAndDelete(id);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Не удалось удалить комментарий" });
  }
};

module.exports = { getCommentsByVideo, createComment, deleteComment };
