const ReactionModel = require("../models/Reaction");

//! Toggle reaction
const toggleReaction = async (req, res) => {
  const userId = req.userId;
  const { videoId, type } = req.body;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ error: "Неверный тип реакции" });
  }

  try {
    const existing = await ReactionModel.findOne({
      user: userId,
      video: videoId,
    });

    if (!existing) {
      const newReaction = await ReactionModel.create({
        user: userId,
        video: videoId,
        type,
      });
      return res.status(201).json(newReaction);
    }

    if (existing.type === type) {
      await ReactionModel.deleteOne({ _id: existing._id });
      return res.status(200).json({ message: "Реакция удалена" });
    }

    existing.type = type;
    await existing.save();
    return res.status(200).json(existing);
  } catch (error) {
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

//! Get reactions
const getReactions = async (req, res) => {
  const { videoId } = req.params;

  try {
    const likes = await ReactionModel.countDocuments({
      video: videoId,
      type: "like",
    });
    const dislikes = await ReactionModel.countDocuments({
      video: videoId,
      type: "dislike",
    });

    let userReaction = null;
    if (req.user) {
      const found = await ReactionModel.findOne({
        video: videoId,
        user: req.user.userId,
      });
      userReaction = found?.type || null;
    }

    res.json({ likes, dislikes, userReaction });
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения реакций" });
  }
};

//! Get liked video by user
const getLikedVideoByUser = async (req, res) => {
  try {
    const userId = req.userId;

    const likedReactions = await ReactionModel.find({
      user: userId,
      type: "like",
    })
      .sort({ createdAt: -1 })
      .populate("video")
      .exec();

    const likedVideos = likedReactions.map((reaction) => reaction.video);

    res.json(likedVideos);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении лайкнутых видео" });
  }
};

module.exports = { toggleReaction, getReactions, getLikedVideoByUser };
