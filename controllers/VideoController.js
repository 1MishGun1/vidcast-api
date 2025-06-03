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

//! Get all videos
const getAllVideos = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { user: userId } : {};

    const videos = await VideoModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("user");
    res.json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось отобразить все видео",
    });
  }
};

//! Get tags
const getLastTags = async (req, res) => {
  try {
    const videos = await VideoModel.find().limit(5).exec();

    const tags = videos
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось отобразить все видео",
    });
  }
};

//! Get one video
const getOneVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const updateVideoViews = await VideoModel.findByIdAndUpdate(
      {
        _id: videoId,
      },
      {
        $inc: { views: 1 },
      },
      { new: true }
    ).populate("user");

    if (!updateVideoViews) {
      return res.status(404).json({
        message: "Запрашиваемое видео отсутствует",
      });
    }

    res.json(updateVideoViews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось отобразить данное видео",
    });
  }
};

//! Get trending videos
const getTrendingVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find({ views: { $gte: 300 } })
      .sort({ views: -1 })
      .populate("user");

    res.json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось отобразить трендовые видео",
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const updateVideo = await VideoModel.findOneAndUpdate(
      {
        _id: videoId,
      },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          tags: req.body.tags,
          cover: req.body.cover,
          videoUrl: req.body.videoUrl,
          user: req.userId,
        },
      },
      {
        new: true,
      }
    );

    if (!updateVideo) {
      return res.status(404).json({
        message: "Запрашиваемое видео отсутствует",
      });
    }

    res.json({
      update: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось обновить данные видео",
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const deleteVideo = await VideoModel.findOneAndDelete({
      _id: videoId,
    });

    if (!deleteVideo) {
      return res.status(404).json({
        message: "Запрашиваемое видео отсутствует",
      });
    }

    res.json({
      delete: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось удалить видео",
    });
  }
};

module.exports = {
  createVideo,
  getAllVideos,
  getLastTags,
  getOneVideo,
  updateVideo,
  deleteVideo,
  getTrendingVideos,
};
