const PlaylistModel = require("../models/Playlist");

//! Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const doc = await PlaylistModel({
      title: req.body.title,
      description: req.body.description,
      videos: req.body.videos || [],
      user: req.userId,
      isVisible: req.body.isVisible,
    });

    const playlist = await doc.save();
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось создать плейлист",
    });
  }
};

//! Get all playlists
const getAllPlaylists = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { user: userId } : {};
    const playlists = await PlaylistModel.find({ isVisible: true }, filter)
      .populate("user")
      .populate("videos");
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось получить плейлисты",
    });
  }
};

//! Get one playlist
const getOnePlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.id)
      .populate("user")
      .populate("videos");

    if (!playlist) {
      return res.status(404).json({
        message: "Плейлист не найден",
      });
    }

    if (!playlist.isVisible && playlist.user._id.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа к плейлисту",
      });
    }

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось получить плейлисты",
    });
  }
};

//! Get playlists by user
const getPlaylistsByUser = async (req, res) => {
  try {
    const requestingUserId = req.userId;
    const requestedUserId = req.params.userId; 

    const isOwner = requestingUserId === requestedUserId;

    const playlists = await PlaylistModel.find({
      user: requestedUserId,
      ...(isOwner ? {} : { isVisible: true }), 
    });

    res.json(playlists);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка при получении плейлистов пользователя" });
  }
};

//! Push video in playlist
const pushVideoInPlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        message: "Плейлист не найден",
      });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа к плейлисту",
      });
    }

    if (playlist.videos.includes(req.body.videoId)) {
      return res
        .status(400)
        .json({ message: "Видео уже добавлено в плейлист" });
    }

    playlist.videos.push(req.body.videoId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось добавить видео в плейлист",
    });
  }
};

//! Delete video in playlist
const deleteVideoInPlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        message: "Плейлист не найден",
      });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа к плейлисту",
      });
    }

    playlist.videos.pop(req.body.videoId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось добавить видео в плейлист",
    });
  }
};

//! Update playlist

//! Delete playlist
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistModel.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        message: "Плейлист не найден",
      });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет доступа к плейлисту",
      });
    }

    await playlist.deleteOne();
    res.json({ message: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Не удалось удалить плейлист",
    });
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getOnePlaylist,
  pushVideoInPlaylist,
  deleteVideoInPlaylist,
  deletePlaylist,
  getPlaylistsByUser,
};
