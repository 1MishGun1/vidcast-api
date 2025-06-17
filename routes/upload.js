const uploadRouter = require("express").Router();
const checkMe = require("../middlewares/checkMe");
const upload = require("../controllers/UploadController");
const compressVideo = require("../controllers/CompressController");
const UserModel = require("../models/User");

//! Upload video
uploadRouter.post(
  "/uploads/videos",
  checkMe,
  upload.single("video"),
  compressVideo.uploadVideo
);

//! Get progress HLS-work
uploadRouter.get(
  "/uploads/progress/:videoId",
  checkMe,
  compressVideo.getHlsProgress
);

//! Upload cover for video
uploadRouter.post(
  "/uploads/coversVideos",
  checkMe,
  upload.single("imgVideo"),
  (req, res) => {
    res.json({
      url: `/uploads/coversVideos/${req.file.filename}`,
    });
  }
);

//! Upload cover for user
uploadRouter.post(
  "/uploads/coversUsers",
  checkMe,
  upload.single("imgUser"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
      }

      const filePath = `/uploads/coversUsers/${req.file.filename}`;
      const userId = req.userId;

      await UserModel.findByIdAndUpdate(userId, {
        coverProfile: filePath,
      });

      res.json({ url: filePath });
    } catch (err) {
      console.error("Ошибка при сохранении обложки:", err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

//! Upload avatars user
uploadRouter.post("/uploads/avatars", upload.single("avatar"), (req, res) => {
  res.json({
    url: `/uploads/avatars/${req.file.filename}`,
  });
});

module.exports = uploadRouter;
