const VideoModel = require("../models/Video");

//! Create a new video
const createVideo = async (req, res) => {
  try {
    const doc = await VideoModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      cover: req.body.cover,
      videoUrl: req.body.videoUrl,
      user: req.userId,
    });

    const video = await doc.save();
    res.json(video);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось создать видео",
    });
  }
};

module.exports = createVideo;
