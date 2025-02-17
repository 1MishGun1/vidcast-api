const uploadRouter = require("express").Router();
const checkMe = require("../middlewares/checkMe");
const upload = require("../controllers/UploadController");

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
  upload.single("imgUser"),
  (req, res) => {
    res.json({
      url: `/uploads/coversUsers/${req.file.filename}`,
    });
  }
);

//! Upload avatars user
uploadRouter.post(
  "/uploads/avatars",
  checkMe,
  upload.single("avatar"),
  (req, res) => {
    res.json({
      url: `/uploads/avatars/${req.file.filename}`,
    });
  }
);

module.exports = uploadRouter;
