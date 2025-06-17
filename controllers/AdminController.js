const UserModel = require("../models/User.js");
const VideoModel = require("../models/Video.js");
const CommentModel = require("../models/Comment.js");
const PlaylistModel = require("../models/Playlist.js");
const ReactionModel = require("../models/Reaction.js");

const blockUserTemporarily = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, expiresAt } = req.body;

    await UserModel.findByIdAndUpdate(userId, {
      isBlocked: true,
      blockReason: reason,
      blockExpiresAt: new Date(expiresAt),
    });

    res.json({ message: "Пользователь временно заблокирован" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при блокировке" });
  }
};

const blockUserPermanently = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    await UserModel.findByIdAndUpdate(userId, {
      isBlocked: true,
      blockReason: reason,
      blockExpiresAt: null,
    });

    // Удаляем данные пользователя
    await Promise.all([
      VideoModel.deleteMany({ user: userId }),
      CommentModel.deleteMany({ user: userId }),
      PlaylistModel.deleteMany({ user: userId }),
      ReactionModel.deleteMany({ user: userId }),
    ]);

    res.json({
      message: "Пользователь заблокирован навсегда и все данные удалены",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при перманентной блокировке" });
  }
};

module.exports = { blockUserTemporarily, blockUserPermanently };
