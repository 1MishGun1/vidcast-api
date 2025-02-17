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
    const videos = await VideoModel.find().populate("user").exec();
    res.json(videos);
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
    );

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
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Не удалось обновить данные видео",
    });
  }
};

module.exports = { createVideo, getAllVideos, getOneVideo, updateVideo };
