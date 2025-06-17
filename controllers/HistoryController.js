const History = require("../models/History");

const addAndUpdateHistory = async (req, res) => {
  const { videoId } = req.body;
  const userId = req.user.id;

  try {
    const existing = await History.findOne({ user: userId, video: videoId });

    if (existing) {
      existing.viewedAt = new Date();
      await existing.save();
      return res.status(200).json(existing);
    }

    const newEntry = await History.create({
      user: userId,
      video: videoId,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Failed to update history", error: err });
  }
};

const getHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await History.find({ user: userId })
      .populate("video")
      .sort({ viewedAt: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to get history", error: err });
  }
};

module.exports = { addAndUpdateHistory, getHistory };
