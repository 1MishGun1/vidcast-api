const uploadRouter = require("express").Router();
const checkMe = require("../middlewares/checkMe");
const upload = require("../controllers/UploadController");
const UserModel = require("../models/User");

//! Upload video
uploadRouter.post(
  "/uploads/videos",
  checkMe,
  upload.single("video"),
  (req, res) => {
    res.json({
      url: `/uploads/videos/${req.file.filename}`,
    });
  }
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
  upload.single("imgUser"), // или другой актуальный ключ
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
      }

      const filePath = `/uploads/coversUsers/${req.file.filename}`;
      const userId = req.userId;

      // Сохраняем путь в поле coverProfile пользователя
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
uploadRouter.post(
  "/uploads/avatars",
  // checkMe,
  upload.single("avatar"),
  (req, res) => {
    res.json({
      url: `/uploads/avatars/${req.file.filename}`,
    });
  }
);

module.exports = uploadRouter;
